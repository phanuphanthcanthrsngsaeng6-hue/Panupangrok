import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { closeSync, constants, fstatSync, lstatSync, openSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { glyphPackLicenses, usesGlyphPack } from './glyph-pack.mjs'

// JSON is part of the exporter's static dependency graph, so notice upgrades
// invalidate cached exports and old published builds keep their original bytes.
const notices = JSON.parse(readFileSync(new URL('../runtime-notices.json', import.meta.url), 'utf8'))
const distribution = JSON.parse(readFileSync(new URL('../godot-distribution.json', import.meta.url), 'utf8'))
const digest = bytes => createHash('sha256').update(bytes).digest('hex')
const escapeHtml = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')

const FONT = /\.(?:ttf|otf|woff2?|ttc|otc|fnt)$/i
const LICENSE = /(?:^|[-_.])(?:OFL|CC0|LICEN[CS]E|COPYING|NOTICE)(?:[-_.][^/]*)?\.(?:txt|md)$/i
const MAX_LICENSE_BYTES = 256 * 1024
const MAX_LICENSES = 128

function readRegular(file, maximum) {
  const descriptor = openSync(file, constants.O_RDONLY | constants.O_NOFOLLOW)
  try {
    const size = fstatSync(descriptor).size
    return size > maximum ? null : readFileSync(descriptor)
  } finally { closeSync(descriptor) }
}

// Font licenses (e.g. SIL OFL 1.1) must accompany redistributed font bytes. Collect
// every license text stored beside a font under assets/, in path order. Links,
// hidden and engine-cache directories are ignored; project content only becomes
// escaped text inside the reserved notice outputs, never an output file itself.
export function projectFontLicenses(root) {
  if (!root) return []
  const found = []
  const visit = relative => {
    let entries
    try { entries = readdirSync(join(root, relative), { withFileTypes: true }) } catch (error) {
      if (error.code === 'ENOENT' && relative === 'assets') return
      throw error
    }
    const names = entries.map(entry => entry.name).sort()
    const byName = new Map(entries.map(entry => [entry.name, entry]))
    const fonts = names.filter(name => byName.get(name).isFile() && FONT.test(name))
    if (fonts.length) for (const name of names.filter(name => byName.get(name).isFile() && LICENSE.test(name))) {
      found.push({ path: `${relative}/${name}`, fonts })
    }
    for (const name of names) if (byName.get(name).isDirectory() && !name.startsWith('.')) visit(`${relative}/${name}`)
  }
  if (!lstatSync(root).isDirectory()) throw new Error('Game project root must be a directory')
  try { if (lstatSync(join(root, 'assets')).isDirectory()) visit('assets') } catch (error) { if (error.code !== 'ENOENT') throw error }
  if (found.length > MAX_LICENSES) throw new Error(`Too many bundled font license files (${found.length}); keep one license per font family`)
  return found.map(license => {
    const bytes = readRegular(join(root, license.path), MAX_LICENSE_BYTES)
    return bytes === null ? { ...license, sha256: null, text: null }
      : { ...license, sha256: digest(bytes), text: bytes.toString('utf8').replaceAll('\r\n', '\n') }
  })
}

export function runtimeNoticeText(output, engineVersion, projectRoot) {
  if (notices.godotRelease !== distribution.tag_name ||
      !(engineVersion === notices.engineVersion || engineVersion.startsWith(notices.engineVersion + '.') || engineVersion.startsWith(notices.engineVersion + '-'))) throw new Error('Game runtime notices do not match the selected Godot version')
  for (const source of notices.sources) {
    if (!source.text.trim() || digest(source.text) !== source.sha256) throw new Error('Game runtime notice source integrity failed')
  }
  const artifacts = ['index.js', 'index.wasm'].map(name => `${name}: sha256:${digest(readFileSync(join(output, name)))}`)
  return [
    'THIRD-PARTY NOTICES / 开源软件声明', '',
    'This experience includes third-party open source software.',
    '本体验包含第三方开源软件。', '',
    'Applies to: Manus Game Dev Web Runtime',
    `Godot Engine version: ${engineVersion}`,
    `Notice version / last updated: ${notices.revision} / ${notices.updated}`,
    'Runtime build artifacts:', ...artifacts, '',
    'These notices cover the platform-provided Godot Web runtime and its bundled libraries.',
    'The complete upstream Godot copyright inventory is retained, including entries for',
    'other platforms and editor-only components which may not be present in this Web build.',
    'Library source revisions are those vendored in the linked Godot source commit.',
    'Emscripten runtime notices include the associated C/C++ runtime notices.',
    'Additional user-provided code, assets and custom engine components require their own notices.', '',
    ...notices.sources.flatMap(source => [
      '----------------------------------------------------------------', source.name,
      `Notice source: ${source.url}`, `Source SHA-256: ${source.sha256}`, '', source.text.trimEnd(), '',
    ]),
    ...fontLicenseSection(usesGlyphPack(projectRoot) ? glyphPackLicenses() : [], 'WEB GLYPH PACK / 网页字形包',
      'Runtime fonts that the game may download for characters its own fonts lack.',
      '游戏可按需下载的运行时字体，用于显示自带字体缺少的字符。'),
    ...fontLicenseSection(projectFontLicenses(projectRoot), 'FONT LICENSES / 字体许可',
      'The fonts bundled with this game are distributed under the licenses below.',
      '本游戏随附的字体依据以下许可分发。'),
  ].join('\n')
}

function fontLicenseSection(licenses, title, description, translation) {
  if (!licenses.length) return []
  return [
    '================================================================',
    title, '', description, translation, '',
    ...licenses.flatMap(license => [
      '----------------------------------------------------------------', license.path,
      `Fonts: ${license.fonts.join(', ')}`,
      ...(license.text === null ? ['License text exceeds 256 KiB; it is distributed with the game source at this path.', '']
        : [`License SHA-256: ${license.sha256}`, '', license.text.trimEnd(), '']),
    ]),
  ]
}

export function stageRuntimeNotices(output, engineVersion, projectRoot) {
  const text = runtimeNoticeText(output, engineVersion, projectRoot)
  const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Open Source Licenses</title><style>body{max-width:80ch;margin:2rem auto;padding:0 1rem;font:14px/1.6 system-ui,sans-serif}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit}</style></head><body><h1>Open Source Licenses</h1><p><a href="THIRD_PARTY_NOTICES.txt" download>Download THIRD_PARTY_NOTICES.txt</a></p><pre>${escapeHtml(text)}</pre></body></html>\n`
  // These reserved output names cannot be silently supplied by project assets.
  writeFileSync(join(output, 'THIRD_PARTY_NOTICES.txt'), text, { flag: 'wx' })
  writeFileSync(join(output, 'open-source-licenses.html'), page, { flag: 'wx' })
}

export function stageEngineRuntimeNotices(output, engine, projectRoot) {
  const result = spawnSync(engine, ['--version'], { encoding: 'utf8', timeout: 10_000 })
  if (result.error || result.status !== 0) throw new Error('Cannot identify Godot for runtime notices')
  stageRuntimeNotices(output, result.stdout.trim(), projectRoot)
}
