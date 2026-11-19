import { createHash } from 'node:crypto'
import { closeSync, constants, fstatSync, lstatSync, openSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const manifestURL = new URL('../fonts/manifest.json', import.meta.url)
// Noto Sans SC (OFL-1.1) is the current runtime CJK default and ships with its
// license. The ManusCC0 entries remain only so projects created from earlier
// template revisions keep restoring their pinned fonts offline.
const expectedRoles = new Map([
  ['NotoSansSC-VF.subset.woff2', 'font'],
  ['NotoSansSC-OFL.txt', 'license'],
  ['ManusCC0-Regular.ttf', 'font'],
  ['ManusCC0-Medium.ttf', 'font'],
  ['ManusCC0-Bold.ttf', 'font'],
  ['ManusCC0SansCJKSC-Regular.woff2', 'font'],
  ['ManusCC0-LICENSE.txt', 'license'],
])
const fontLicenses = new Set(['OFL-1.1', 'CC0-1.0'])
const digest = data => 'sha256:' + createHash('sha256').update(data).digest('hex')

// The optional directory is supplied only by the trusted package runtime (whose
// bundled entrypoint has a different import.meta.url) or an isolated test.
function bundleRoot({ bundleDirectory } = {}) {
  const directory = bundleDirectory === undefined ? dirname(fileURLToPath(manifestURL)) : resolve(bundleDirectory)
  const stat = lstatSync(directory)
  if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error('Bundled fonts directory must be a real directory')
  return directory
}

function readRegularFile(directory, name, maxBytes) {
  const file = join(directory, name)
  const stat = lstatSync(file)
  if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('Bundled font payload must be a regular file: ' + name)
  const descriptor = openSync(file, constants.O_RDONLY | constants.O_NOFOLLOW)
  try {
    const opened = fstatSync(descriptor)
    if (!opened.isFile() || opened.size <= 0 || opened.size > maxBytes) throw new Error('Invalid bundled font payload size: ' + name)
    const data = readFileSync(descriptor)
    if (data.length !== opened.size) throw new Error('Bundled font payload changed while reading: ' + name)
    return data
  } finally {
    closeSync(descriptor)
  }
}

function readManifest(directory) {
  const manifest = JSON.parse(readRegularFile(directory, 'manifest.json', 64 * 1024).toString('utf8'))
  if (manifest?.version !== 1 || !Array.isArray(manifest.files) || manifest.files.length !== expectedRoles.size) {
    throw new Error('Invalid bundled font manifest')
  }
  const names = new Set()
  const hashes = new Set()
  for (const entry of manifest.files) {
    if (!entry || !expectedRoles.has(entry.name) || names.has(entry.name) || expectedRoles.get(entry.name) !== entry.role
      || typeof entry.sha256 !== 'string' || !/^sha256:[a-f0-9]{64}$/.test(entry.sha256) || hashes.has(entry.sha256)
      || !Number.isSafeInteger(entry.size) || entry.size <= 0 || (entry.role !== 'font' && entry.size > 64 * 1024)
      || (entry.role === 'font' && (typeof entry.family !== 'string' || !entry.family || !fontLicenses.has(entry.license)
        || expectedRoles.get(entry.licenseFile) !== 'license'))) {
      throw new Error('Invalid bundled font manifest entry')
    }
    names.add(entry.name)
    hashes.add(entry.sha256)
  }
  if (manifest.files.some(entry => entry.role === 'font' && !names.has(entry.licenseFile))) throw new Error('Invalid bundled font manifest entry')
  return manifest.files
}

function verifiedData(directory, entry) {
  const data = readRegularFile(directory, entry.name, entry.size)
  if (data.length !== entry.size || digest(data) !== entry.sha256) throw new Error('Bundled font integrity check failed: ' + entry.name)
  return data
}

// License texts accompany their fonts when copied into editable projects.
export function bundledFontFiles(options) {
  const directory = bundleRoot(options)
  return readManifest(directory).map(entry => ({ ...entry, data: verifiedData(directory, entry) }))
}

// Project entries contribute only an expected hash and size, never a local path.
// Unrecognized historical fonts retain the existing managed-asset restore path.
export function bundledFontData(entry, options) {
  const directory = bundleRoot(options)
  const match = readManifest(directory).find(file => file.role === 'font' && file.sha256 === entry?.sha256)
  if (!match) return null
  // Legacy flat locks omitted size (normalized to zero); the approved hash still pins every byte.
  if (entry.size !== undefined && entry.size !== 0 && entry.size !== match.size) throw new Error('Bundled font size does not match its approved pin: ' + match.name)
  return verifiedData(directory, match)
}
