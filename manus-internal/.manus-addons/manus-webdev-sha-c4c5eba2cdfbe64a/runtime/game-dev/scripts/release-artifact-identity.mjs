import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { importCacheIdentity } from './build-snapshot.mjs'
import { releaseProjection } from './release-profile.mjs'

const hash = bytes => 'sha256:' + createHash('sha256').update(bytes).digest('hex')

// This identifies engine inputs, not the authored snapshot or its audit receipt.
// Use only with a fresh projection of the same frozen source. Reuse its hashes
// so a cache lookup does not read every model/texture/font a second time.
export function releaseArtifactIdentity(root, toolchain, projection = releaseProjection(root)) {
  const removed = new Set([...projection.removed, 'asset-provenance.json', 'asset-provenance-report.md', 'game-sharing.json', 'game-texture-budgets.json'])
  const files = {}
  for (const file of Object.keys(projection.files).sort()) {
    if (removed.has(file)) continue
    const rewritten = projection.rewritten.get(file)
    files[file] = file.endsWith('.import')
      ? hash(importCacheIdentity(rewritten ?? readFileSync(join(root, file))))
      : rewritten ? hash(rewritten) : projection.files[file]
  }
  return hash(JSON.stringify({ version: 1, profile: 'release', files, toolchain: toolchain.identity ?? toolchain }))
}
