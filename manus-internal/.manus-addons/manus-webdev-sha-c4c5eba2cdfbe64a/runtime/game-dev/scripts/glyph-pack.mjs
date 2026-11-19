import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

// Platform runtime fonts, staged beside index.html of Godot Web exports whose
// GDScript calls load_glyph_pack(); game_fonts.gd then downloads them. The JSON
// is part of the exporter's static identity (exporter-modules.mjs).
const pack = new URL('../glyph-pack/', import.meta.url)
const manifest = JSON.parse(readFileSync(new URL('../glyph-pack/manifest.json', import.meta.url), 'utf8'))
export const GLYPH_PACK_DIRECTORY = 'manus-glyph-pack'
// The helper's own definition does not count. A call in a comment does: an extra
// pack only costs bytes, a missed call loses the characters.
const CALL = /(?<!func\s+)\bload_glyph_pack\s*\(/

function verifiedBytes(entry) {
  const bytes = readFileSync(new URL(entry.name, pack))
  if (bytes.length !== entry.size || 'sha256:' + createHash('sha256').update(bytes).digest('hex') !== entry.sha256) {
    throw new Error('Game glyph pack integrity failed: ' + entry.name)
  }
  return bytes
}

// Scan project GDScript, skipping hidden directories, export output and links.
export function usesGlyphPack(root) {
  if (!root) return false
  const visit = directory => readdirSync(directory, { withFileTypes: true }).some(entry => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return !entry.name.startsWith('.') && entry.name !== 'dist' && visit(path)
    return entry.isFile() && entry.name.endsWith('.gd') && CALL.test(readFileSync(path, 'utf8'))
  })
  return visit(root)
}

// The directory name is reserved: project output cannot supply or replace it.
export function stageGlyphPack(output, root) {
  if (!usesGlyphPack(root)) return
  const target = join(output, GLYPH_PACK_DIRECTORY)
  mkdirSync(target)
  for (const entry of manifest.files) writeFileSync(join(target, entry.name), verifiedBytes(entry), { flag: 'wx' })
}

export function glyphPackLicenses() {
  return manifest.files.filter(entry => entry.role === 'license').map(entry => ({
    path: `${GLYPH_PACK_DIRECTORY}/${entry.name}`,
    fonts: manifest.files.filter(font => font.licenseFile === entry.name).map(font => font.name),
    sha256: entry.sha256.slice('sha256:'.length),
    text: verifiedBytes(entry).toString('utf8').replaceAll('\r\n', '\n'),
  }))
}
