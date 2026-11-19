#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs'
import { tryAcquireExportLock, releaseExportLock } from './scripts/artifacts-lib.mjs'
import { restoreThreejsAssets, assetRestoreDiagnostic } from './scripts/threejs-asset-restore.mjs'

let locked = false
try {
  if (process.argv.length !== 3 || process.argv[2] !== '--from-lock') throw new Error('Three.js restore requires --from-lock after selecting the intended checkpoint. Preserve unsaved edits first.')
  if (existsSync('manus-webdev.json') && !process.env.GIT_DIR) throw new Error('Three.js restore requires webdev.manus_git for this Local First project.')
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
  if (!(pkg.dependencies?.three || pkg.devDependencies?.three)) throw new Error('Three.js restore requires a Three.js project.')
  locked = tryAcquireExportLock()
  if (!locked) throw new Error('Three.js restore is busy; retry after the active operation finishes.')
  const restored = await restoreThreejsAssets(process.cwd(), { mode: 'checkpoint' })
  console.log(JSON.stringify({ ok: true, restored, manifest: 'assets.lock.json' }))
} catch (error) {
  if (error instanceof Error && error.message.startsWith('Three.js restore ')) console.error(error.message)
  else console.error(JSON.stringify(assetRestoreDiagnostic(error)))
  process.exitCode = 1
} finally {
  if (locked) releaseExportLock()
}
