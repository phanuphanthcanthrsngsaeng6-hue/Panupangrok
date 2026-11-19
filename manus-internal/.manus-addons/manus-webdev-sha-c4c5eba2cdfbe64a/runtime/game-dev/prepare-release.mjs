#!/usr/bin/env node
import { prepareArtifacts, prepareSharing } from './scripts/artifacts-lib.mjs'
import { verifyRelease } from './scripts/release-manifest.mjs'
import { readPreparedSnapshot, stagePreparedSnapshot } from './scripts/build-snapshot.mjs'
import { tryAcquireExportLock, releaseExportLock } from './scripts/artifacts-lib.mjs'
import { atReleaseStage, releaseFailureDiagnostic } from './scripts/release-diagnostics.mjs'

try {
  if (process.argv.length > 3 || (process.argv[2] && !['--verify', '--verify-prepared', '--stage', '--prepare-share-stdin'].includes(process.argv[2]))) throw new Error('Usage: prepare-release.mjs [--verify|--verify-prepared|--stage|--prepare-share-stdin] (run in the game project directory)')
  if (process.argv[2] === '--prepare-share-stdin') {
    // Private transport terminates in the MCP. This bounded input contains only
    // the trusted publication origin; metadata and images stay in the project.
    const chunks = []
    let size = 0
    for await (const chunk of process.stdin) {
      size += chunk.length
      if (size > 4096) throw new Error('Game sharing preparation is too large')
      chunks.push(chunk)
    }
    const context = prepareSharing(process.cwd(), JSON.parse(Buffer.concat(chunks).toString('utf8')))
    console.log('__GAME_SHARE__ ' + JSON.stringify(context))
  } else {
    const prepared = !process.argv[2] ? prepareArtifacts(process.cwd()) : null
    let manifest
    if (!tryAcquireExportLock(process.cwd())) throw new Error('Game release is busy; retry verification or staging after the build finishes')
    try {
      if (process.argv[2] === '--stage') manifest = stagePreparedSnapshot(process.cwd())
      else {
        // Preserve the existing verifier's meaning after restore/checkout. Only
        // the explicit prepared mode verifies cached A independently of edits B.
        manifest = process.argv[2] === '--verify'
          ? atReleaseStage('verify_release', () => verifyRelease(process.cwd())) : readPreparedSnapshot(process.cwd()).manifest
      }
      if (prepared && manifest.build?.snapshotId !== prepared.source_fingerprint) throw new Error('Game release was replaced by another preparation; verify the prepared candidate before staging')
    } finally { releaseExportLock(process.cwd()) }
    console.log('__GAME_RELEASE__ ' + JSON.stringify({ manifest: 'site/game-release.json', sourceTree: manifest.inputs.tree, snapshotId: manifest.build?.snapshotId, staged: process.argv[2] === '--stage', artifacts: manifest.artifacts }))
  }
} catch (error) {
  console.error('__GAME_RELEASE_ERROR__ ' + JSON.stringify(releaseFailureDiagnostic(error)))
  const message = error instanceof Error ? error.message : ''
  if (/^(Game release |Game sharing |Game asset changed|Invalid game release |Unsupported release entry|Release directory)/.test(message)) console.error(message)
  console.error('Game release preparation or verification failed. Inspect the export diagnostics and rerun after fixing the source, storage, or engine configuration. No Git push or publication was performed.')
  process.exitCode = 1
}
