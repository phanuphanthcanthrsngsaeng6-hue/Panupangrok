#!/usr/bin/env node
import { recoverFrozenExport, exportRecoveryError } from './scripts/export-recovery.mjs'
import { createExportReceipt } from './scripts/export-receipt.mjs'
import { runGodotChecked, validateGamePack } from './scripts/validate-game-pack.mjs'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { withReleaseProjection, verifyReleasePack } from './scripts/release-profile.mjs'
import { assertAssetsPresent, validateExportDirectory } from './scripts/local-artifacts.mjs'
import { adaptGodotOpaquePreview } from './scripts/opaque-preview-compat.mjs'
import { adaptGodotBrowserVersionCheck } from './scripts/browser-version-compat.mjs'
import { withWebExport } from './scripts/web-export.mjs'
import { previewBackdropMetadata } from './scripts/preview-backdrop.mjs'
import { stageEngineRuntimeNotices } from './scripts/runtime-notices.mjs'
import { stageGlyphPack } from './scripts/glyph-pack.mjs'

// Internal project-owned compiler entry. The caller owns the immutable snapshot
// and export lock. Platform preparation and offline build call the same entry.
// Keep inherited output pipes open until the synchronous engine has stopped.
// The resident server signals the whole process group on cancellation.
let interrupted = false
process.on('SIGTERM', () => { interrupted = true })
process.on('SIGINT', () => { interrupted = true })
const [profile, engine, diagnosticRoot] = process.argv.slice(2)
if (![4, 5].includes(process.argv.length) || !['preview', 'release'].includes(profile) || !engine) throw new Error('Game exporter requires profile and resolved engine')
const root = process.cwd()
assertAssetsPresent(root)
const output = join(root, 'dist', profile === 'release' ? '.release' : '.preview-next')
const run = () => withWebExport(root, output, () => {
  runGodotChecked(engine, ['--headless', '--path', root, profile === 'release' ? '--export-release' : '--export-debug', 'Web', join(output, 'index.html')], {
    cwd: root, diagnosticRoot: diagnosticRoot ?? root, timeout: 15 * 60_000,
  })
  validateExportDirectory(root, output)
  const script = join(output, 'index.js')
  writeFileSync(script, adaptGodotBrowserVersionCheck(adaptGodotOpaquePreview(readFileSync(script, 'utf8'))))
})
try { await recoverFrozenExport(root, output, async () => {
  rmSync(output, { recursive: true, force: true })
  mkdirSync(output, { recursive: true })
  if (profile === 'release') withReleaseProjection(root, receipt => {
    run()
    verifyReleasePack(join(output, 'index.pck'), receipt)
  })
  else run()
  if (profile === 'preview') {
    const html = join(output, 'index.html')
    writeFileSync(html, previewBackdropMetadata(readFileSync(html, 'utf8'), readFileSync(join(root, 'project.godot'), 'utf8')))
  }
  validateExportDirectory(root, output)
  stageGlyphPack(output, root)
  stageEngineRuntimeNotices(output, engine, root)
  const exported = createExportReceipt(output, profile)
  await new Promise(resolve => setImmediate(resolve))
  if (interrupted) throw exportRecoveryError('GAME_EXPORT_CANCELLED', 'Game export cancelled')
  validateGamePack(engine, join(output, 'index.pck'), { diagnosticRoot: diagnosticRoot ?? root })
  validateExportDirectory(root, output)
  if (createExportReceipt(output, profile).digest !== exported.digest) {
    throw exportRecoveryError('GAME_EXPORT_ARTIFACT_CHANGED', 'Game export artifact changed during validation')
  }
}, { cancelled: () => interrupted, budgetFile: process.env.GAME_EXPORT_RECOVERY_BUDGET })
} catch (error) {
  if (error.code !== 'GAME_STORAGE_CAPACITY') throw error
  console.error('[GAME_STORAGE_CAPACITY] ' + error.message)
  process.exitCode = 73
}
