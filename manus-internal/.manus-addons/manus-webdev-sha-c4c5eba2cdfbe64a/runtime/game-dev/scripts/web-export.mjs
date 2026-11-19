import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { chmodSync, constants, copyFileSync, lstatSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { MAX_ASSET_SIZE_BYTES, assetTypeOf, readAssetsLock } from './local-artifacts.mjs'

const CONFIG = 'web/export.json'
const MAX_SHELL_BYTES = 32 * 1024 * 1024
const hash = bytes => 'sha256:' + createHash('sha256').update(bytes).digest('hex')
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value)
const safeRelative = value => typeof value === 'string' && value.length <= 2048 &&
  !/[\\:\x00-\x1f\x7f]/.test(value) && value.split('/').every(part => part && part !== '.' && part !== '..')
const sourcePath = value => safeRelative(value) && !['.git', '.godot', 'node_modules', 'dist', 'site'].includes(value.split('/')[0])
const invalid = message => new Error('Game Web export ' + message)

// Inspect every ancestor, including dangling links. All writes below belong to
// the caller's disposable snapshot; never resolve a project link for the builder.
function regularFile(root, rel, { optional = false, maxBytes = MAX_SHELL_BYTES } = {}) {
  if (!safeRelative(rel)) throw invalid('path is invalid')
  const parts = rel.split('/')
  let target = root
  for (let index = 0; index < parts.length; index++) {
    target = join(target, parts[index])
    let stat
    try { stat = lstatSync(target) } catch (error) {
      if (optional && error.code === 'ENOENT') return null
      throw invalid('file is missing: ' + rel)
    }
    if (stat.isSymbolicLink() || (index < parts.length - 1 ? !stat.isDirectory() : !stat.isFile())) {
      throw invalid('path must contain only regular files and directories: ' + rel)
    }
    if (index === parts.length - 1) {
      if (stat.size > maxBytes) throw invalid('file exceeds its size limit: ' + rel)
      return { path: target, stat }
    }
  }
}

function customShell(root) {
  const file = regularFile(root, 'export_presets.cfg')
  const sections = new Map()
  let section
  for (const line of readFileSync(file.path, 'utf8').split(/\r?\n/)) {
    const header = line.match(/^\s*\[([^\]]+)\]\s*(?:;.*)?$/)
    if (header) {
      if (sections.has(header[1])) throw invalid('preset section is duplicated')
      sections.set(header[1], section = new Map())
    } else if (section) {
      const entry = line.match(/^\s*([^=;]+?)\s*=\s*(.*?)\s*$/)
      if (entry) {
        if (section.has(entry[1])) throw invalid('preset key is duplicated')
        section.set(entry[1], entry[2])
      }
    }
  }
  const web = [...sections].filter(([name, values]) => /^preset\.\d+$/.test(name) && values.get('name') === '"Web"')
  if (web.length !== 1 || web[0][1].get('platform') !== '"Web"') throw invalid('requires one Web platform preset')
  let value
  try { value = JSON.parse(sections.get(web[0][0] + '.options')?.get('html/custom_html_shell') ?? 'null') } catch {}
  if (typeof value !== 'string') throw invalid('custom HTML shell is invalid')
  return value.replace(/^res:\/\//, '')
}

export function readWebExportConfiguration(root) {
  const file = regularFile(root, CONFIG, { optional: true, maxBytes: 64 * 1024 })
  if (!file) return null
  let value
  try { value = JSON.parse(readFileSync(file.path, 'utf8')) } catch { throw invalid('manifest is invalid') }
  if (!record(value) || value.version !== 1 || Object.keys(value).some(key => !['version', 'assets', 'shell'].includes(key)) ||
      !record(value.assets) || Object.keys(value.assets).length > 64) throw invalid('manifest is invalid')
  const destinations = new Set()
  for (const [destination, source] of Object.entries(value.assets)) {
    // Auxiliary assets sit beside index.html. Existing exporter files are also
    // protected at copy time, including names added by custom engine templates.
    const folded = destination.toLowerCase()
    if (!safeRelative(destination) || destination.includes('/') || destination.startsWith('.') || /^index(?:\.|$)/i.test(destination) ||
        destinations.has(folded) || !sourcePath(source) || !source.startsWith('assets/')) throw invalid('asset path is invalid')
    destinations.add(folded)
  }
  if (value.shell !== undefined) {
    const shell = value.shell
    if (!record(shell) || Object.keys(shell).some(key => !['builder', 'output'].includes(key)) ||
        !sourcePath(shell.builder) || !shell.builder.endsWith('.mjs') || !sourcePath(shell.output) ||
        !shell.output.startsWith('web/') || !shell.output.endsWith('.html')) throw invalid('shell definition is invalid')
    regularFile(root, shell.builder)
    if (customShell(root) !== shell.output) throw invalid('generated shell must match the Web preset custom HTML shell')
  }
  return value
}

function verifiedAsset(root, source, entry) {
  if (!record(entry) || !Number.isSafeInteger(entry.size) || entry.size <= 0 ||
      (assetTypeOf(source) !== 'font' && entry.size > MAX_ASSET_SIZE_BYTES) ||
      !/^sha256:[a-f0-9]{64}$/.test(entry.sha256)) throw invalid('asset requires a locked size and hash: ' + source)
  const file = regularFile(root, source, { maxBytes: entry.size })
  if (file.stat.size !== entry.size || hash(readFileSync(file.path)) !== entry.sha256) throw invalid('asset does not match its locked size and hash: ' + source)
  return file.path
}

function stageAssets(root, output, assets, lock) {
  const destinationRoot = resolve(output)
  const rel = relative(root, destinationRoot)
  if (!safeRelative(rel) || realpathSync(destinationRoot) !== destinationRoot) throw invalid('output directory is invalid')
  for (const [destination, source] of Object.entries(assets)) {
    const from = verifiedAsset(root, source, lock[source])
    const target = join(destinationRoot, destination)
    try { copyFileSync(from, target, constants.COPYFILE_EXCL) } catch (error) {
      if (error.code === 'EEXIST') throw invalid('asset would overwrite an exporter artifact: ' + destination)
      throw error
    }
    const copied = regularFile(root, `${rel}/${destination}`, { maxBytes: lock[source].size })
    if (copied.stat.size !== lock[source].size || hash(readFileSync(target)) !== lock[source].sha256) {
      throw invalid('staged asset failed its integrity check: ' + destination)
    }
  }
}

function restoreShell(root, output, original) {
  const target = join(root, output)
  // Unlink a replaced leaf instead of following it during restoration. A changed
  // parent cannot safely be restored; refuse to write outside the captured tree.
  if (realpathSync(dirname(target)) !== dirname(target)) throw invalid('shell directory changed during export')
  rmSync(target, { force: true })
  if (original) {
    writeFileSync(target, original.bytes, { flag: 'wx', mode: original.mode })
    chmodSync(target, original.mode)
  }
}

/** Only call inside the captured export snapshot, never in the editable project.
 * Source identity already includes this manifest, builder and its source inputs. */
export function withWebExport(root, output, exportGame) {
  root = realpathSync(root)
  const config = readWebExportConfiguration(root)
  if (!config) return exportGame()
  const lockFile = regularFile(root, 'assets.lock.json')
  const lock = readAssetsLock(dirname(lockFile.path))
  for (const source of Object.values(config.assets)) verifiedAsset(root, source, lock[source])
  const run = () => {
    const result = exportGame()
    stageAssets(root, output, config.assets, lock)
    return result
  }
  if (!config.shell) return run()
  const { builder, output: shellOutput } = config.shell
  const previous = regularFile(root, shellOutput, { optional: true })
  const original = previous ? { bytes: readFileSync(previous.path), mode: previous.stat.mode & 0o777 } : null
  const target = join(root, shellOutput)
  // The shell directory is authored source; a builder cannot create arbitrary
  // parent directories through its output setting.
  if (realpathSync(dirname(target)) !== dirname(target)) throw invalid('shell directory is invalid')
  const temporary = mkdtempSync(join(dirname(target), '.web-shell-'))
  try {
    const generated = join(temporary, 'shell.html')
    const result = spawnSync(process.execPath, [join(root, builder), '--output', generated], {
      cwd: root, encoding: 'utf8', timeout: 30_000, killSignal: 'SIGKILL', maxBuffer: 64 * 1024,
    })
    if (result.error || result.status !== 0) throw invalid('shell builder ' + (result.error?.code === 'ETIMEDOUT' ? 'timed out' : 'failed'))
    const rendered = regularFile(root, relative(root, generated))
    if (!rendered.stat.size) throw invalid('shell builder produced an empty shell')
    const bytes = readFileSync(rendered.path)
    restoreShell(root, shellOutput, { bytes, mode: original?.mode ?? 0o644 })
    rmSync(temporary, { recursive: true, force: true })
    return run()
  } finally {
    try { restoreShell(root, shellOutput, original) }
    finally { rmSync(temporary, { recursive: true, force: true }) }
  }
}
