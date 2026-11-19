import { createHash } from 'node:crypto'
import { chmodSync, existsSync, lstatSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { MAX_SNAPSHOT_FILES, snapshotSourceFiles } from './build-snapshot.mjs'
import { readAssetsLock, safeLockEntries } from './local-artifacts.mjs'

import { gitSnapshotPaths } from './snapshot-inputs.mjs'
import { excludedReferenceMatcher } from './release-references.mjs'
import { readPackInventory } from './export-asset-inventory.mjs'
const hash = bytes => 'sha256:' + createHash('sha256').update(bytes).digest('hex')
const commonExcluded = ['.manus-asset-history/', '.manus-game-tools/', 'test/', 'tests/', 'test-output/', 'selftest/', 'tools/', 'docs/', 'addons/gut/', 'scripts/manus/preview/']
const diagnosticPath = file => JSON.stringify(file.length > 160 ? file.slice(0, 157) + '...' : file)

// Preview modules are ordinary Godot resources in one reserved directory. Only
// their autoload declarations are removed; gameplay source is never rewritten.
function releaseProjectSettings(source, removedAutoloads) {
  let section = ''
  return source.split(/(?<=\n)/).filter(line => {
    const header = line.match(/^\s*\[([^\]]+)\]\s*$/)
    if (header) section = header[1]
    const autoload = section === 'autoload' && line.match(/^\s*([^=]+?)\s*=\s*"\*?res:\/\/scripts\/manus\/preview\/[^"\r\n]+"\s*(?:;[^\r\n]*)?[\r\n]*$/)
    if (autoload) removedAutoloads.push(autoload[1].trim())
    return !autoload
  }).join('')
}

/** Build inputs after common developer-file exclusion; independent of template ID. */
export function releaseProjection(root, { includeLocalAssets = false, gitExecutable = 'git' } = {}) {
  const files = snapshotSourceFiles(root, gitSnapshotPaths(root, { includeLocalAssets, gitExecutable }))
  const assets = readAssetsLock(root)
  if (Object.keys(assets).length > MAX_SNAPSHOT_FILES) throw new Error('Game release snapshot exceeds its file limit')
  const managedPaths = safeLockEntries(root, assets, () => {}).filter(path => path.startsWith('assets/'))
  if (managedPaths.some(path => !/^sha256:[a-f0-9]{64}$/.test(assets[path].sha256))) throw new Error('Game release asset lock digest is invalid')
  const logicalPaths = [...new Set([...Object.keys(files), ...managedPaths])]
  if (logicalPaths.length > MAX_SNAPSHOT_FILES) throw new Error('Game release snapshot exceeds its file limit')
  const removed = logicalPaths.filter(file => commonExcluded.some(prefix => file.startsWith(prefix))).sort()
  const rewritten = new Map()
  const removedAutoloads = []
  if (Object.hasOwn(files, 'project.godot')) {
    const source = readFileSync(join(root, 'project.godot'), 'utf8')
    const projected = releaseProjectSettings(source, removedAutoloads)
    if (source !== projected) rewritten.set('project.godot', Buffer.from(projected))
  }
  const removedSet = new Set(removed)
  const classes = removed.filter(file => file.endsWith('.gd') && Object.hasOwn(files, file)).flatMap(file => {
    const name = readFileSync(join(root, file), 'utf8').match(/^class_name\s+(\w+)/m)?.[1]
    return name ? [name] : []
  })
  const referencesExcluded = excludedReferenceMatcher(removed, [...classes, ...removedAutoloads])
  const errors = []
  for (const file of Object.keys(files)) {
    if (removedSet.has(file) || !/\.(?:gd|tscn|tres)$/.test(file) && file !== 'project.godot') continue
    const source = (rewritten.get(file) ?? readFileSync(join(root, file))).toString('utf8')
    if (referencesExcluded(source) && errors.length < 20) errors.push('excluded developer resource: ' + diagnosticPath(file))
  }
  if (errors.length) throw new Error('Game release preflight failed:\n' + errors.sort().join('\n'))
  return { files, rewritten, removed, receipt: { removed } }
}

/** Only called with a private captured candidate, never the working project. */
export function withReleaseProjection(root, build, projection = releaseProjection(root)) {
  const physicalRemoved = projection.removed.filter(file => Object.hasOwn(projection.files, file))
  const originals = new Map([...new Set([...physicalRemoved, ...projection.rewritten.keys()])].map(file => [file, readFileSync(join(root, file))]))
  const modes = new Map([...originals.keys()].map(file => [file, lstatSync(join(root, file)).mode & 0o777]))
  const desired = new Map([...projection.rewritten, ...physicalRemoved.map(file => [file, null])])
  const canonical = realpathSync(root)
  let result
  try {
    rmSync(join(root, '.godot'), { recursive: true, force: true })
    for (const [file, bytes] of desired) {
      if (bytes === null) rmSync(join(root, file))
      else writeFileSync(join(root, file), bytes)
    }
    result = build(projection.receipt)
    if (projection.removed.some(file => existsSync(join(root, file)))) throw new Error('Game export modified the release source projection')
    for (const [file, bytes] of desired) {
      const path = join(root, file)
      if (bytes === null ? existsSync(path) : !lstatSync(path).isFile() || lstatSync(path).isSymbolicLink() || hash(readFileSync(path)) !== hash(bytes)) {
        throw new Error('Game export modified the release source projection')
      }
    }
    return result
  } finally {
    // A failed export cannot leak release-only source changes into preview or A.
    rmSync(join(root, '.godot'), { recursive: true, force: true })
    for (const [file, bytes] of originals) {
      const target = join(canonical, file)
      if (realpathSync(dirname(target)) !== dirname(target) || existsSync(target) && lstatSync(target).isSymbolicLink()) throw new Error('Game release candidate path changed during export')
      writeFileSync(target, bytes)
      chmodSync(target, modes.get(file))
    }
  }
}

/** Read actual exported PCK bytes. This checks known resource removal, not arbitrary
 * compiled-code semantics or independent attestation of a user-controlled builder. */
export function verifyReleasePack(pack, receipt) {
  const { paths } = readPackInventory(pack)
  const excluded = new Set(receipt.removed)
  for (const path of paths) {
    const source = path.replace(/\.(?:import|remap|uid)$/, '').replace(/\.gdc$/, '.gd')
    const parts = source.split('/')
    let prefix = ''
    for (const part of parts) {
      prefix += (prefix ? '/' : '') + part
      if (excluded.has(prefix) || commonExcluded.includes(prefix + '/')) {
        throw Object.assign(new Error('Game release pack contains excluded developer resource: ' + diagnosticPath(path)), { code: 'GAME_EXPORT_TWEAK_REMAINS' })
      }
    }
  }
}
