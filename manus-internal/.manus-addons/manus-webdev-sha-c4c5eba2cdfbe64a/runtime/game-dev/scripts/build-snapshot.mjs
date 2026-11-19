import { reserveBuildStorage, storageError } from './storage-capacity.mjs'
import { prunePreviewHistory } from './preview-state.mjs'
import { buildKey, collectBuildInputs } from './build-inputs.mjs'
import { excludeSnapshotInput, gitSnapshotPaths } from './snapshot-inputs.mjs'
import { createHash, randomBytes } from 'node:crypto'
import { closeSync, copyFileSync, existsSync, lstatSync, mkdirSync, openSync, readFileSync, readdirSync, realpathSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { execFileSync } from 'node:child_process'
import { releaseFiles, verifyRelease } from './release-manifest.mjs'
import { isProvenanceGeneratedPath, provenanceSourceBytes, reconcileProvenance } from './asset-provenance.mjs'

export const MAX_SNAPSHOT_FILES = 20_000
export const MAX_SNAPSHOT_BYTES = 2 * 1024 * 1024 * 1024
export const snapshotDigest = value => 'sha256:' + createHash('sha256').update(JSON.stringify(value)).digest('hex')
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const changed = () => Object.assign(new Error('Game release inputs changed during snapshot capture; retry when edits settle'), { code: 'GAME_CHECKPOINT_SOURCE_CHANGED' })

function provenanceSourceFiles(root, files) {
  const source = { ...files }
  for (const rel of Object.keys(source)) if (isProvenanceGeneratedPath(rel)) delete source[rel]
  if (Object.hasOwn(source, 'asset-provenance.json')) source['asset-provenance.json'] =
    'sha256:' + createHash('sha256').update(provenanceSourceBytes(readFileSync(join(root, 'asset-provenance.json')))).digest('hex')
  return source
}
function gitHead(root) {
  try { return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, stdio: 'pipe', timeout: 10_000, encoding: 'utf8' }).trim() }
  catch { return null }
}

export function snapshotSourceFiles(root, paths = null, { hashContents = true } = {}) {
  let count = 0
  let total = 0
  const files = releaseFiles(root, (rel, entry) => {
    if (excludeSnapshotInput(rel, entry, paths)) return true
    if (entry.isFile()) {
      total += lstatSync(join(root, rel)).size
      if (++count > MAX_SNAPSHOT_FILES || total > MAX_SNAPSHOT_BYTES) throw new Error('Game release snapshot exceeds its file or byte limit')
    }
    return false
  }, { hashContents })
  // Executable-bit edits are source edits too, even when file bytes are unchanged.
  if (hashContents) for (const file of Object.keys(files)) files[file] += lstatSync(join(root, file)).mode & 0o111 ? ':100755' : ':100644'
  return files
}

function directory(parent, name) {
  const path = join(parent, name)
  if (!existsSync(path)) mkdirSync(path)
  if (!lstatSync(path).isDirectory() || lstatSync(path).isSymbolicLink() || realpathSync(path) !== path) throw new Error('Game release snapshot directory is invalid')
  return path
}

export function snapshotsDirectory(root) {
  return directory(directory(realpathSync(root), 'dist'), '.snapshots')
}

// Ownership is outside the frozen project, so it never changes source identity.
function ownerStart(pid) {
  try { const stat = readFileSync(`/proc/${pid}/stat`, 'utf8'); return stat.slice(stat.lastIndexOf(')') + 1).trim().split(/\s+/)[19] }
  catch { return null }
}
export function pruneAbandonedSnapshots(root) {
  // Recovery may refer to the previous pointer as well as the current one.
  // Leave every candidate untouched until that transaction has been recovered.
  if (existsSync(join(root, 'dist/.site-install.json'))) return []
  const cache = snapshotsDirectory(root)
  let prepared
  try {
    prepared = JSON.parse(readFileSync(join(cache, 'prepared.json'), 'utf8')).candidate
    if (!/^candidate-[a-f0-9]{24}$/.test(prepared)) return []
  } catch (error) { if (error.code !== 'ENOENT') return [] }
  const removed = []
  for (const candidate of readdirSync(cache)) {
    if (!existsSync(join(cache, candidate))) continue
    if (/^candidate-[a-f0-9]{24}\.owner\.json$/.test(candidate) && !existsSync(join(cache, candidate.replace(/\.owner\.json$/, '')))) {
      const marker = join(cache, candidate)
      if (lstatSync(marker).isFile() && !lstatSync(marker).isSymbolicLink()) rmSync(marker)
      continue
    }
    if (/^\.prepared-[a-f0-9]{16}\.tmp$/.test(candidate)) {
      const temporary = join(cache, candidate)
      if (lstatSync(temporary).isFile() && !lstatSync(temporary).isSymbolicLink()) rmSync(temporary)
      continue
    }
    if (!/^candidate-[a-f0-9]{24}$/.test(candidate) || candidate === prepared) continue
    const container = join(cache, candidate)
    try {
      if (!lstatSync(container).isDirectory() || realpathSync(container) !== container) continue
      const sidecar = join(cache, candidate + '.owner.json')
      const marker = existsSync(sidecar) ? sidecar : join(container, '.owner.json')
      if (!lstatSync(marker).isFile() || lstatSync(marker).isSymbolicLink()) continue
      const owner = JSON.parse(readFileSync(marker, 'utf8'))
      if (owner.version !== 1 || !Number.isSafeInteger(owner.pid) || owner.pid <= 0 ||
          !(owner.start === null || typeof owner.start === 'string')) continue
      let dead = false
      try { process.kill(owner.pid, 0); const actual = ownerStart(owner.pid); dead = owner.start !== null && actual !== null && actual !== owner.start }
      catch (error) { dead = error.code === 'ESRCH' }
      if (!dead) continue
      rmSync(container, { recursive: true, force: true })
      rmSync(sidecar, { force: true })
      removed.push(candidate)
    } catch { /* Unknown, legacy or unreadable ownership is never collectible. */ }
  }
  return removed
}

/** Caller holds the project export lock. No hard links or writes to source. */
export function captureBuildSnapshot(root, toolchain, { afterCopy, includeLocalAssets = false } = {}) {
  root = realpathSync(root)
  const cache = snapshotsDirectory(root)
  pruneAbandonedSnapshots(root)
  prunePreviewHistory(root)
  const head = gitHead(root)
  for (let attempt = 0; attempt < 3; attempt++) {
    const container = join(cache, `candidate-${randomBytes(12).toString('hex')}`)
    let storage
    try {
      // Publish ownership first: a kill after mkdir can never create an anonymous
      // candidate indistinguishable from protected historical snapshots.
      writeFileSync(container + '.owner.json', JSON.stringify({ version: 1, pid: process.pid, start: ownerStart(process.pid) }), { flag: 'wx', mode: 0o600 })
      mkdirSync(container)
      const project = directory(container, 'project')
      if (existsSync(join(root, 'dist/.asset-edit-lock'))) throw changed()
      const files = snapshotSourceFiles(root, gitSnapshotPaths(root, { includeLocalAssets }))
      const sourceUsage = { bytes: Object.keys(files).reduce((bytes, rel) => bytes + lstatSync(join(root, rel)).size, 0), inodes: Object.keys(files).length }
      storage = reserveBuildStorage(join(root, 'dist'), sourceUsage)
      let copied = 0
      for (const rel of Object.keys(files)) {
        const source = join(root, rel)
        if (!lstatSync(source).isFile() || lstatSync(source).isSymbolicLink() || realpathSync(source) !== source) throw changed()
        mkdirSync(dirname(join(project, rel)), { recursive: true })
        if (copied++ % 64 === 0 || lstatSync(source).size >= 8 * 1024 ** 2) storage.check()
        copyFileSync(source, join(project, rel))
      }
      storage.check()
      afterCopy?.(attempt)
      if (existsSync(join(root, 'dist/.asset-edit-lock'))) throw changed()
      if (!same(files, snapshotSourceFiles(project)) || !same(files, snapshotSourceFiles(root, gitSnapshotPaths(root, { includeLocalAssets })))) throw changed()
      return { container, project, sourceRoot: root, files, toolchain, head, includeLocalAssets, storage }
    } catch (error) {
      rmSync(container, { recursive: true, force: true })
      rmSync(container + '.owner.json', { force: true })
      storage?.release()
      error = storageError(error)
      if (error.code !== 'GAME_CHECKPOINT_SOURCE_CHANGED' || attempt === 2) throw error
    }
  }
}

export function buildSnapshotIdentity(snapshot, { dirtyAssets = false, includeLocalAssets = snapshot.includeLocalAssets ?? false } = {}) {
  const source = collectBuildInputs(snapshot.project, {
    paths: gitSnapshotPaths(snapshot.project, { includeLocalAssets }), allowDirtyManaged: dirtyAssets,
  })
  return { version: 1, snapshotId: buildKey(source, snapshot.toolchain), toolchain: snapshot.toolchain }
}

// Godot can regenerate cache destinations when an existing import sidecar was
// created on another machine. Only the hash in generated cache locations may
// change; resource UIDs, source paths and import settings remain frozen.
export function importCacheIdentity(bytes) {
  let section = ''
  return bytes.toString().split('\n').map(line => {
    const header = line.match(/^\[([^\]]+)\]$/)
    if (header) section = header[1]
    if ((section === 'remap' && /^path(\.[a-z0-9_]+)?=/.test(line)) || (section === 'deps' && line.startsWith('dest_files='))) {
      return line.replace(/(res:\/\/\.godot\/imported\/[^"\/\\]+-)[a-f0-9]{32}((?:\.[a-z0-9]+)+")/g, '$1<CACHE>$2')
    }
    return line
  }).join('\n')
}

// Stabilization permits cache-only rewrites in existing import sidecars. Treat
// those as equivalent for provenance copyback, while leaving the user's bytes alone.
function copybackSourceFiles(root, files) {
  const source = provenanceSourceFiles(root, files)
  for (const rel of Object.keys(source)) if (rel.endsWith('.import')) source[rel] =
    'sha256:' + createHash('sha256').update(importCacheIdentity(readFileSync(join(root, rel)))).digest('hex')
  return source
}

// A frozen import may regenerate cache destinations while authored sidecars in
// the workspace stay untouched. Bind that workspace only when every selected
// input is still equivalent; concurrent source/media/import-setting edits win.
export function matchingSourceSnapshotIdentity(snapshot) {
  const root = realpathSync(snapshot.sourceRoot)
  const sourceFiles = () => snapshotSourceFiles(root, gitSnapshotPaths(root, { includeLocalAssets: snapshot.includeLocalAssets }))
  const before = sourceFiles()
  const frozen = snapshotSourceFiles(snapshot.project)
  if (!same(copybackSourceFiles(root, before), copybackSourceFiles(snapshot.project, frozen))) return null
  const identity = buildSnapshotIdentity({ project: root, toolchain: snapshot.toolchain },
    { dirtyAssets: true, includeLocalAssets: snapshot.includeLocalAssets })
  return same(before, sourceFiles()) ? identity : null
}

// Keep a previous export observation only while every authored input still
// matches. Toolchain or network failure must not erase unchanged evidence.
export function refreshBuildProvenance(root, { includeLocalAssets = false, ...options } = {}) {
  const file = join(root, 'asset-provenance.json')
  let previous
  if (existsSync(file) && lstatSync(file).isFile() && !lstatSync(file).isSymbolicLink()) previous = JSON.parse(readFileSync(file, 'utf8'))
  const authoredFingerprint = () => snapshotDigest(copybackSourceFiles(root, snapshotSourceFiles(root, gitSnapshotPaths(root, { includeLocalAssets }))))
  const fingerprint = authoredFingerprint()
  const inherited = previous?.export?.sourceFingerprint === fingerprint
  if (inherited) {
    options.exportInfo = previous.export
    if (previous.export.coverage === 'verified') options.shippedPaths = Object.keys(previous.assets).filter(path => previous.assets[path].shipped === true)
  }
  const value = reconcileProvenance(root, options)
  if (inherited) {
    let unchanged = false
    const sameMedia = Object.keys(value.assets).length === Object.keys(previous.assets).length &&
      Object.entries(value.assets).every(([path, asset]) => previous.assets[path]?.sha256 === asset.sha256 && previous.assets[path]?.size === asset.size)
    try { unchanged = sameMedia && authoredFingerprint() === fingerprint } catch { /* Unreadable inputs cannot retain shipment evidence. */ }
    if (!unchanged) {
      // Reconciliation hashes the current media again. An intervening edit must
      // not label those new bytes as shipped by the previously observed export.
      const { exportInfo, shippedPaths, ...current } = options
      return reconcileProvenance(root, current)
    }
  }
  return value
}

export function recordBuildProvenance(root, evidence, { renderedCaptureRoot = root } = {}) {
  const sourceFingerprint = snapshotDigest(copybackSourceFiles(root, snapshotSourceFiles(root)))
  return reconcileProvenance(root, { ...evidence, renderedCaptureRoot, exportInfo: { ...evidence.exportInfo, sourceFingerprint } })
}

/** Permit new sidecars and regenerated cache paths, never changes to source or import settings. */
export function stabilizeSnapshot(snapshot, build) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const before = snapshotSourceFiles(snapshot.project)
    const importMetadata = new Map(Object.keys(before).filter(file => file.endsWith('.import')).map(file =>
      [file, importCacheIdentity(readFileSync(join(snapshot.project, file)))]))
    build()
    const after = snapshotSourceFiles(snapshot.project)
    if (same(before, after)) return
    if (Object.keys(before).some(file => before[file] !== after[file] &&
      !(Object.hasOwn(after, file) && Object.hasOwn(before, file.replace(/\.import$/, '')) && importMetadata.has(file) &&
        importMetadata.get(file) === importCacheIdentity(readFileSync(join(snapshot.project, file))))) ||
        Object.keys(after).some(file => !Object.hasOwn(before, file) && (!/\.(?:uid|import)$/.test(file) || !Object.hasOwn(before, file.replace(/\.(?:uid|import)$/, ''))))) {
      const changedFiles = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter(file => before[file] !== after[file])
      throw Object.assign(new Error('Game release build modified its frozen inputs: ' + changedFiles.slice(0, 8).join(', ') + '; fix the export plugin before retrying'), { code: 'GAME_CHECKPOINT_SOURCE_CHANGED' })
    }
  }
  throw changed()
}

// Preserve only new import sidecars, and only when their source still matches A.
// Never copy old source/configuration over edits made while A was building.
export function preserveGeneratedImportMetadata(root, snapshot, { includeProvenance = true } = {}) {
  root = realpathSync(root)
  const after = snapshotSourceFiles(snapshot.project)
  const current = snapshotSourceFiles(root, gitSnapshotPaths(root, { includeLocalAssets: snapshot.includeLocalAssets }))
  for (const rel of Object.keys(after)) {
    if (Object.hasOwn(snapshot.files, rel) || !/\.(?:uid|import)$/.test(rel)) continue
    const source = rel.replace(/\.(?:uid|import)$/, '')
    try {
      if (current[source] !== snapshot.files[source]) continue
      const target = join(root, rel)
      if (realpathSync(dirname(target)) !== dirname(target)) continue
      writeFileSync(target, readFileSync(join(snapshot.project, rel)), { flag: 'wx' })
    } catch (error) { if (error.code !== 'EEXIST' && error.code !== 'ENOENT') throw error }
  }
  // Provenance and shipment observations may return to the workspace only while
  // its source still matches the frozen candidate. Concurrent user edits win.
  if (!includeProvenance) return
  const latest = snapshotSourceFiles(root, gitSnapshotPaths(root, { includeLocalAssets: snapshot.includeLocalAssets }))
  const source = copybackSourceFiles(root, latest)
  if (same(source, copybackSourceFiles(snapshot.project, after))) {
    for (const rel of ['asset-provenance.json']) {
      if (!Object.hasOwn(after, rel)) continue
      const target = join(root, rel)
      if (existsSync(target) && (!lstatSync(target).isFile() || lstatSync(target).isSymbolicLink())) continue
      const bytes = readFileSync(join(snapshot.project, rel))
      if (existsSync(target) && readFileSync(target).equals(bytes)) continue
      // Viewing unchanged source in Preview must not dirty a saved release just
      // by replacing its shipment profile. Preview retains its own verified
      // export receipt; a real input change invalidates this release observation.
      const previous = existsSync(target) ? JSON.parse(readFileSync(target, 'utf8')) : null
      if (previous?.export?.profile === 'release' && previous.export.sourceFingerprint === snapshotDigest(source) &&
        JSON.parse(bytes).export?.profile === 'preview') continue
      const temporary = join(root, `.provenance-${randomBytes(8).toString('hex')}.tmp`)
      try {
        writeFileSync(temporary, bytes, { flag: 'wx' })
        renameSync(temporary, target)
      } finally { rmSync(temporary, { force: true }) }
    }
  }
}

export function discardBuildSnapshot(snapshot) {
  rmSync(snapshot.container, { recursive: true, force: true })
  rmSync(snapshot.container + '.owner.json', { force: true })
  snapshot.storage?.release()
}

export function recordPreparedSnapshot(root, snapshot) {
  verifyRelease(snapshot.project)
  const cache = snapshotsDirectory(root)
  const temporary = join(cache, `.prepared-${randomBytes(8).toString('hex')}.tmp`)
  const record = { version: 1, candidate: snapshot.container.slice(cache.length + 1), files: releaseFiles(snapshot.project), snapshotId: buildSnapshotIdentity(snapshot).snapshotId, head: snapshot.head }
  try {
    writeFileSync(temporary, JSON.stringify(record) + '\n', { flag: 'wx' })
    renameSync(temporary, join(cache, 'prepared.json'))
    snapshot.storage?.release()
  } finally { rmSync(temporary, { force: true }) }
}

export function prunePreparedSnapshot(root, previous) {
  if (!previous) return
  try {
    const record = JSON.parse(previous)
    const current = JSON.parse(readFileSync(join(snapshotsDirectory(root), 'prepared.json'), 'utf8'))
    // Only the superseded completed candidate is eligible. Do not remove another
    // process's in-flight or interrupted build just because it is not current.
    if (/^candidate-[a-f0-9]{24}$/.test(record.candidate) && record.candidate !== current.candidate) {
      rmSync(join(snapshotsDirectory(root), record.candidate), { recursive: true, force: true })
      rmSync(join(snapshotsDirectory(root), record.candidate + '.owner.json'), { force: true })
    }
  } catch { /* Cleanup cannot turn a successful prepared version into failure. */ }
}

export function readPreparedSnapshot(root) {
  if (existsSync(join(root, 'dist', '.site-install.json'))) throw new Error('Game release installation is incomplete; rerun prepare-release')
  const cache = snapshotsDirectory(root)
  const record = JSON.parse(readFileSync(join(cache, 'prepared.json'), 'utf8'))
  if (record.version !== 1 || !/^candidate-[a-f0-9]{24}$/.test(record.candidate)) throw new Error('Game release snapshot is invalid; prepare again')
  const project = join(cache, record.candidate, 'project')
  if (realpathSync(project) !== project) throw new Error('Game release snapshot directory changed; prepare again')
  if (!same(releaseFiles(project), record.files)) throw new Error('Game release snapshot changed; prepare again')
  const manifest = verifyRelease(project)
  if (manifest.build?.snapshotId !== record.snapshotId) throw new Error('Game release snapshot identity changed; prepare again')
  return { project, manifest, head: record.head }
}

/** Write raw frozen bytes of the prepared snapshot into the caller's private
 * index (`env.GIT_INDEX_FILE`). The caller holds the normal index.lock and owns
 * any replacement of the normal index; this function never writes it. */
export function writePreparedIndex(root, { project, head: preparedHead }, env) {
  const git = (args, options = {}) => execFileSync('git', args, { cwd: root, stdio: ['pipe', 'pipe', 'pipe'], timeout: 60_000, ...options })
  const head = git(['rev-parse', 'HEAD']).toString().trim()
  if (!preparedHead || head !== preparedHead) throw new Error('Game release Git HEAD changed since preparation; prepare the current project again')
  if (git(['diff', '--cached', '--name-only', '-z']).length) throw new Error('Game release staging found existing staged edits; commit or unstage them first')
  git(['read-tree', '--empty'], { env })
  const files = releaseFiles(project, (rel, entry) => rel === 'site' || rel.startsWith('site/') ? false : excludeSnapshotInput(rel, entry))
  let assets = {}
  if (existsSync(join(project, 'assets.lock.json'))) {
    const lock = JSON.parse(readFileSync(join(project, 'assets.lock.json'), 'utf8'))
    assets = lock.assets ?? lock
  }
  const entries = []
  for (const rel of Object.keys(files)) {
    if (rel.startsWith('assets/') && Object.hasOwn(assets, rel)) continue
    const file = join(project, rel)
    const bytes = readFileSync(file)
    if ('sha256:' + createHash('sha256').update(bytes).digest('hex') !== files[rel]) throw new Error('Game release snapshot changed while staging; prepare again')
    const object = git(['hash-object', '-w', '--stdin'], { input: bytes }).toString().trim()
    const mode = lstatSync(file).mode & 0o111 ? '100755' : '100644'
    entries.push(`${mode} ${object}\t${rel}\0`)
  }
  git(['update-index', '-z', '--index-info'], { env, input: entries.join('') })
  readPreparedSnapshot(root)
  if (git(['rev-parse', 'HEAD']).toString().trim() !== head) throw new Error('Game release Git HEAD changed while staging; retry')
}

/** Stage raw frozen bytes through a private index, then replace the index under
 * Git's index.lock. No checkout, filters, commit, push, or working-tree writes. */
export function stagePreparedSnapshot(root) {
  const snapshot = readPreparedSnapshot(root)
  const git = (args, options = {}) => execFileSync('git', args, { cwd: root, stdio: ['pipe', 'pipe', 'pipe'], timeout: 60_000, ...options })
  if (realpathSync(git(['rev-parse', '--show-toplevel']).toString().trim()) !== realpathSync(root)) {
    throw new Error('Game release staging requires the project Git root; refusing to replace a parent repository index')
  }
  const { GIT_INDEX_FILE: suppliedIndex, ...normalGitEnv } = process.env
  const index = resolve(root, git(['rev-parse', '--git-path', 'index'], { env: normalGitEnv }).toString().trim())
  if (suppliedIndex && resolve(root, suppliedIndex) !== index) throw new Error('Game release staging requires the normal project Git index')
  const lock = index + '.lock'
  const fd = openSync(lock, 'wx', 0o600)
  const temporary = join(dirname(index), `.game-index-${randomBytes(8).toString('hex')}`)
  const env = { ...process.env, GIT_INDEX_FILE: temporary }
  try {
    writePreparedIndex(root, snapshot, env)
    // Disk failure leaves the original index intact. Normal Git writers honor lock.
    writeFileSync(fd, readFileSync(temporary))
    closeSync(fd)
    renameSync(lock, index)
    return snapshot.manifest
  } finally {
    try { closeSync(fd) } catch {}
    rmSync(lock, { force: true })
    rmSync(temporary, { force: true })
  }
}
