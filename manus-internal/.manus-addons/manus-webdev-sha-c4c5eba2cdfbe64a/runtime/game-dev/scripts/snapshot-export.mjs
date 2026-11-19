import { execFileSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { chmodSync, existsSync, lstatSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { assertAssetsPresent, validateExportDirectory } from './local-artifacts.mjs'
import { resolveBuildToolchain } from './build-toolchain.mjs'
import { stabilizeSnapshot, recordBuildProvenance } from './build-snapshot.mjs'
import { reconcileProvenance } from './asset-provenance.mjs'
import { exportedAssetEvidence } from './export-asset-inventory.mjs'
import { releaseProjection } from './release-profile.mjs'
import { runGameProcess } from './game-process.mjs'
import { GameStorageError } from './storage-capacity.mjs'
import { assertModelImportCompatibility } from './model-dependencies.mjs'
import { warnTextureBudgets } from './texture-budget.mjs'

// Audit documents are source deliverables, never player dependencies. Exclude
// them from both profiles so an observed PCK digest cannot enter the next PCK.
function withoutProvenanceDocuments(root, run) {
  const files = new Map()
  const modes = new Map()
  for (const name of ['asset-provenance.json', 'asset-provenance-report.md', 'game-sharing.json', 'game-texture-budgets.json']) {
    const path = join(root, name)
    if (!existsSync(path)) continue
    if (!lstatSync(path).isFile() || lstatSync(path).isSymbolicLink()) throw new Error('Game provenance path is invalid')
    files.set(path, readFileSync(path))
    modes.set(path, lstatSync(path).mode & 0o777)
  }
  try {
    for (const path of files.keys()) rmSync(path)
    // Generated observations are outside the input boundary and never enter a PCK.
    return run()
  } finally {
    for (const [path, bytes] of files) { writeFileSync(path, bytes); chmodSync(path, modes.get(path)) }
  }
}

function hasGdignoreAncestor(file, files) {
  // Godot skips marked child directories, never the project root itself.
  for (let directory = dirname(file); directory !== '.'; directory = dirname(directory)) {
    if (Object.hasOwn(files, `${directory}/.gdignore`)) return true
  }
  return false
}

export function assertReferencedAssetsPresent(snapshot) {
  const missing = new Set()
  for (const file of Object.keys(snapshot.files)) {
    if (!/\.(?:gd|tscn|tres|godot|cfg)$/.test(file)) continue
    if (hasGdignoreAncestor(file, snapshot.files)) continue
    for (const line of readFileSync(join(snapshot.project, file), 'utf8').split('\n')) {
      if (/^\s*[#;]/.test(line)) continue
      for (const match of line.matchAll(/(?:\bpreload\s*\(\s*|^\s*\[ext_resource\b[^\n]*?\bpath\s*=\s*)["']res:\/\/(assets\/[^"'\r\n]+)["']/g)) {
        const path = match[1]
        if (path.split('/').some(part => part === '..' || part === '.') || path.includes('\\') || !existsSync(join(snapshot.project, path))) missing.add(path)
      }
    }
  }
  if (missing.size) throw new Error(`Game export blocked: referenced local assets are missing: ${[...missing].slice(0, 8).join(', ')}. Restore or correct these files before rebuilding; restarting Preview will not fix missing assets.`)
}

export function importFrozenSnapshot(snapshot, toolchain) {
  assertModelImportCompatibility(snapshot.project, Object.keys(snapshot.files), toolchain.identity?.engineVersion)
  warnTextureBudgets(snapshot.project, { paths: Object.keys(snapshot.files) })
  stabilizeSnapshot(snapshot, () => runGameProcess(toolchain.executable,
    ['--headless', '--path', snapshot.project, '--editor', '--import'],
    { cwd: snapshot.project, diagnosticRoot: snapshot.sourceRoot, label: 'Game import', timeout: 120_000, env: { ...process.env, ...snapshot.storage?.environment } }))
}

export function exportFrozenProfile(snapshot, toolchain, profile, { recordProvenance = true } = {}) {
  if (!['preview', 'release'].includes(profile)) throw new Error('Game release build profile is invalid')
  assertModelImportCompatibility(snapshot.project, Object.keys(snapshot.files), toolchain.identity?.engineVersion)
  warnTextureBudgets(snapshot.project, { paths: Object.keys(snapshot.files) })
  assertAssetsPresent(snapshot.project)
  if (profile === 'preview') assertReferencedAssetsPresent(snapshot)
  if (profile === 'release') releaseProjection(snapshot.project)
  const output = join(snapshot.project, 'dist', profile === 'release' ? '.release' : '.preview-next')
  stabilizeSnapshot(snapshot, () => {
    console.log(`[export] ${profile} from frozen Game input`)
    // Recheck the installed exporter and the frozen project's engine/templates
    // against the identity captured before copying the build inputs.
    const frozenToolchain = resolveBuildToolchain(snapshot.project, { executable: toolchain.executable })
    if (JSON.stringify(frozenToolchain.identity) !== JSON.stringify(toolchain.identity)) throw new Error('Game exporter changed during snapshot capture')
    withoutProvenanceDocuments(snapshot.project, () => {
      try { execFileSync(process.execPath, [frozenToolchain.exporter, profile, toolchain.executable, snapshot.sourceRoot ?? snapshot.project], {
        cwd: snapshot.project, env: { ...process.env, ...snapshot.storage?.environment, GAME_EXPORT_RECOVERY_BUDGET: join(snapshot.container, 'export-recovery-used') }, stdio: 'inherit', timeout: 32 * 60_000, killSignal: 'SIGKILL',
      }) } catch (error) { if (error.status === 73) throw new GameStorageError(); throw error }
      snapshot.storage?.check()
    })
    validateExportDirectory(snapshot.project, output)
    if (JSON.stringify(resolveBuildToolchain(snapshot.project, { executable: toolchain.executable }).identity) !== JSON.stringify(toolchain.identity)) {
      throw new Error('Game release toolchain changed while building; retry after installation finishes')
    }
  })
  if (recordProvenance) {
    const provenance = reconcileProvenance(snapshot.project)
    recordBuildProvenance(snapshot.project, exportedAssetEvidence(output, { profile, assets: provenance.assets }), { renderedCaptureRoot: snapshot.sourceRoot })
  }
  return output
}
