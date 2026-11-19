import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { validateExportDirectory } from './local-artifacts.mjs'
import { releaseFiles } from './release-manifest.mjs'

const metadata = path => path === '.build-fingerprint' || path === '.build-files.json'

// Callers hold the project export lock. Cache misses never waive export checks.
export function hasCachedExport(root, directory, snapshotId) {
  try {
    validateExportDirectory(root, directory)
    return readFileSync(join(directory, '.build-fingerprint'), 'utf8').trim() === snapshotId &&
      readFileSync(join(directory, '.build-files.json'), 'utf8') === JSON.stringify(releaseFiles(directory, metadata))
  } catch { return false }
}

export function stampExportCache(directory, snapshotId) {
  writeFileSync(join(directory, '.build-files.json'), JSON.stringify(releaseFiles(directory, metadata)))
  // Written last: a partial cache must not appear complete.
  writeFileSync(join(directory, '.build-fingerprint'), snapshotId)
}
