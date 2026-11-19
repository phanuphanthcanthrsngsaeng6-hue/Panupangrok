import { spawnSync } from 'node:child_process'
import { constants, accessSync, closeSync, copyFileSync, existsSync, mkdirSync, openSync, readFileSync, realpathSync, renameSync, rmSync, statSync } from 'node:fs'
import { extname, isAbsolute, join, relative, resolve } from 'node:path'
import { homedir } from 'node:os'
import { MACOS_GODOT_LOCATIONS, addonToolsDirectory, legacyManagedGodotExecutable, managedExportTemplatesDirectory, managedGodotExecutable } from './managed-godot.mjs'

export function gameExportTemplatesDirectory(env = process.env, platform = process.platform) {
  const home = env.HOME || env.USERPROFILE || homedir()
  const data = platform === 'darwin'
    ? join(home, 'Library', 'Application Support')
    : platform === 'win32' ? env.APPDATA || join(home, 'AppData', 'Roaming')
      : env.XDG_DATA_HOME || join(home, '.local', 'share')
  // Godot capitalizes its application data folder on macOS and Windows.
  return join(data, platform === 'darwin' || platform === 'win32' ? 'Godot' : 'godot', 'export_templates', '4.7.2.stable')
}

// Godot reads templates only from the running account, which in Windows safe
// mode is a separate account. Copy a missing default template from the host's
// copy in the Addon tools directory. Returns that copy when it cannot be read.
function copyToolsExportTemplate(name, templatesDirectory, env) {
  const tools = managedExportTemplatesDirectory(env)
  if (!tools) return
  const source = join(tools, name)
  const target = join(templatesDirectory, name)
  const temporary = `${target}.${process.pid}.tmp`
  try {
    if (!statSync(source).isFile() || statSync(source).size === 0) return
    mkdirSync(templatesDirectory, { recursive: true })
    copyFileSync(source, temporary)
    renameSync(temporary, target)
  } catch {
    // A concurrent copy may already have installed it; the caller re-checks.
    rmSync(temporary, { force: true })
    try { closeSync(openSync(source, 'r')) } catch (error) {
      if (['EACCES', 'EPERM'].includes(error.code)) return source
    }
  }
}

function failure(code, message, details = {}) {
  return Object.assign(new Error(message), { code, ...details })
}

export function buildExportTemplatesDirectory(version, env = process.env, platform = process.platform) {
  if (!/^4\.7\.2\.stable(?:[.-]|$)/.test(version)) throw failure('godot_version_unsupported', 'Game release requires the supported Godot 4.7.2 stable engine and matching Web templates', { version })
  return gameExportTemplatesDirectory(env, platform)
}

export function resolveBuildExecutable(root, command, env = process.env, platform = process.platform, macosLocations = MACOS_GODOT_LOCATIONS, arch = process.arch) {
  const defaultSelection = command === undefined && !env.GODOT_BIN
  command ??= env.GODOT_BIN || 'godot'
  const paths = isAbsolute(command) ? [command] : command.includes('/') || command.includes('\\') ? [resolve(root, command)]
    : (env.PATH || '').split(platform === 'win32' ? ';' : ':').map(path => resolve(root, path, command))
  const candidates = platform === 'win32' && !extname(command)
    ? paths.flatMap(path => [path, path + '.exe', path + '.EXE']) : paths
  if (defaultSelection && platform === 'darwin') candidates.push(...macosLocations)
  if (defaultSelection && (platform === 'darwin' || ['win32', 'linux'].includes(platform) && ['x64', 'arm64'].includes(arch))) {
    // The Host and PATH Node may use different architectures on Windows ARM64.
    const architectures = platform === 'win32' ? [arch, arch === 'arm64' ? 'x64' : 'arm64'] : [arch]
    candidates.push(...architectures.map(candidate => managedGodotExecutable(env, platform, candidate)))
    // Engines installed before the Addon tools directory remain usable by the
    // accounts that can read them; preparation adds a tools copy for the others.
    if (addonToolsDirectory(env)) candidates.push(...architectures.map(candidate => legacyManagedGodotExecutable(env, platform, candidate)))
  }
  const executable = candidates.find(path => {
    try { accessSync(path, platform === 'win32' ? constants.F_OK : constants.X_OK); return statSync(path).isFile() } catch { return false }
  })
  if (!executable) throw failure('godot_unavailable', 'Game release engine is unavailable')
  return realpathSync(executable)
}

// Doctor and both exporters use this exact resolution. Injection is only for
// offline component tests; the production probe always runs the selected binary.
export function inspectGameToolchain(root, { env = process.env, platform = process.platform, executable, probe = spawnSync, macosLocations, arch = process.arch } = {}) {
  const engine = resolveBuildExecutable(root, executable, env, platform, macosLocations, arch)
  const result = probe(engine, ['--version'], { cwd: root, env, encoding: 'utf8', timeout: 10_000 })
  if (result.error || result.status !== 0) throw failure('godot_unavailable', 'Game release engine is unavailable')
  const version = result.stdout.trim()
  const templatesDirectory = buildExportTemplatesDirectory(version, env, platform)
  const preset = join(root, 'export_presets.cfg')
  const source = existsSync(preset) ? readFileSync(preset, 'utf8') : ''
  const sections = new Map()
  let section
  for (const line of source.split(/\r?\n/)) {
    const header = line.match(/^\s*\[([^\]]+)\]\s*(?:;.*)?$/)
    if (header) {
      section = header[1]
      if (sections.has(section)) throw failure('web_export_templates_unavailable', 'Duplicate export preset section')
      sections.set(section, {})
    } else if (section) {
      const entry = line.match(/^\s*([^=;]+?)\s*=\s*(.*?)\s*$/)
      if (entry) sections.get(section)[entry[1]] = entry[2]
    }
  }
  const web = [...sections].filter(([name, values]) => /^preset\.\d+$/.test(name) && values.name === '"Web"')
  if (source && (web.length !== 1 || web[0][1].platform !== '"Web"')) {
    throw failure('web_export_templates_unavailable', 'The Web export preset must select the Web platform')
  }
  const options = web.length ? sections.get(web[0][0] + '.options') ?? {} : {}
  const threaded = options['variant/thread_support'] === 'true'
  const templateFiles = {}
  const missing = []
  const unreadableToolTemplates = []
  for (const profile of ['debug', 'release']) {
    const encoded = options['custom_template/' + profile] ?? '""'
    let custom
    try { custom = JSON.parse(encoded) } catch { throw failure('web_export_templates_unavailable', 'Invalid custom Web export template path') }
    if (typeof custom !== 'string') throw failure('web_export_templates_unavailable', 'Invalid custom Web export template path')
    let file
    const name = `web_${threaded ? '' : 'nothreads_'}${profile}.zip`
    if (custom) {
      const relative = custom.replace(/^res:\/\//, '')
      if (isAbsolute(relative) || relative.split(/[\\/]/).includes('..')) throw failure('web_export_templates_unavailable', 'Game release custom export templates must be inside the project snapshot')
      file = join(root, relative)
    } else file = join(templatesDirectory, name)
    if (!custom && !existsSync(file)) {
      const unreadable = copyToolsExportTemplate(name, templatesDirectory, env)
      if (unreadable) unreadableToolTemplates.push(unreadable)
    }
    try {
      if (!statSync(file).isFile() || statSync(file).size === 0) throw new Error('missing')
      const selected = realpathSync(file)
      const boundary = relative(realpathSync(root), selected)
      if (custom && (selected !== resolve(realpathSync(root), relative(root, file)) || boundary === '..' || boundary.startsWith('../') || boundary.startsWith('..\\') || isAbsolute(boundary))) throw new Error('outside project')
      templateFiles[profile] = selected
    } catch { missing.push(name) }
  }
  if (missing.length) {
    const details = { version, missing, canInstallDefaultTemplates: !['debug', 'release'].some(profile => (options['custom_template/' + profile] ?? '""') !== '""') }
    if (unreadableToolTemplates.length) {
      throw failure('web_export_templates_unavailable', 'Godot 4.7.2 stable Web export templates are in the Manus Addon tools directory, but this account is denied reading them.', { ...details, unreadableToolTemplates })
    }
    throw failure('web_export_templates_unavailable', 'Install matching Godot 4.7.2 stable Web export templates, then retry.', details)
  }
  return { executable: engine, version, templatesDirectory, templateFiles }
}
