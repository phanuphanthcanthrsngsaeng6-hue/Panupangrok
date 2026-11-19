#!/usr/bin/env node
import { saveGameRelease } from './scripts/save-release.mjs'
import { atReleaseStage, releaseFailureDiagnostic } from './scripts/release-diagnostics.mjs'

try {
  atReleaseStage('arguments', () => {
    if (process.argv.length !== 4 || process.argv[2] !== '--message') throw new Error('Game save usage: save-release.mjs --message "commit message" (run in the Game project directory)')
  })
  console.log('__GAME_SAVE__ ' + JSON.stringify(saveGameRelease(process.cwd(), process.argv[3])))
} catch (error) {
  console.error('__GAME_SAVE_ERROR__ ' + JSON.stringify(releaseFailureDiagnostic(error, 'local_git')))
  // Git/engine diagnostics can contain local paths or transport configuration.
  if (error instanceof Error && (/^(Game save |Game release |Game sharing |Game asset changed|Invalid game release |Unsupported release entry|Release directory)/.test(error.message))) console.error(error.message)
  console.error('Game save did not complete. Inspect preparation and local Git before retrying. No push, checkpoint, or publication was performed.')
  process.exitCode = 1
}
