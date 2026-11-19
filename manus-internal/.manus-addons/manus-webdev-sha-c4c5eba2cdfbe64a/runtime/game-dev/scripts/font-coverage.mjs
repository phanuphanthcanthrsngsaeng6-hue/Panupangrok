import { brotliDecompressSync, inflateSync } from 'node:zlib'

// Inspect Unicode coverage without a native font engine or fontTools in CI.
// WOFF2 transforms outlines and metrics, but its cmap table is untransformed.
export function fontCodepoints(input) {
  const data = Buffer.from(input)
  if (data.length < 12) throw new Error('Invalid font size')
  let cmap
  const magic = data.toString('ascii', 0, 4)
  if (magic === 'wOF2') {
    if (data.length < 48 || data.toString('ascii', 4, 8) === 'ttcf') throw new Error('Unsupported WOFF2 collection')
    if (data.readUInt32BE(8) !== data.length) throw new Error('Invalid WOFF2 length')
    const count = data.readUInt16BE(12)
    if (!count || count > 128) throw new Error('Invalid WOFF2 table count')
    let position = 48
    const uintBase128 = () => {
      let value = 0
      for (let index = 0; index < 5; index++) {
        const byte = data.readUInt8(position++)
        if ((!index && byte === 0x80) || value > 0x1ffffff) throw new Error('Invalid WOFF2 integer')
        value = value * 128 + (byte & 127)
        if (!(byte & 128)) return value
      }
      throw new Error('Invalid WOFF2 integer')
    }
    let offset = 0
    let cmapRange
    for (let index = 0; index < count; index++) {
      const flags = data.readUInt8(position++)
      const tagIndex = flags & 63
      let tag = tagIndex === 0 ? 'cmap' : tagIndex === 10 ? 'glyf' : tagIndex === 11 ? 'loca' : ''
      if (tagIndex === 63) {
        tag = data.toString('ascii', position, position + 4)
        position += 4
      }
      const originalLength = uintBase128()
      const transform = flags >> 6
      const transformed = tag === 'glyf' || tag === 'loca' ? transform !== 3 : transform !== 0
      const length = transformed ? uintBase128() : originalLength
      if (tag === 'cmap') {
        if (transformed || cmapRange) throw new Error('Invalid WOFF2 cmap')
        cmapRange = [offset, length]
      }
      offset += length
    }
    const compressedSize = data.readUInt32BE(20)
    if (!cmapRange || position + compressedSize > data.length) throw new Error('Missing or truncated WOFF2 cmap')
    const tables = brotliDecompressSync(data.subarray(position, position + compressedSize), { maxOutputLength: offset })
    if (tables.length !== offset) throw new Error('Invalid WOFF2 table lengths')
    cmap = tables.subarray(cmapRange[0], cmapRange[0] + cmapRange[1])
  } else if (magic === 'wOFF') {
    const count = data.readUInt16BE(12)
    for (let index = 0; index < count; index++) {
      const entry = 44 + 20 * index
      if (data.toString('ascii', entry, entry + 4) !== 'cmap') continue
      const start = data.readUInt32BE(entry + 4)
      const compressed = data.readUInt32BE(entry + 8)
      const original = data.readUInt32BE(entry + 12)
      if (!original || compressed > original || start + compressed > data.length) throw new Error('Invalid WOFF cmap bounds')
      cmap = compressed === original ? data.subarray(start, start + original) : inflateSync(data.subarray(start, start + compressed), { maxOutputLength: original })
      if (cmap.length !== original) throw new Error('Invalid WOFF cmap length')
    }
  } else {
    if (magic !== 'OTTO' && data.readUInt32BE(0) !== 0x00010000) throw new Error('Unsupported font format')
    const count = data.readUInt16BE(4)
    for (let index = 0; index < count; index++) {
      const entry = 12 + 16 * index
      if (data.toString('ascii', entry, entry + 4) !== 'cmap') continue
      const offset = data.readUInt32BE(entry + 8)
      const length = data.readUInt32BE(entry + 12)
      if (offset + length > data.length) throw new Error('Invalid SFNT cmap bounds')
      cmap = data.subarray(offset, offset + length)
    }
  }
  if (!cmap || cmap.length < 4) throw new Error('Missing Unicode cmap')
  const candidates = []
  const preference = ['3:10', '0:6', '0:4', '3:1', '0:3', '0:2', '0:1', '0:0']
  for (let index = 0; index < cmap.readUInt16BE(2); index++) {
    const entry = 4 + index * 8
    const rank = preference.indexOf(`${cmap.readUInt16BE(entry)}:${cmap.readUInt16BE(entry + 2)}`)
    const offset = cmap.readUInt32BE(entry + 4)
    const format = cmap.readUInt16BE(offset)
    if (rank >= 0 && (format === 4 || format === 12)) candidates.push({ rank, offset, format })
  }
  candidates.sort((a, b) => a.rank - b.rank)
  const selected = candidates[0]
  if (!selected) throw new Error('Unsupported Unicode cmap')
  const { offset, format } = selected
  const length = format === 4 ? cmap.readUInt16BE(offset + 2) : cmap.readUInt32BE(offset + 4)
  if (offset + length > cmap.length) throw new Error('Truncated cmap subtable')
  const table = cmap.subarray(offset, offset + length)
  const codepoints = new Set()
  if (format === 12) {
    const count = table.readUInt32BE(12)
    if (16 + count * 12 > table.length) throw new Error('Truncated cmap groups')
    for (let index = 0; index < count; index++) {
      const entry = 16 + index * 12
      const start = table.readUInt32BE(entry)
      const end = table.readUInt32BE(entry + 4)
      const glyph = table.readUInt32BE(entry + 8)
      if (end < start || end > 0x10ffff) throw new Error('Invalid Unicode range')
      for (let cp = start; cp <= end; cp++) if (glyph + cp - start !== 0) codepoints.add(cp)
    }
  } else {
    const count = table.readUInt16BE(6) / 2
    if (!Number.isInteger(count) || !count || 16 + count * 8 > table.length) throw new Error('Invalid cmap segments')
    for (let index = 0; index < count; index++) {
      const end = table.readUInt16BE(14 + index * 2)
      const start = table.readUInt16BE(16 + count * 2 + index * 2)
      const delta = table.readInt16BE(16 + count * 4 + index * 2)
      const rangeWord = 16 + count * 6 + index * 2
      const range = table.readUInt16BE(rangeWord)
      if (end < start) throw new Error('Invalid cmap segment')
      for (let cp = start; cp <= end; cp++) {
        const raw = range ? table.readUInt16BE(rangeWord + range + (cp - start) * 2) : cp
        const glyph = range && !raw ? 0 : (raw + delta) & 0xffff
        if (glyph) codepoints.add(cp)
      }
    }
  }
  return codepoints
}

export function loaderCodepoints(source) {
  const visible = source.replace(/data:[^;\s]+;base64,[A-Za-z0-9+/=]+/g, '')
    .replace(/<!--[\s\S]*?-->|\/\*[\s\S]*?\*\//g, '')
    .replace(/\\u\{([0-9a-fA-F]+)\}|\\u([0-9a-fA-F]{4})/g, (_, braced, fixed) => String.fromCodePoint(parseInt(braced ?? fixed, 16)))
  return new Set([...visible].filter(char => char.codePointAt(0) > 127 && !/\s/.test(char)).map(char => char.codePointAt(0)))
}

export function embeddedFontFaces(source) {
  return [...source.matchAll(/@font-face\s*\{([^}]+)\}/gi)].map(([, declaration]) => {
    const family = declaration.match(/font-family:\s*["']?([^;"']+)/)?.[1]?.trim()
    const urls = [...declaration.matchAll(/\burl\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)/gi)]
      .map(match => (match[1] ?? match[2] ?? match[3]).trim())
    const embedded = urls.length === 1 && urls[0].match(/^data:font\/(?:ttf|otf|woff2?);base64,([A-Za-z0-9+/=]+)$/i)
    // A local() or remote URL can precede embedded bytes in the same face, or
    // replace them in a second src declaration. Reject the entire source list.
    if (!embedded || /\blocal\s*\(/i.test(declaration)) throw new Error('Loader font requires a network or system source: ' + family)
    return { family, data: Buffer.from(embedded[1], 'base64') }
  })
}
