import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { inspectGameToolchain } from './scripts/game-toolchain.mjs'
export { gameExportTemplatesDirectory } from './scripts/game-toolchain.mjs'

const recoveryMessages = {
  godot_unavailable: 'Godot could not be found or started. Check the selected executable, GODOT_BIN, PATH and execution permissions before proposing installation.',
  godot_version_unsupported: 'The selected Godot version is unsupported. Select Godot 4.7.2 stable with GODOT_BIN; preserve other installed engines and project files.',
  web_export_templates_unavailable: 'The Godot engine passed its version check. Check Web export templates and custom export presets; restore only missing matching templates or correct the preset. Do not reinstall the working Godot engine.',
}

export function checkGameEnvironment(env = process.env, platform = process.platform, options = {}) {
  try {
    const toolchain = inspectGameToolchain(options.root ?? process.cwd(), { ...options, env, platform })
    return { ok: true, version: toolchain.version, executable: toolchain.executable, webExportTemplates: 'available' }
  } catch (error) {
    const code = ['godot_unavailable', 'godot_version_unsupported', 'web_export_templates_unavailable'].includes(error.code) ? error.code : 'godot_unavailable'
    return { ok: false, code, ...(error.version ? { version: error.version } : {}), ...(error.missing ? { missing: error.missing } : {}),
      ...(error.unreadableToolTemplates ? { unreadableToolTemplates: error.unreadableToolTemplates } : {}),
      message: error.unreadableToolTemplates ? error.message : recoveryMessages[code] }
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = checkGameEnvironment()
  console.log(result.ok && process.argv.includes('--executable') ? result.executable : JSON.stringify(result))
  if (!result.ok) process.exitCode = 1
}
