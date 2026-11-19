import { createHash } from 'node:crypto'
import { chmodSync, existsSync, lstatSync, readdirSync, readFileSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { GameReleaseValidationError } from './release-errors.mjs'
import { assetTypeOf } from './local-artifacts.mjs'
import { GAME_RELEASE_MAX_FILE_BYTES, GAME_RELEASE_MAX_HISTORY_FILE_BYTES, gitTreeLimitMessage } from './release-limits.mjs'

// This boundary describes the saved checkpoint, not the current runtime package.
// Keep it stable: a fresh clone reconstructs the same native Git tree from its
// reachable source blobs. Capture-time Git ignore selection is a separate concern.
const omittedDirectories = new Set(['.git', '.godot', 'node_modules', 'dist', 'site', '.manus', '.manus-webdev', '.manus-logs', 'test-output', 'game-captures'])
const omittedFiles = new Set(['.git', '.manus-artifacts.json', '.manus-game-init.json', 'manus-webdev.json', '.DS_Store'])
const files = new Set(['asset-provenance.json', 'asset-provenance-report.md', 'game-sharing.json'])
const hash = bytes => 'sha256:' + createHash('sha256').update(bytes).digest('hex')
export const canonicalJSON = value => JSON.stringify(canonical(value))
function canonical(value) {
  return Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value
}
const validPath = path => typeof path === 'string' && path.length <= 2048 && !/[\\:\x00-\x1f\x7f]/.test(path) && path.split('/').every(part => part && part !== '.' && part !== '..')
const fail = (code, path) => { throw new GameReleaseValidationError(code, 'Game build input manifest does not match the saved source', path) }
export function excludedBuildInput(path, directory = false) {
  const name = path.split('/').at(-1)
  return omittedFiles.has(name) || directory && omittedDirectories.has(name) || files.has(path) ||
    /^\.env(?:\.|$)/.test(name) && !/\.(?:example|sample)$/.test(name) || name.endsWith('.log') || name.endsWith('.tmp')
}

/** Both adapters present an immutable regular-file tree. Managed media may be absent in Git. */
export function collectBuildInputs(root, { requireManagedBytes = false, paths = null, allowDirtyManaged = false, gitExecutable = 'git' } = {}) {
  const entries = new Map()
  let count = 0
  let total = 0
  let assets = {}
  if (existsSync(join(root, 'assets.lock.json'))) {
    const lock = JSON.parse(readFileSync(join(root, 'assets.lock.json'), 'utf8'))
    assets = lock.assets ?? lock
  }
  if (!assets || typeof assets !== 'object' || Array.isArray(assets) || Object.keys(assets).length > 20_000) fail('input_manifest_invalid')
  for (const [path, asset] of Object.entries(assets)) {
    if (!path.startsWith('assets/') || !validPath(path) || !/^sha256:[a-f0-9]{64}$/.test(asset?.sha256)) fail('input_manifest_invalid', path)
    entries.set(path, { path, type: 'managed', sha256: asset.sha256 })
    if (requireManagedBytes && !existsSync(join(root, path))) fail('input_mismatch', path)
  }
  const walk = (directory, prefix = '') => {
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)) {
      const path = prefix + entry.name
      if (paths && !paths.has(path) || excludedBuildInput(path, entry.isDirectory())) continue
      if (!validPath(path)) fail('input_manifest_invalid', path)
      if (entry.isDirectory()) { walk(join(directory, entry.name), path + '/'); continue }
      if (!entry.isFile()) fail('input_manifest_invalid', path)
      const stat = lstatSync(join(root, path))
      total += stat.size
      if (++count > 20_000 || total > 2 * 1024 * 1024 * 1024) fail('input_manifest_invalid')
      if (entries.has(path)) {
        const sha256 = hash(readFileSync(join(root, path)))
        if (entries.get(path).sha256 !== sha256) {
          if (!allowDirtyManaged) fail('input_mismatch', path)
          entries.set(path, { path, type: 'managed', sha256 })
        }
      } else {
        const history = path.startsWith('.manus-asset-history/')
        const max = history ? GAME_RELEASE_MAX_HISTORY_FILE_BYTES : GAME_RELEASE_MAX_FILE_BYTES
        if (assetTypeOf(path) !== 'font' && stat.size > max) {
          // Same per-file publishing limit as the save and server checks; name it.
          const issue = { limit: history ? 'history_file_bytes' : 'file_bytes', actual: stat.size, max, path }
          throw new GameReleaseValidationError('source_too_large', gitTreeLimitMessage(issue), path)
        }
        if (stat.size < 1024 && readFileSync(join(root, path), 'utf8').startsWith('version https://git-lfs.github.com/spec/v1\n')) {
          fail('input_manifest_invalid', path)
        }
        entries.set(path, { path, type: 'file', mode: stat.mode & 0o111 ? '100755' : '100644' })
      }
    }
  }
  walk(root)
  const sorted = [...entries.values()].sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0)
  return { objectFormat: 'sha1', tree: sourceTree(root, sorted, gitExecutable), entries: sorted }
}
// Same scope as snapshot-export's hasGdignoreAncestor: Godot skips a child directory
// marked by .gdignore (the marker included), never the project root itself. A
// marker exempts additions only when it cannot hide recorded inputs: it was
// already recorded, or nothing under its directory was recorded.
function addedUnderGdignore(path, present, listed, listedDirs) {
  for (let end = path.lastIndexOf('/'); end > 0; end = path.lastIndexOf('/', end - 1)) {
    const dir = path.slice(0, end)
    const marker = `${dir}/.gdignore`
    if (present.has(marker) && (listed.has(marker) || !listedDirs.has(dir))) return true
  }
  return false
}
function parentDirs(paths) {
  const dirs = new Set()
  for (const path of paths) {
    if (typeof path !== 'string') continue
    for (let end = path.lastIndexOf('/'); end > 0; end = path.lastIndexOf('/', end - 1)) dirs.add(path.slice(0, end))
  }
  return dirs
}
export function verifyBuildInputs(root, manifest, options = {}) {
  if (manifest?.objectFormat !== 'sha1' || !/^[a-f0-9]{40}$/.test(manifest?.tree ?? '') || !Array.isArray(manifest?.entries)) fail('input_manifest_invalid')
  let actual = collectBuildInputs(root, options)
  if (canonicalJSON(actual) !== canonicalJSON(manifest)) {
    // Files added after the save inside a Godot-ignored directory did not exist
    // when site/ was built and Godot never imports them, so they cannot make the
    // build stale. Recorded files there still count: editing or deleting them fails.
    // A new marker over recorded inputs hides them from Godot; it is reported.
    const listed = new Set(manifest.entries.map(entry => entry?.path))
    const listedDirs = parentDirs(listed)
    const present = new Set(actual.entries.map(entry => entry.path))
    const added = new Set(actual.entries.filter(entry =>
      entry.type === 'file' && !listed.has(entry.path) && addedUnderGdignore(entry.path, present, listed, listedDirs)))
    if (added.size) {
      const kept = actual.entries.filter(entry => !added.has(entry))
      actual = { objectFormat: actual.objectFormat, tree: sourceTree(root, kept, options.gitExecutable ?? 'git'), entries: kept }
    }
  }
  if (canonicalJSON(actual) !== canonicalJSON(manifest)) {
    const expected = new Map((Array.isArray(manifest.entries) ? manifest.entries : []).map(entry => [entry.path, entry]))
    const different = actual.entries.find(entry => canonicalJSON(entry) !== canonicalJSON(expected.get(entry.path)))?.path ??
      [...expected.keys()].find(path => !actual.entries.some(entry => entry.path === path))
    fail('input_mismatch', different)
  }
  return actual
}
// One input identity owns both export profiles; each artifact receipt also binds its profile.
export function buildKey(inputs, toolchain, exportOptions = { preset: 'Web', profiles: ['preview', 'release'] }) {
  return hash(canonicalJSON({ inputs, toolchain, exportOptions }))
}

// Git hashes raw blobs and builds the tree; no filters, checkout, user index,
// global Git configuration or dangling source objects in the project repository.
// Temporary tree objects are disposable: all source bytes/modes remain reachable
// in the final checkpoint, and external assets remain bound by their lock record.
// Also binds each file's blob object ID into entries in place. The persisted
// manifest relies on those IDs to locate content-only input mismatches.
function sourceTree(root, entries, gitExecutable) {
  const temporary = mkdtempSync(join(tmpdir(), 'game-source-tree-'))
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_')))
  env.GIT_CONFIG_NOSYSTEM = '1'
  env.GIT_CONFIG_GLOBAL = join(temporary, 'empty-config')
  writeFileSync(env.GIT_CONFIG_GLOBAL, '')
  const git = (args, input) => execFileSync(gitExecutable, args, {
    cwd: temporary, env, input, encoding: 'utf8', stdio: 'pipe', timeout: 60_000, maxBuffer: 8 * 1024 * 1024,
  }).trim()
  try {
    const repository = join(temporary, 'objects.git')
    git(['init', '--bare', '--quiet', '--template=', '--object-format=sha1', repository])
    const command = ['--git-dir=' + repository]
    const source = entries.filter(entry => entry.type === 'file')
    const objects = source.length ? git([...command, 'hash-object', '--no-filters', '--stdin-paths'],
      source.map(entry => JSON.stringify(join(root, entry.path))).join('\n') + '\n').split('\n') : []
    if (objects.length !== source.length || objects.some(object => !/^[a-f0-9]{40}$/.test(object))) fail('input_manifest_invalid')
    source.forEach((entry, i) => { entry.object = objects[i] })
    git([...command, 'read-tree', '--empty'])
    if (source.length) git([...command, 'update-index', '-z', '--index-info'],
      source.map(entry => `${entry.mode} ${entry.object}\t${entry.path}\0`).join(''))
    return git([...command, 'write-tree', '--missing-ok'])
  } finally {
    // Git creates read-only object files. Windows rmSync can reject those even
    // with force=true. Only change files in our own disposable tree; never links.
    try {
      if (process.platform === 'win32') makeTemporaryFilesWritable(temporary)
      rmSync(temporary, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 })
    } catch {
      // Cleanup is not evidence that the saved inputs are invalid. Preserve the
      // validation result; do not expose temporary paths or Git diagnostics.
      console.warn('[game-source-tree] temporary cleanup failed')
    }
  }
}

function makeTemporaryFilesWritable(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const filename = join(directory, entry.name)
    if (entry.isDirectory()) makeTemporaryFilesWritable(filename)
    else if (entry.isFile()) {
      const mode = lstatSync(filename).mode
      if (!(mode & 0o200)) chmodSync(filename, mode | 0o200)
    }
  }
}
