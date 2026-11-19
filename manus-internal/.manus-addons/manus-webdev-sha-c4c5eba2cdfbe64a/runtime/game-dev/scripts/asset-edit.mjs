import { constants, copyFileSync, existsSync, linkSync, lstatSync, mkdirSync, readFileSync, realpathSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { createHash, randomUUID } from 'node:crypto'
import { dirname, join, relative } from 'node:path'
import { projectResourceId } from './project-identity.mjs'

export const ASSET_HISTORY_DIRECTORY = '.manus-asset-history'
const digest = bytes => 'sha256:' + createHash('sha256').update(bytes).digest('hex')
const fail = message => { throw new Error(message) }
function file(root, path, missing = false) {
  if (typeof path !== 'string' || path.startsWith('/') || /[\\\x00-\x1f]/.test(path) || path.split('/').some(part => !part || part === '.' || part === '..')) fail('Invalid asset edit path')
  let current = root
  for (const part of path.split('/')) {
    current = join(current, part)
    let stat
    try { stat = lstatSync(current) } catch (error) { if (error.code === 'ENOENT' && missing) continue; throw error }
    if (stat.isSymbolicLink()) fail('Asset edit links are not supported')
  }
  return current
}
function read(path) {
  const stat = lstatSync(path)
  if (!stat.isFile() || stat.size > 64 * 1024 * 1024) fail('Asset edit file is invalid or too large')
  return readFileSync(path)
}
function writeJournal(directory, journal) {
  const temp = join(directory, 'journal.tmp')
  writeFileSync(temp, JSON.stringify(journal), { mode: 0o600 })
  renameSync(temp, join(directory, 'journal.json'))
}
function lock(root, fn) {
  const directory = file(root, 'dist/.asset-edit-lock', true)
  mkdirSync(dirname(directory), { recursive: true })
  try { mkdirSync(directory) } catch { fail('Another asset edit or interrupted update exists; inspect dist/.asset-edit-lock before retrying') }
  writeFileSync(join(directory, 'owner.json'), JSON.stringify({ pid: process.pid }), { mode: 0o600 })
  try { return fn() } finally { rmSync(directory, { recursive: true }) }
}
// History belongs to source checkpoints, not dist or the playable export. Objects
// are content-addressed so repeated edits/restores do not duplicate image bytes.
function saveHistory(root, directory, journal) {
  const history = file(root, ASSET_HISTORY_DIRECTORY, true)
  mkdirSync(history, { recursive: true })
  writeFileSync(file(root, ASSET_HISTORY_DIRECTORY + '/.gdignore', true), '')
  const manifests = journal.entries.findIndex(entry => entry.path === 'assets.lock.json')
  const before = JSON.parse(read(join(directory, manifests + '.old')))
  const after = JSON.parse(read(join(directory, manifests + '.new')))
  const object = (path, expected) => {
    if (expected === null) return null
    const bytes = read(path)
    if (digest(bytes) !== expected) fail('Asset history bytes changed')
    const target = file(root, ASSET_HISTORY_DIRECTORY + '/objects/' + expected.slice(7), true)
    mkdirSync(dirname(target), { recursive: true })
    try { writeFileSync(target, bytes, { flag: 'wx', mode: 0o600 }) }
    catch (error) { if (error.code !== 'EEXIST' || digest(read(target)) !== expected) throw error }
    return expected
  }
  const entries = journal.entries.flatMap((entry, index) => entry.path === 'assets.lock.json' ? [] : [{
    path: entry.path,
    before: { digest: object(join(directory, index + '.old'), entry.baseDigest), asset: before.assets?.[entry.path] ?? null },
    after: { digest: object(join(directory, index + '.new'), entry.digest), asset: after.assets[entry.path] },
  }])
  const target = file(root, ASSET_HISTORY_DIRECTORY + '/' + journal.id + '.json', true)
  const temp = file(root, ASSET_HISTORY_DIRECTORY + '/' + journal.id + '.tmp', true)
  writeFileSync(temp, JSON.stringify({ version: 1, id: journal.id, resourceId: journal.resourceId, createdAt: new Date().toISOString(), entries }), { mode: 0o600 })
  renameSync(temp, target)
}

export async function restoreAssetVersion(root, request) {
  root = realpathSync(root)
  if (!request || request.resourceId !== await projectResourceId(root)) fail('Asset edit project changed')
  if (!request || !/^[a-f0-9-]{36}$/.test(request.id) || !['before', 'after'].includes(request.side)) fail('Invalid asset history request')
  const record = JSON.parse(read(file(root, ASSET_HISTORY_DIRECTORY + '/' + request.id + '.json')))
  if (record.version !== 1 || record.id !== request.id || record.resourceId !== request.resourceId) fail('Asset history project changed')
  const version = record.entries?.find(entry => entry.path === request.path)?.[request.side]
  if (!version || !/^sha256:[a-f0-9]{64}$/.test(version.digest ?? '') || version.asset?.sha256 !== version.digest) fail('No restorable asset version at this path')
  const bytes = read(file(root, ASSET_HISTORY_DIRECTORY + '/objects/' + version.digest.slice(7)))
  if (digest(bytes) !== version.digest) fail('Asset history bytes changed')
  const manifestBytes = read(file(root, 'assets.lock.json'))
  const manifest = JSON.parse(manifestBytes)
  if (manifest.version !== 2 || !manifest.assets) fail('Expected assets.lock.json version 2')
  // Keep current grouping, timing and all unrelated entries. Only restore the
  // selected asset's content/provenance; restoring a bundle requires all frames.
  const current = manifest.assets[request.path]
  if (!current) fail('Restore requires an existing manifest entry')
  manifest.assets[request.path] = { ...current, ...version.asset, groupId: current.groupId }
  const candidate = 'dist/asset-edit-candidates/restore-' + randomUUID()
  mkdirSync(file(root, candidate, true), { recursive: true })
  writeFileSync(file(root, candidate + '/asset', true), bytes)
  writeFileSync(file(root, candidate + '/manifest.json', true), JSON.stringify(manifest))
  return prepareAssetEdit(root, { resourceId: request.resourceId, changes: [
    { path: request.path, baseDigest: request.baseDigest, candidate: candidate + '/asset' },
    { path: 'assets.lock.json', baseDigest: digest(manifestBytes), candidate: candidate + '/manifest.json' },
  ] })
}

export async function prepareAssetEdit(root, request) {
  root = realpathSync(root)
  if (!request || request.resourceId !== await projectResourceId(root)) fail('Asset edit project changed')
  const changes = request.changes
  if (!Array.isArray(changes) || !changes.length || changes.length > 64 || !changes.some(change => change.path === 'assets.lock.json')) fail('Asset edits must include a bounded set of files and assets.lock.json')
  const seen = new Set(); let size = 0
  const entries = changes.map(change => {
    if (typeof change.path !== 'string' || !(change.path.startsWith('assets/') || change.path === 'assets.lock.json') || seen.has(change.path)) fail('Invalid or duplicate asset edit target')
    seen.add(change.path)
    if (change.baseDigest !== null && !/^sha256:[a-f0-9]{64}$/.test(change.baseDigest ?? '')) fail('An exact asset edit base digest is required')
    const target = file(root, change.path, true)
    if (existsSync(target) ? digest(read(target)) !== change.baseDigest : change.baseDigest !== null) fail('Asset edit conflict: ' + change.path)
    if (!change.candidate?.startsWith('dist/asset-edit-candidates/')) fail('Keep generated candidates in dist/asset-edit-candidates')
    const bytes = read(file(root, change.candidate)); size += bytes.length
    if (size > 256 * 1024 * 1024) fail('Asset edit batch is too large')
    if (change.path === 'assets.lock.json') {
      if (change.baseDigest === null || JSON.parse(read(target)).version !== 2) fail('Expected an existing assets.lock.json version 2')
      JSON.parse(bytes)
    }
    return { path: change.path, baseDigest: change.baseDigest, digest: digest(bytes), bytes }
  })
  const manifest = JSON.parse(entries.find(entry => entry.path === 'assets.lock.json').bytes)
  if (manifest.version !== 2 || !manifest.assets) fail('Expected assets.lock.json version 2')
  const originalManifest = JSON.parse(read(file(root, 'assets.lock.json')))
  for (const entry of entries) if (entry.path !== 'assets.lock.json') {
    if (manifest.assets[entry.path]?.sha256 !== entry.digest) fail('Candidate manifest does not match ' + entry.path)
    if (entry.baseDigest !== null && originalManifest.assets?.[entry.path]?.sha256 !== entry.baseDigest) fail('Current manifest does not match ' + entry.path + '; synchronize it before preparing an edit')
  }
  return lock(root, () => {
    const id = randomUUID(), directory = file(root, 'dist/.asset-edits/' + id, true)
    mkdirSync(directory, { recursive: true })
    const journal = { version: 1, id, root, resourceId: request.resourceId, phase: 'prepared', entries: [] }
    for (const [index, entry] of entries.entries()) {
      writeFileSync(join(directory, index + '.new'), entry.bytes, { flag: 'wx', mode: 0o600 })
      const { bytes, ...record } = entry
      journal.entries.push(record)
    }
    writeJournal(directory, journal)
    return { id, phase: journal.phase }
  })
}
export async function applyAssetEdit(root, id, recover = false) {
  root = realpathSync(root)
  const resourceId = await projectResourceId(root)
  if (!/^[a-f0-9-]{36}$/.test(id)) fail('Invalid asset edit identity')
  return lock(root, () => {
    const directory = file(root, 'dist/.asset-edits/' + id)
    const journal = JSON.parse(read(file(root, relative(root, join(directory, 'journal.json')))))
    if (journal.version !== 1 || journal.root !== root || journal.resourceId !== resourceId || journal.id !== id) fail('Asset edit project changed')
    if (!Array.isArray(journal.entries) || !journal.entries.length || journal.entries.length > 64 || journal.entries.some(entry => !(entry.path?.startsWith('assets/') || entry.path === 'assets.lock.json') || !/^sha256:[a-f0-9]{64}$/.test(entry.digest))) fail('Invalid asset edit journal')
    const paths = new Set(journal.entries.map(entry => entry.path))
    if (paths.size !== journal.entries.length || !paths.has('assets.lock.json') || journal.entries.some(entry => entry.baseDigest !== null && !/^sha256:[a-f0-9]{64}$/.test(entry.baseDigest ?? ''))) fail('Invalid asset edit journal')
    if (journal.phase === 'complete' || journal.phase === 'restored') return { id, phase: journal.phase }
    if (!recover && journal.phase !== 'prepared') fail('Interrupted asset edit requires --recover')
    const restore = () => {
      let conflict = false
      for (const [index, entry] of journal.entries.entries()) {
        const target = file(root, entry.path, true), backup = join(directory, index + '.old')
        if (existsSync(target)) {
          // A previous recovery may have restored this file before it stopped.
          if (existsSync(backup) && digest(read(target)) === digest(read(backup))) continue
          if (!existsSync(backup) && digest(read(target)) === entry.baseDigest) continue
          const displaced = join(directory, index + '.recovery-' + randomUUID())
          renameSync(target, displaced)
          if (digest(read(displaced)) !== entry.digest) {
            try { linkSync(displaced, target) } catch {}
            conflict = true; continue
          }
        }
        if (existsSync(backup)) {
          try { linkSync(backup, target) } catch { conflict = true }
        } else if (entry.baseDigest !== null) conflict = true
      }
      journal.phase = conflict ? 'conflict' : 'restored'; writeJournal(directory, journal)
      if (!conflict) rmSync(file(root, ASSET_HISTORY_DIRECTORY + '/' + id + '.json', true), { force: true })
      return { id, phase: journal.phase, recoveryDirectory: relative(root, directory) }
    }
    if (recover) return restore()
    try {
      // Record intent before moving any original; all originals and candidates remain recoverable.
      journal.phase = 'applying'; writeJournal(directory, journal)
      for (const [index, entry] of journal.entries.entries()) {
        const target = file(root, entry.path, true)
        if (existsSync(target)) {
          renameSync(target, join(directory, index + '.old'))
          if (digest(read(join(directory, index + '.old'))) !== entry.baseDigest) fail('Asset edit conflict: ' + entry.path)
        } else if (entry.baseDigest !== null) fail('Asset edit conflict: ' + entry.path)
      }
      for (const [index, entry] of journal.entries.entries()) {
        const target = file(root, entry.path, true), candidate = file(root, relative(root, join(directory, index + '.new')))
        if (digest(read(candidate)) !== entry.digest) fail('Asset edit candidate changed')
        mkdirSync(dirname(target), { recursive: true })
        copyFileSync(candidate, target, constants.COPYFILE_EXCL)
      }
      for (const entry of journal.entries) if (digest(read(file(root, entry.path))) !== entry.digest) fail('Asset edit changed during installation')
      saveHistory(root, directory, journal)
      journal.phase = 'complete'; writeJournal(directory, journal)
      return { id, phase: journal.phase }
    } catch (error) {
      journal.phase = 'interrupted'; writeJournal(directory, journal)
      const recovery = restore()
      throw Object.assign(error, { recovery })
    }
  })
}
