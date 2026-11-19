#!/usr/bin/env node
import { setTimeout as delay } from 'node:timers/promises'
import { readPreviewStatus, requestPreviewBuild } from './scripts/preview-control.mjs'

try {
  if (process.argv.length > 3 || (process.argv[2] && process.argv[2] !== '--status')) throw new Error('usage: preview-build.mjs [--status]')
  let status
  if (process.argv[2] === '--status') status = await readPreviewStatus(process.cwd())
  else {
    const build = await requestPreviewBuild(process.cwd())
    status = build.status
    const buildId = status.buildId
    // Includes bounded export-lock wait, asset hydration and three export attempts.
    const deadline = Date.now() + 80 * 60_000
    while (status.buildPhase === 'exporting' && Date.now() < deadline) {
      await delay(500)
      status = await build.poll()
      if (status.buildId !== buildId) throw new Error('a newer preview build replaced this request; inspect --status')
    }
    if (status.buildPhase !== 'ready') throw new Error(status.buildPhase === 'waiting' ? 'preview build has not completed; inspect npm run preview:status' : status.buildPhase === 'failed' ? 'preview build failed; inspect the resident preview server log and retry after fixing the errors' : 'preview build timed out; inspect --status before retrying')
  }
  console.log('__GAME_PREVIEW__' + JSON.stringify(status))
} catch (error) {
  const message = error.message?.startsWith('preview build') || error.message?.startsWith('usage:') || error.message?.startsWith('a newer preview')
    ? error.message : 'preview server is unavailable; start the Game preview server for this project, then retry'
  console.error(`[game-preview] ${message}`)
  process.exitCode = 1
}
