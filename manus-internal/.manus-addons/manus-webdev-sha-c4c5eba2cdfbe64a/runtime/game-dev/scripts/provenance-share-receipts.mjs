// Read-only projection of successful local sharing compositions into provenance events.
import { createHash } from 'node:crypto'
import { existsSync, lstatSync, readFileSync, readdirSync, realpathSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { bundledFontFiles } from './bundled-fonts.mjs'

const SHA = /^sha256:[a-f0-9]{64}$/
const MAX_RECEIPT = 128 * 1024
const MAX_IMAGE = 8 * 1024 * 1024
const MAX_ENTRIES = 20_000
const LICENSE_URLS = { 'CC0-1.0': 'https://creativecommons.org/publicdomain/zero/1.0/', 'OFL-1.1': 'https://openfontlicense.org/open-font-license-official-text/' }
// Bundled font identities carry their own verified license from the manifest.
export const bundledFontLicense = file => ({ id: file.license, url: LICENSE_URLS[file.license] })
const SKIP = new Set(['.git', '.godot', '.manus-game-tools', '.manus-asset-history', 'node_modules', 'dist', 'site', 'test', 'tests', 'tools', 'docs', 'captures', 'test-output'])
const OUTPUTS = new Map([['og.png', [1200, 630]], ['favicon.png', [512, 512]], ['favicon-32.png', [32, 32]]])
const digest = bytes => 'sha256:' + createHash('sha256').update(bytes).digest('hex')
const safeRelative = value => typeof value === 'string' && value.length <= 2048 && !/[\\\x00-\x1f\x7f]/.test(value) &&
  value.split('/').every(part => part && part !== '.' && part !== '..')
const activePath = value => safeRelative(value) && !value.split('/').some(part => part.startsWith('.') || SKIP.has(part))
const boundedText = (value, maximum) => typeof value === 'string' && value.length > 0 && value.length <= maximum && !/[\x00-\x1f\x7f]/.test(value)

function projectFile(root, path, missing = false) {
  if (!safeRelative(path)) throw new Error('Invalid sharing receipt path')
  let file = root
  const parts = path.split('/')
  for (let index = 0; index < parts.length; index++) {
    file = join(file, parts[index])
    try {
      const stat = lstatSync(file)
      if (stat.isSymbolicLink() || (index < parts.length - 1 && !stat.isDirectory())) throw new Error('Invalid sharing receipt path')
    } catch (error) { if (!missing || error.code !== 'ENOENT') throw error }
  }
  return file
}

function readBounded(root, path, maximum) {
  const file = projectFile(root, path), stat = lstatSync(file)
  if (!stat.isFile() || stat.size < 1 || stat.size > maximum) throw new Error('Invalid sharing receipt file')
  const bytes = readFileSync(file)
  if (bytes.length !== stat.size) throw new Error('Sharing receipt file changed while reading')
  return bytes
}

export function provenanceFontFiles(root, { runtimeDirectory } = {}) {
  const loaders = runtimeDirectory === undefined ? [] : [() => {
    const installed = resolve(runtimeDirectory)
    if (realpathSync(installed) !== installed || !lstatSync(installed).isDirectory()) throw new Error('Invalid installed runtime directory')
    return bundledFontFiles({ bundleDirectory: projectFile(installed, 'fonts') })
  }]
  // The trusted installed runtime is explicit when MCP bundling relocates this
  // module. Legacy portable projects and direct runtime scripts still work.
  loaders.push(() => bundledFontFiles({ bundleDirectory: projectFile(root, '.manus-game-tools/fonts') }), () => bundledFontFiles())
  for (const loadFonts of loaders) try {
    const files = loadFonts()
    if (files.some(file => file.role === 'font') && files.every(file => file.role !== 'font' || files.some(license => license.name === file.licenseFile))) return files
  } catch { /* An unavailable or linked candidate does not establish font identity. */ }
  return []
}

function fontIdentities(root, options) {
  return new Map(provenanceFontFiles(root, options).filter(file => file.role === 'font').map(file => [file.sha256, {
      source: { name: file.name.startsWith('ManusCC0-') ? file.name.replace(/\.ttf$/, '').replace('-', ' ') : file.family },
      license: bundledFontLicense(file),
  }]))
}

function imageInput(root, value, role) {
  if (!value || !SHA.test(value.digest ?? '') || !safeRelative(value.path)) throw new Error('Invalid sharing input identity')
  // The receipt's hash identifies the bytes used then, even after source housekeeping.
  projectFile(root, value.path, true)
  return { ...(activePath(value.path) ? { path: value.path } : { source: { name: `${role}: ${basename(value.path)}` } }), sha256: value.digest }
}

function fontInput(root, value, identities) {
  if (!value || !SHA.test(value.digest ?? '')) throw new Error('Invalid sharing font identity')
  if (value.path !== undefined) projectFile(root, value.path, true)
  const identity = identities.get(value.digest)
  return { ...(activePath(value.path) ? { path: value.path } : {}), sha256: value.digest,
    ...(identity ?? { source: { name: 'Unattributed title font' } }) }
}

function receiptEvents(root, path, identities) {
  const bytes = readBounded(root, path, MAX_RECEIPT), receipt = JSON.parse(bytes.toString('utf8'))
  if (receipt.schemaVersion !== 1 || receipt.renderer !== 'catalog-procedural' || receipt.source !== 'upload' ||
      !boundedText(receipt.title, 120) || receipt.title !== receipt.title.trim() || receipt.ogImageTitle !== receipt.title ||
      !/^#[0-9a-fA-F]{6}$/.test(receipt.accent ?? '') || typeof receipt.pixelArt !== 'boolean' ||
      !/^[0-9A-Za-z.+_-]{1,64}$/.test(receipt.pillowVersion ?? '') || !Array.isArray(receipt.outputs) || receipt.outputs.length > 3 ||
      !Array.isArray(receipt.fonts) || receipt.fonts.length < 1 || receipt.fonts.length > 8) return []
  const cover = imageInput(root, receipt.inputs?.cover, 'Cover image')
  const icon = imageInput(root, receipt.inputs?.icon, 'Icon image')
  const fonts = receipt.fonts.map(value => fontInput(root, value, identities))
  const receiptIdentity = { path, sha256: digest(bytes) }, events = [], seen = new Set()
  for (const output of receipt.outputs) {
    try {
      const name = basename(output.path ?? ''), dimensions = OUTPUTS.get(name)
      if (!activePath(output.path) || dirname(output.path) !== dirname(path) || !dimensions || seen.has(output.path) ||
          !SHA.test(output.digest ?? '') || output.width !== dimensions[0] || output.height !== dimensions[1] ||
          !Number.isSafeInteger(output.sizeBytes) || output.sizeBytes < 33 || output.sizeBytes > MAX_IMAGE) continue
      const image = readBounded(root, output.path, MAX_IMAGE)
      if (image.length !== output.sizeBytes || digest(image) !== output.digest ||
          !image.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) ||
          image.readUInt32BE(8) !== 13 || image.toString('ascii', 12, 16) !== 'IHDR' ||
          image.readUInt32BE(16) !== output.width || image.readUInt32BE(20) !== output.height) continue
      seen.add(output.path)
      const isCover = name === 'og.png'
      const recipe = { renderer: receipt.renderer, pillowVersion: receipt.pillowVersion, output: name,
        resolution: dimensions, filter: receipt.pixelArt ? 'nearest' : 'lanczos', background: '#0c161d',
        ...(isCover ? { title: receipt.title, accent: receipt.accent, coverArea: [1072, 502], titleBounds: [1072, 240] } : { iconArea: [416, 416], compositionSize: [512, 512] }) }
      events.push({ kind: 'asset', path: output.path, sha256: output.digest, origin: 'derivative',
        receipt: receiptIdentity, inputs: isCover ? [cover, ...fonts] : [icon],
        transformations: [{ operation: isCover ? 'share-cover-compose' : name === 'favicon.png' ? 'share-icon-compose' : 'share-icon-compose-and-resize',
          tool: 'render-share-images.py', description: JSON.stringify(recipe) }] })
    } catch { /* A changed or removed output is not evidence for current bytes. */ }
  }
  return events
}

export function shareReceiptEvents(projectRoot, options = {}) {
  try {
    const supplied = resolve(projectRoot)
    if (!lstatSync(supplied).isDirectory() || lstatSync(supplied).isSymbolicLink()) return []
    const root = realpathSync(supplied)
    if (!existsSync(projectFile(root, 'project.godot')) || !lstatSync(projectFile(root, 'project.godot')).isFile()) return []
    const identities = fontIdentities(root, options), events = []
    let visited = 0
    const walk = directory => {
      for (const entry of readdirSync(directory ? projectFile(root, directory) : root, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
        if (++visited > MAX_ENTRIES) throw new Error('Too many sharing receipt candidates')
        const path = directory ? `${directory}/${entry.name}` : entry.name
        if (entry.isDirectory() && !entry.name.startsWith('.') && !SKIP.has(entry.name)) walk(path)
        else if (entry.isFile() && entry.name === 'render-receipt.json') {
          try { events.push(...receiptEvents(root, path, identities)) } catch { /* Optional receipts never block game work. */ }
        }
      }
    }
    walk('')
    return events
  } catch { return [] }
}
