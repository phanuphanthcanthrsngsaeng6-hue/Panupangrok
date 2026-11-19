import { createHash } from 'node:crypto'
import { closeSync, openSync, readSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { exporterDigest } from './exporter-modules.mjs'
import { inspectGameToolchain } from './game-toolchain.mjs'
export { buildExportTemplatesDirectory, resolveBuildExecutable } from './game-toolchain.mjs'

function fileDigest(file) {
  const fd = openSync(file, 'r')
  const hash = createHash('sha256')
  const buffer = Buffer.alloc(1024 * 1024)
  try {
    for (;;) {
      const size = readSync(fd, buffer, 0, buffer.length, null)
      if (!size) break
      hash.update(buffer.subarray(0, size))
    }
  } finally { closeSync(fd) }
  return 'sha256:' + hash.digest('hex')
}

export function resolveBuildToolchain(root, options = {}) {
  const resolved = inspectGameToolchain(root, options)
  const engine = resolved.executable
  const version = resolved.version
  const templates = Object.fromEntries(Object.entries(resolved.templateFiles).map(([profile, file]) => [profile, fileDigest(file)]))
  // The installed runtime owns the exporter and its identity for every build path.
  // Project files must not select a different compiler for the frozen snapshot.
  const runtimeRoot = dirname(dirname(fileURLToPath(import.meta.url)))
  return { executable: engine, exporter: join(runtimeRoot, 'export-profile.mjs'), identity: {
    engineVersion: version, engineDigest: fileDigest(engine), templates, runtimeDigest: exporterDigest(runtimeRoot),
  } }

}
