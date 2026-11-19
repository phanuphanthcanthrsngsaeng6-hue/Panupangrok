import { createHash } from 'node:crypto'
import { lstatSync, readFileSync, realpathSync } from 'node:fs'
import { resolve, sep } from 'node:path'

// Replacement for dumping an inline-font loader into model context. It never
// rewrites the file, and identities make omitted payloads inspectable on demand.
export function inspectTextFile(root, relative, { startLine, endLine } = {}) {
  if ((startLine !== undefined || endLine !== undefined) &&
      (!Number.isSafeInteger(startLine) || !Number.isSafeInteger(endLine) || startLine < 1 || endLine < startLine || endLine - startLine >= 200)) {
    throw new Error('Select an inclusive line range of at most 200 lines')
  }
  root = realpathSync(root)
  const path = resolve(root, relative)
  if (!path.startsWith(root + sep) || realpathSync(path) !== path || !lstatSync(path).isFile() || lstatSync(path).size > 8 * 1024 * 1024) throw new Error('Inspection requires a regular project text file of at most 8 MiB')
  const bytes = readFileSync(path)
  const source = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  let omitted = 0
  const text = source.replace(/data:[^\s"'<>)]*;base64,[A-Za-z0-9+/=\r\n]+/g, value => {
    omitted += value.length
    // Preserve source line numbers even for wrapped payloads.
    return `[inline payload omitted: ${value.length} characters]` + '\n'.repeat(value.split('\n').length - 1)
  })
  const lines = text.split('\n')
  const identity = { path: relative, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'), lines: lines.length, omittedCharacters: omitted }
  const clip = line => line.length > 1000 ? line.slice(0, 1000) + ' [long line omitted]' : line
  if (startLine !== undefined) {
    if (startLine > lines.length) throw new Error(`File has only ${lines.length} lines`)
    const selected = lines.slice(startLine - 1, endLine).map((line, index) => `${startLine + index}: ${clip(line)}`).join('\n')
    return JSON.stringify({ ...identity, view: 'lines', startLine, endLine: Math.min(endLine, lines.length) }) + '\n' +
      selected.slice(0, 20_000) + (selected.length > 20_000 ? '\n[range output clipped; select fewer lines]' : '')
  }
  if (/\.(?:md|markdown)$/i.test(relative)) {
    const headings = []
    let fence
    for (let index = 0; index < lines.length; index++) {
      const line = lines[index]
      const marker = line.match(/^\s{0,3}(`{3,}|~{3,})/)
      if (marker) {
        if (!fence) fence = marker[1]
        else if (marker[1][0] === fence[0] && marker[1].length >= fence.length && !line.slice(marker[0].length).trim()) fence = undefined
        continue
      }
      if (fence) continue
      const atx = line.match(/^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/)
      const setext = index > 0 && line.match(/^\s{0,3}(=+|-+)\s*$/) && lines[index - 1].trim()
      if (atx || setext) headings.push({ line: index + (atx ? 1 : 0), level: atx ? atx[1].length : line.trim()[0] === '=' ? 1 : 2, title: clip(atx ? atx[2] : lines[index - 1].trim()) })
    }
    const stack = []
    for (const heading of headings) {
      while (stack.length && stack.at(-1).level >= heading.level) stack.pop().end = heading.line - 1
      stack.push(heading)
    }
    for (const heading of stack) heading.end = lines.length
    let outline = ''
    for (const heading of headings) {
      outline += `${heading.line}-${heading.end}: ${'#'.repeat(heading.level)} ${heading.title}\n`
      if (outline.length > 6000) break
    }
    outline = outline.trimEnd()
    // Plain Markdown still gets a small useful preview, rather than an empty
    // outline or a full README dump. Line ranges retain exact source locations.
    const content = headings.length ? outline.slice(0, 6000) : lines.slice(0, 12).map((line, index) => `${index + 1}: ${clip(line)}`).join('\n').slice(0, 2000)
    return JSON.stringify({ ...identity, view: 'outline', headings: headings.length }) + '\n' + content +
      (outline.length > 6000 ? '\n[remaining headings omitted]' : '') + '\n[Read a relevant section with --lines START:END; at most 200 lines.]'
  }
  const bounded = lines.map(clip).join('\n')
  return JSON.stringify({ ...identity, view: 'text' }) + '\n' +
    bounded.slice(0, 20_000) + (bounded.length > 20_000 ? '\n[remaining text omitted; inspect the relevant section only]' : '')
}
