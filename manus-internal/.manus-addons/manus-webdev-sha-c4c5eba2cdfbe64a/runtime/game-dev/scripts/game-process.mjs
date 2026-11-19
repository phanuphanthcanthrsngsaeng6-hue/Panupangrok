import { fileURLToPath } from 'node:url'
import { GameStorageError } from './storage-capacity.mjs'
import { spawnSync } from 'node:child_process'
import { writeFileSync, renameSync, rmSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { join } from 'node:path'
import { ensureDistDirectory } from './local-artifacts.mjs'

// Godot can exit zero after script/import errors. A successful process alone is
// not successful verification. Bound finite children without touching preview.
export function runGameProcess(executable, args, { cwd, diagnosticRoot = cwd, timeout = 120_000, env = process.env, label = 'Godot', lifecycleFd } = {}) {
  // A supervised export may outlive its synchronous JS wrapper during group
  // termination. Retain the supervisor's pipe separately from captured output,
  // so its close event cannot release the export lock before Godot exits.
  const stdio = lifecycleFd === undefined ? undefined : ['pipe', 'pipe', 'pipe', lifecycleFd]
  const guarded = env.GAME_STORAGE_BUDGET
  const command = guarded ? process.execPath : executable
  const commandArgs = guarded ? [fileURLToPath(new URL('./storage-supervisor.mjs', import.meta.url)), executable, ...args] : args
  const guardedEnv = guarded ? { ...env, GAME_STORAGE_TIMEOUT_MS: String(timeout), GAME_STORAGE_OWNER_PID: String(process.pid), ...(lifecycleFd === undefined ? {} : { GAME_STORAGE_LIFECYCLE_FD: '3' }) } : env
  const result = spawnSync(command, commandArgs, { cwd, env: guardedEnv, stdio, encoding: 'utf8', timeout: guarded ? undefined : timeout, killSignal: 'SIGKILL', maxBuffer: (guarded ? 32 : 16) * 1024 * 1024 })
  const output = [result.stdout, result.stderr].filter(Boolean).join('\n').replace(/\x1b\[[0-9;]*m/g, '')
  if (output.includes('[GAME_STORAGE_CAPACITY]') || result.error?.code === 'ENOSPC' || result.error?.code === 'EDQUOT') throw new GameStorageError()
  if (output.includes('[GAME_PROCESS_TIMEOUT]')) throw new Error(`${label} timed out`)
  const errors = output.split(/\r?\n/).filter(line => /(?:SCRIPT ERROR|Parse Error:|Compile Error:|ERROR:)/.test(line))
  if (result.error || result.status !== 0 || errors.length) {
    const sanitize = text => text.replace(/https?:\/\/[^\s"'<>]+/g, value => {
      try { const url = new URL(value); url.username = ''; url.password = ''; url.search = ''; url.hash = ''; return url.toString() } catch { return '[URL omitted]' }
    }).replace(/((?:token|password|secret|api[_-]?key)\s*[=:]\s*)[^\s,;]+/gi, '$1[redacted]')
    const detail = sanitize((errors.length ? errors : output.trim().split(/\r?\n/)).slice(0, 12).join('\n').slice(0, 6000))
    let diagnostic = ''
    if (diagnosticRoot && output) {
      try {
        const directory = ensureDistDirectory(diagnosticRoot)
        const temporary = join(directory, `.game-error-${randomUUID()}.tmp`)
        try {
          writeFileSync(temporary, sanitize(output), { flag: 'wx', mode: 0o600 })
          renameSync(temporary, join(directory, '.game-check-error.log'))
          diagnostic = '\nFull sanitized diagnostics: dist/.game-check-error.log'
        } finally { rmSync(temporary, { force: true }) }
      } catch { /* Preserve the engine failure if diagnostic storage is unavailable. */ }
    }
    throw new Error(`${label} ${result.error?.code === 'ETIMEDOUT' ? 'timed out' : 'failed'}${detail ? ':\n' + detail : ''}${diagnostic}`)
  }
  return output
}
