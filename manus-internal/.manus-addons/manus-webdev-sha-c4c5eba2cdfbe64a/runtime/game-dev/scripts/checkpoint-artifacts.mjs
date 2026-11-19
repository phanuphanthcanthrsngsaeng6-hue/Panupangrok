#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { prepareArtifacts } from './artifacts-lib.mjs'
import { readPreparedSnapshot } from './build-snapshot.mjs'
import { verifyRelease } from './release-manifest.mjs'

try {
  if (process.argv[2] === '--verify') {
    // Legacy callers stage the working tree themselves. They must still reject
    // edits B after preparing A; validating the cached candidate alone is unsafe.
    let matches = false
    try {
      matches = verifyRelease(process.cwd()).build?.snapshotId === process.argv[3] &&
        readPreparedSnapshot(process.cwd()).manifest.build?.snapshotId === process.argv[3]
    } catch { /* Report the existing compatibility error below. */ }
    if (!matches) {
      throw Object.assign(new Error('Game sources changed during checkpoint preparation'), {
        code: 'GAME_CHECKPOINT_SOURCE_CHANGED',
      })
    }
  } else {
    const artifacts = prepareArtifacts(process.cwd())
    const state = JSON.parse(readFileSync('.manus-artifacts.json', 'utf8'))
    console.log('__CHECKPOINT_DIAGNOSTICS__ ' + JSON.stringify({
      artifact_contract_version: 1,
      template_validation_status: state.template_validation.status,
    }))
    console.log('__CHECKPOINT_ARTIFACTS__ ' + JSON.stringify(artifacts))
  }
} catch (error) {
  const code = ['GAME_TEMPLATE_VALIDATION_FAILED', 'GAME_CHECKPOINT_SOURCE_CHANGED'].includes(error.code)
    ? error.code : 'GAME_CHECKPOINT_PREPARATION_FAILED'
  console.error('__CHECKPOINT_ERROR__ ' + code)
  console.error(error.message)
  process.exitCode = 1
}
