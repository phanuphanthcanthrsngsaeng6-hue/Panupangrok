import { randomUUID } from 'node:crypto'
import { lstatSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

// Persist the editor-only policy before capturing inputs, including existing
// projects. Imports performed implicitly by either export profile then use the
// same setting, without temporary overrides or unrecorded compiler mutations.
export function ensureSerialImports(root) {
  const file = join(root, 'project.godot')
  const stat = lstatSync(file)
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 2 * 1024 * 1024) throw new Error('Invalid Game project settings')
  const source = readFileSync(file, 'utf8')
  // Ignore quoted (possibly multiline) values and comments when locating INI
  // sections/settings. Offsets stay identical so unrelated bytes are preserved.
  const masked = source.replace(/"(?:\\[\s\S]|[^"\\])*"|;[^\r\n]*/g, match => ' '.repeat(match.length))
  const edits = []
  let editorEnd = null
  let found = false
  const sections = [...masked.matchAll(/^\s*\[([^\]\r\n]+)\][ \t]*\r?$/gm)]
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    if (section[1] !== 'editor') continue
    const start = section.index + section[0].length
    const end = sections[i + 1]?.index ?? source.length
    editorEnd = end
    for (const setting of masked.slice(start, end).matchAll(/^[ \t]*import\/use_multiple_threads(?:\.[\w.]+)?[ \t]*=[ \t]*(true|false)[ \t]*\r?$/gm)) {
      const offset = start + setting.index + setting[0].indexOf('=') + 1
      const valueStart = offset + masked.slice(offset).search(/\S/)
      edits.push({ start: valueStart, end: valueStart + setting[1].length, text: 'false' })
      if (!setting[0].includes('threads.')) found = true
    }
  }
  const newline = source.includes('\r\n') ? '\r\n' : '\n'
  if (!found) {
    const offset = editorEnd ?? source.length
    edits.push({ start: offset, end: offset, text: `${newline}${editorEnd === null ? `[editor]${newline}` : ''}import/use_multiple_threads=false${newline}` })
  }
  let updated = source
  for (const edit of edits.sort((a, b) => b.start - a.start)) updated = updated.slice(0, edit.start) + edit.text + updated.slice(edit.end)
  if (updated === source) return false
  const temporary = `${file}.${randomUUID()}.tmp`
  try {
    writeFileSync(temporary, updated, { flag: 'wx', mode: stat.mode & 0o777 })
    const current = lstatSync(file)
    if (current.isSymbolicLink() || current.ino !== stat.ino || readFileSync(file, 'utf8') !== source) throw new Error('Game project settings changed while preparing import')
    renameSync(temporary, file)
  } finally { rmSync(temporary, { force: true }) }
  return true
}
