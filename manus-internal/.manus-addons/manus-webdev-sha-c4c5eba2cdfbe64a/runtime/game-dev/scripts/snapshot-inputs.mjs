import { ASSET_EXTS, extOf } from './local-artifacts.mjs'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, realpathSync, readdirSync, lstatSync } from 'node:fs'
import { dirname, join } from 'node:path'

export const SKIP_DIRS = new Set(['.git', '.godot', 'node_modules', 'dist', 'site', '.manus', '.manus-webdev', '.manus-logs', 'test-output', 'game-captures'])
const SKIP_FILES = new Set(['.git', '.manus-artifacts.json', '.manus-game-init.json', 'manus-webdev.json', '.DS_Store'])

// Freeze Git's input selection with the source bytes. Hydrated assets are the
// deliberate exception: Godot needs them, while Git stores their lock entries.
export function gitSnapshotPaths(root, { includeLocalAssets = false, gitExecutable = 'git' } = {}) {
  try {
    const workTree = execFileSync(gitExecutable, ['rev-parse', '--show-toplevel'], { cwd: root, stdio: 'pipe', timeout: 10_000, encoding: 'utf8' }).trim()
    // Honor an explicit Managed Git context, but never borrow it for a frozen candidate or child project.
    if (realpathSync(workTree) !== realpathSync(root)) return null
  }
  catch (error) {
    // Spawn failures are not proof that the source directory is outside Git.
    if (typeof error?.code === 'string') throw error
    return null
  }
  const index = execFileSync(gitExecutable, ['ls-files', '--stage', '-z'], {
    cwd: root, stdio: 'pipe', timeout: 10_000, maxBuffer: 8 * 1024 * 1024, encoding: 'utf8',
  }).split('\0').filter(Boolean)
  if (index.some(entry => entry.startsWith('160000 '))) throw new Error('Game snapshots do not support Git submodules; materialize the required source first')
  if (index.some(entry => /^[0-7]+ [a-f0-9]+ [123]\t/.test(entry))) throw new Error('Game snapshots require unresolved Git conflicts to be settled first')
  const paths = new Set(execFileSync(gitExecutable, ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], {
    cwd: root, stdio: 'pipe', timeout: 10_000, maxBuffer: 8 * 1024 * 1024, encoding: 'utf8',
  }).split('\0').filter(Boolean))
  if (existsSync(join(root, 'assets.lock.json'))) {
    const lock = JSON.parse(readFileSync(join(root, 'assets.lock.json'), 'utf8'))
    for (const path of Object.keys(lock.assets ?? lock)) if (path.startsWith('assets/')) paths.add(path)
  }
  if (includeLocalAssets && existsSync(join(root, 'assets'))) {
    if (lstatSync(join(root, 'assets')).isSymbolicLink()) throw new Error('Game local assets directory must not be a symlink')
    let visited = 0
    const walk = rel => {
      if (++visited > 20_000) throw new Error('Game local asset scan exceeds its file limit')
      for (const entry of readdirSync(join(root, rel), { withFileTypes: true })) {
        if (++visited > 20_000) throw new Error('Game local asset scan exceeds its file limit')
        const path = `${rel}/${entry.name}`
        if (entry.isSymbolicLink()) throw new Error(`Game local asset must not be a symlink: ${path}`)
        if (excludeSnapshotInput(path, entry) || entry.name.startsWith('.')) continue
        if (entry.isDirectory()) walk(path)
        else if (entry.isFile() && ASSET_EXTS.has(extOf(entry.name.replace(/\.import$/, '')))) paths.add(path)
      }
    }
    walk('assets')
  }
  for (const path of [...paths]) {
    let parent = dirname(path)
    while (parent !== '.') { paths.add(parent); parent = dirname(parent) }
  }
  return paths
}

export function excludeSnapshotInput(rel, entry, paths = null) {
  if (paths && !paths.has(rel)) return true
  if (SKIP_FILES.has(entry.name) || (entry.isDirectory() && SKIP_DIRS.has(entry.name))) return true
  // Runtime secrets are not build inputs and must never be copied into a checkpoint.
  if (/^\.env(?:\.|$)/.test(entry.name) && !/\.(?:example|sample)$/.test(entry.name)) return true
  if (entry.name.endsWith('.log') || entry.name.endsWith('.tmp')) return true
  return false
}
