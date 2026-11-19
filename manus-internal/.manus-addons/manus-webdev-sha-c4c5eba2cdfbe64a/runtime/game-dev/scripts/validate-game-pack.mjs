import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { runGameProcess } from './game-process.mjs'

export function runGodotChecked(engine, args, options = {}) {
  return runGameProcess(engine, args, { ...options, label: 'Godot operation', lifecycleFd: process.stdout.fd })
}

export function validateGamePack(engine, pack, { diagnosticRoot } = {}) {
  // Start the exported pack outside the source tree: missing dependencies must
  // not be satisfied by files that happen to exist in the editable project.
  const directory = mkdtempSync(join(tmpdir(), 'game-pack-check-'))
  try {
    // Quitting the engine immediately after boot can leave queued OGG playback
    // references alive even when the game correctly releases its players. Free
    // the configured scene and autoloads first, then let the real audio clock drain. This
    // external probe is never included in the game or its exported resources.
    const probe = join(directory, 'pack-startup.gd')
    writeFileSync(probe, `extends SceneTree
func _initialize() -> void:
    _run.call_deferred()
func _run() -> void:
    var main_scene: String = ProjectSettings.get_setting("application/run/main_scene", "")
    if main_scene.is_empty() or change_scene_to_file(main_scene) != OK:
        push_error("[PACK_STARTUP_FAIL] configured main scene cannot be loaded")
        quit(1)
        return
    for _frame: int in 4: await process_frame
    if current_scene == null or not current_scene.is_inside_tree():
        push_error("[PACK_STARTUP_FAIL] configured main scene did not remain loaded")
        quit(1)
        return
    var roots: Array[Node] = root.get_children()
    roots.reverse()
    for node: Node in roots: node.queue_free()
    for _frame: int in 2: await process_frame
    await create_timer(0.25, true, false, true).timeout
    print("[PACK_STARTUP_PASS] configured scene boots and frees cleanly")
    quit(0)
`)
    const output = runGodotChecked(engine, ['--headless', '--path', directory, '--main-pack', pack,
      '--script', probe], {
      cwd: directory, diagnosticRoot, timeout: 30_000,
      env: { PATH: process.env.PATH, HOME: directory, USERPROFILE: directory, TMPDIR: directory, XDG_DATA_HOME: directory, XDG_CONFIG_HOME: directory, GODOT_SILENCE_ROOT_WARNING: '1' },
    })
    if (!output.includes('[PACK_STARTUP_PASS]')) throw new Error('Pack startup probe did not complete')
  } catch (error) {
    if (error.code === 'GAME_STORAGE_CAPACITY') throw error
    const detail = String(error.stdout ?? '') + '\n' + String(error.stderr ?? error.message ?? '')
    throw new Error('Exported Game pack failed its startup check. Fix its script/resource dependencies before retrying.\n' + detail.slice(-6000))
  } finally { rmSync(directory, { recursive: true, force: true }) }
}
