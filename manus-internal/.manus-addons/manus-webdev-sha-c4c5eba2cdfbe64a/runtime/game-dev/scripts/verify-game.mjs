import { ensureSerialImports } from './import-settings.mjs'
import { existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { readCurrentPreview } from './preview-state.mjs'
import { readPackInventory, fileDigest } from './export-asset-inventory.mjs'
import { resolveBuildExecutable, resolveBuildToolchain } from './build-toolchain.mjs'
import { buildSnapshotIdentity, matchingSourceSnapshotIdentity, readPreparedSnapshot } from './build-snapshot.mjs'
import { restoreBundledProjectFonts } from './restore-bundled-fonts.mjs'
import { runGameProcess } from './game-process.mjs'
import { tryAcquireExportLock, releaseExportLock } from './local-artifacts.mjs'
import { visualCoverageSummary } from './asset-provenance.mjs'
import { warnTextureBudgets } from './texture-budget.mjs'

function usesDefaultMainLoop(root) {
  let application = false
  for (const line of readFileSync(join(root, 'project.godot'), 'utf8').split(/\r?\n/)) {
    const section = line.match(/^\s*\[([^\]]+)\]\s*(?:;.*)?$/)
    if (section) application = section[1] === 'application'
    if (application && /^\s*run\/main_loop_type\s*=/.test(line)) {
      return /^\s*run\/main_loop_type\s*=\s*"SceneTree"\s*(?:;.*)?$/.test(line)
    }
  }
  return true
}

function fontBindingBoot(isolated) {
  // Observe loaded font bindings and fail on drawn characters their font chain
  // lacks (Web has no system font fallback). No family, size or upload policy.
  // No source scan, extra engine invocation or
  // persistent proof that could outlive changed scene/font inputs.
  const helper = join(isolated, 'game_fonts.gd')
  writeFileSync(helper, readFileSync(new URL('../godot/game_fonts.gd', import.meta.url)))
  const script = join(isolated, 'font_binding_boot.gd')
  writeFileSync(script, `extends SceneTree
const Fonts = preload(${JSON.stringify(helper)})
func _initialize() -> void:
\t_boot.call_deferred()
func _boot() -> void:
\tvar probe := Fonts.BindingProbe.new()
\tprobe.name = "ManusFontBindingProbe"
\troot.add_child(probe)
\tvar main_scene: String = ProjectSettings.get_setting("application/run/main_scene", "")
\tif main_scene.is_empty() or change_scene_to_file(main_scene) != OK:
\t\tpush_error("Game font binding boot could not load the configured main scene")
\t\tquit(1)
`)
  return script
}

function hooks(root) {
  const path = join(root, 'game-verification.json')
  if (!existsSync(path)) return []
  if (!lstatSync(path).isFile() || lstatSync(path).isSymbolicLink() || lstatSync(path).size > 16_384) throw new Error('Invalid game verification configuration')
  const config = JSON.parse(readFileSync(path, 'utf8'))
  if (config.version !== 1 || !Array.isArray(config.checks) || config.checks.length > 12 ||
      config.checks.some(check => !check || !['script', 'scene'].includes(check.kind) ||
        (check.profile !== undefined && !['source', 'pack'].includes(check.profile)) ||
        typeof check.path !== 'string' || !/^res:\/\//.test(check.path) ||
        check.path.slice(6).split('/').some(part => !part || part === '.' || part === '..' || /[\\:\x00-\x1f]/.test(part)) ||
        typeof check.expect !== 'string' || !check.expect.length || check.expect.length > 200)) throw new Error('Invalid game verification configuration')
  return config.checks
}

export function verifiedPack(root) {
  // Match Preview's frozen selection, including new local media before asset
  // synchronization. A new or changed asset must also invalidate an older pack.
  const currentCandidate = buildSnapshotIdentity({ project: root, toolchain: resolveBuildToolchain(root).identity }, { dirtyAssets: true, includeLocalAssets: true })
  if (existsSync(join(root, 'dist/.snapshots/prepared.json'))) {
    try {
      const prepared = readPreparedSnapshot(root)
      const build = prepared.manifest.build
      const path = join(root, 'dist/.release/index.pck')
      // Preparation/save already exported the release projection. Run outcome
      // hooks against those exact bytes, without demanding a portable export.
      // Match cache-only import rewrites, but never edited source or toolchains.
      const source = build?.snapshotId === currentCandidate.snapshotId ? currentCandidate :
        build && matchingSourceSnapshotIdentity({ project: prepared.project, sourceRoot: root,
          toolchain: build.toolchain, includeLocalAssets: true })
      if (build?.export && source?.snapshotId === currentCandidate.snapshotId &&
        build.export.files['index.pck'] === fileDigest(path)) {
        return { path, snapshotId: currentCandidate.snapshotId, artifactSnapshotId: build.snapshotId,
          digest: build.export.files['index.pck'] }
      }
    } catch { /* An absent or stale prepared release may still have a current local export. */ }
  }
  const standalone = join(root, 'dist/.standalone-export.json')
  if (existsSync(standalone)) {
    try {
    const receipt = JSON.parse(readFileSync(standalone, 'utf8'))
    const path = join(root, 'dist/standalone/index.pck')
    if (receipt.profile === 'release' && (receipt.sourceSnapshotId ?? receipt.snapshotId) === currentCandidate.snapshotId && receipt.files?.['index.pck'] === fileDigest(path)) {
      return { path, snapshotId: currentCandidate.snapshotId, artifactSnapshotId: receipt.snapshotId, digest: receipt.files['index.pck'] }
    }
    } catch { /* Try a current verified preview before requesting another build. */ }
  }
  const preview = readCurrentPreview(root)
  if (!preview?.build?.export) throw new Error('No current verified export receipt; run the existing game build before --pack')
  if ((preview.build.sourceSnapshotId ?? preview.build.snapshotId) !== currentCandidate.snapshotId) throw new Error('Game source changed since the preview export; build the changed game before --pack')
  return { path: join(root, 'dist/.preview/builds', preview.generation, 'index.pck'), snapshotId: preview.build.snapshotId,
    digest: preview.build.export.files['index.pck'] }
}

// Finite import/boot plus small game-owned semantic hooks. No export, watcher,
// browser or invented private method checks. Native state is isolated per run.
export function verifyGame(root, { pack = false, executable } = {}) {
  root = realpathSync(root)
  const engine = executable ?? resolveBuildExecutable(root)
  const checks = hooks(root).filter(check => check.profile === undefined || check.profile === (pack ? 'pack' : 'source'))
  const isolated = mkdtempSync(join(tmpdir(), 'manus-game-verify-'))
  const env = { ...process.env, XDG_DATA_HOME: join(isolated, 'data'), XDG_CONFIG_HOME: join(isolated, 'config') }
  let artifact
  let exportLocked = false
  try {
    let base
    if (pack) {
      // Standalone output is replaceable. Hold its existing writer lock until
      // Godot and all hooks finish using exactly the pack we hashed below.
      if (!tryAcquireExportLock(root)) throw new Error('Game build is busy; retry the pack check after the current build finishes')
      exportLocked = true
      artifact = verifiedPack(root)
      const inventory = readPackInventory(artifact.path)
      if (!inventory.paths.has('project.godot') && !inventory.paths.has('project.binary')) throw new Error('Export pack has no project configuration')
      const empty = join(isolated, 'project')
      mkdirSync(empty)
      base = ['--headless', '--path', empty, '--main-pack', artifact.path]
    } else {
      ensureSerialImports(root)
      restoreBundledProjectFonts(root)
      warnTextureBudgets(root)
      runGameProcess(engine, ['--headless', '--path', root, '--editor', '--import'], { cwd: root, env, label: 'Game import' })
      base = ['--headless', '--path', root]
    }
    const observeBindings = usesDefaultMainLoop(root)
    const boot = runGameProcess(engine, [...base, ...(observeBindings ? ['--script', fontBindingBoot(isolated)] : []), '--fixed-fps', '60', '--quit-after', '180'], { cwd: root, env, timeout: 30_000, label: 'Game boot' })
    let fontBindings = { scope: 'unavailable', reason: 'custom-main-loop-preserved' }
    if (observeBindings) {
      const proof = boot.match(/^\[MANUS_FONT_BINDINGS\](\{[^\n]+\})$/m)
      if (!proof) throw new Error('Game boot did not finish its font-binding observation')
      fontBindings = JSON.parse(proof[1])
      if (fontBindings.scope !== 'boot-encountered-theme-and-Label3D-bindings' || fontBindings.errors !== 0 ||
          !Number.isSafeInteger(fontBindings.nodes) || fontBindings.nodes < 0 || !Number.isSafeInteger(fontBindings.fontResources) || fontBindings.fontResources < 0 ||
          !Number.isSafeInteger(fontBindings.missingGlyphs) || fontBindings.missingGlyphs < 0 || !Array.isArray(fontBindings.missingSamples)) {
        throw new Error('Game boot font-binding observation failed')
      }
      if (fontBindings.missingGlyphs > 0) {
        const samples = fontBindings.missingSamples.map(sample => `${sample.codepoint} ${sample.char} at ${sample.node}`)
        if (fontBindings.missingGlyphs > samples.length) samples.push(`${fontBindings.missingGlyphs - samples.length} more`)
        throw new Error(`Game text has ${fontBindings.missingGlyphs} character(s) without a glyph in the bound font chain; the Web export draws them as boxes: ${samples.join('; ')}. Add a covering Google Fonts family under assets/fonts/ and bind it as a fallback in the template's font resources (see Requested multilingual support).`)
      }
    }
    for (const check of checks) {
      if (pack && check.kind === 'scene') continue // Developer scenes are deliberately excluded from release.
      const local = join(root, check.path.slice(6))
      if (realpathSync(local) !== local || !lstatSync(local).isFile()) throw new Error('Game verification hook must be a project file')
      const output = runGameProcess(engine, [...base, ...(check.kind === 'script' ? ['--script', pack ? local : check.path] : [check.path]), '--quit-after', '1800'],
        { cwd: root, env, timeout: 60_000, label: `Game outcome check ${check.path}` })
      if (!output.includes(check.expect)) throw new Error(`Game outcome check did not finish: ${check.path}`)
    }
    return { ok: true, profile: pack ? 'pack' : 'source', outcomeChecks: checks.filter(check => !pack || check.kind === 'script').length, fontBindings,
      visualCoverage: visualCoverageSummary(root),
      ...(artifact ? { pck: artifact.path, snapshotId: artifact.snapshotId, sha256: artifact.digest } : {}) }
  } finally {
    if (exportLocked) releaseExportLock(root)
    rmSync(isolated, { recursive: true, force: true })
  }
}
