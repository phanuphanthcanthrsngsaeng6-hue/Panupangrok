import { realpathSync } from 'node:fs'
import { homedir } from 'node:os'
import { isAbsolute, join, relative } from 'node:path'

export const GODOT_VERSION = '4.7.2.stable'
export const MACOS_GODOT_LOCATIONS = ['/Applications/Godot.app/Contents/MacOS/Godot', '/opt/homebrew/bin/godot', '/usr/local/bin/godot']
// Mirrors WEBDEV_ADDON_ID in shared/webdev-contract.ts; package scripts run
// without the TypeScript sources.
export const WEBDEV_ADDON_ID = 'manus-webdev'

// The Operator gives host-side Addon processes their own tools directory and
// agent terminals the shared root. Both name the same host-written directory,
// which Windows safe mode can read but not write.
export function addonToolsDirectory(env = process.env) {
  const directory = env.MANUS_ADDON_TOOLS_DIRECTORY?.trim()
  if (directory && isAbsolute(directory)) return directory
  const root = env.MANUS_ADDON_TOOLS_ROOT?.trim()
  if (root && isAbsolute(root)) return join(root, WEBDEV_ADDON_ID)
}

// Keep the existing x64 cache; native ARM64 and emulated x64 hosts can coexist.
const architectureDirectory = (root, platform, arch) => platform === 'win32' && arch === 'arm64' ? join(root, 'arm64') : root

// The location used without an Operator tools directory (older Operators,
// cloud sandboxes), and by every installation made before it existed.
export function legacyManagedGodotDirectory(env = process.env, platform = process.platform, arch = process.arch) {
  const home = env.HOME || env.USERPROFILE || homedir()
  const data = platform === 'win32' ? env.LOCALAPPDATA || join(home, 'AppData', 'Local')
    : platform === 'linux' ? env.XDG_DATA_HOME || join(home, '.local', 'share')
      : join(home, 'Library', 'Application Support')
  return architectureDirectory(join(data, 'Manus', 'toolchains', 'godot', GODOT_VERSION), platform, arch)
}

export function managedGodotDirectory(env = process.env, platform = process.platform, arch = process.arch) {
  const tools = addonToolsDirectory(env)
  return tools ? architectureDirectory(join(tools, 'godot', GODOT_VERSION), platform, arch) : legacyManagedGodotDirectory(env, platform, arch)
}

// Godot reads export templates only from the running account. This host-written
// copy, verified on download or taken from the host account's own Godot
// directory, lets an account that cannot read that directory restore them.
export function managedExportTemplatesDirectory(env = process.env) {
  const tools = addonToolsDirectory(env)
  return tools && join(tools, 'godot', 'export_templates', GODOT_VERSION)
}

export function windowsGodotExecutableName(arch = process.arch, consoleBuild = false) {
  const suffix = { x64: 'win64', arm64: 'windows_arm64' }[arch]
  if (!suffix) throw Object.assign(new Error('Unsupported Windows architecture'), { code: 'godot_preparation_unsupported' })
  return `Godot_v4.7.2-stable_${suffix}${consoleBuild ? '_console' : ''}.exe`
}

export function linuxGodotExecutableName(arch = process.arch) {
  const suffix = { x64: 'x86_64', arm64: 'arm64' }[arch]
  if (!suffix) throw Object.assign(new Error('Unsupported Linux architecture'), { code: 'godot_preparation_unsupported' })
  return `Godot_v4.7.2-stable_linux.${suffix}`
}

function godotExecutableIn(directory, platform, arch) {
  if (platform === 'linux') return join(directory, 'engine', linuxGodotExecutableName(arch))
  return platform === 'win32'
    ? join(directory, 'engine', windowsGodotExecutableName(arch, true))
    : join(directory, 'engine', 'Godot.app', 'Contents', 'MacOS', 'Godot')
}

export function managedGodotExecutable(env = process.env, platform = process.platform, arch = process.arch) {
  return godotExecutableIn(managedGodotDirectory(env, platform, arch), platform, arch)
}

export function legacyManagedGodotExecutable(env = process.env, platform = process.platform, arch = process.arch) {
  return godotExecutableIn(legacyManagedGodotDirectory(env, platform, arch), platform, arch)
}

// Whether the selected engine is one Manus installed before the Addon tools
// directory existed, and the tools directory needs its own copy of it. Only
// Windows safe mode runs agent terminals as a separate account that cannot
// read that location; on macOS and Linux they run as this account and keep
// using it. Only a default selection qualifies: GODOT_BIN and user
// installations stay as chosen.
export function needsToolsEngineCopy(executable, env = process.env, platform = process.platform, arch = process.arch) {
  if (platform !== 'win32' || !addonToolsDirectory(env) || env.GODOT_BIN) return false
  return [arch, arch === 'arm64' ? 'x64' : 'arm64'].some(candidate => {
    let directory
    try { directory = realpathSync(legacyManagedGodotDirectory(env, platform, candidate)) } catch { return false }
    const path = relative(directory, executable)
    return path !== '' && path !== '..' && !path.startsWith('../') && !path.startsWith('..\\') && !isAbsolute(path)
  })
}
