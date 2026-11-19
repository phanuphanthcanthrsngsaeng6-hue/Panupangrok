import { createHash } from 'node:crypto'
import { lstatSync, readFileSync, realpathSync } from 'node:fs'
import { dirname, join, posix } from 'node:path'

// Only the compiler's static module graph defines its identity. HTTP servers,
// upload adapters and Agent instructions cannot invalidate a Godot export.
export function exporterDigest(root) {
  root = realpathSync(root)
  const files = new Map()
  const visit = name => {
    name = posix.normalize(name)
    if (name.startsWith('../') || name.startsWith('/')) throw new Error('Game exporter dependency escapes its package')
    if (files.has(name)) return
    const file = join(root, name)
    if (!lstatSync(file).isFile() || realpathSync(file) !== file) throw new Error('Game exporter dependency must be a regular file')
    const source = readFileSync(file)
    files.set(name, source)
    if (!/\.m?js$/.test(name)) return
    for (const [, dependency] of source.toString().matchAll(/(?:from\s*|import\s*|new URL\(\s*)['"](\.[^'"\n]+\.(?:mjs|js|json))['"]/g)) {
      visit(posix.join(dirname(name), dependency))
    }
  }
  visit('export-profile.mjs')
  const hash = createHash('sha256')
  for (const [name, bytes] of [...files].sort(([a], [b]) => a.localeCompare(b, 'en'))) hash.update(name).update('\0').update(bytes).update('\0')
  return 'sha256:' + hash.digest('hex')
}
