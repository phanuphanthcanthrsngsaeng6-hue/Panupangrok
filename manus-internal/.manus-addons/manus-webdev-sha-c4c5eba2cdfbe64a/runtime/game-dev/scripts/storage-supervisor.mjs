// Native import/export writes are observed even while the synchronous caller is
// blocked. Quotas remain the hard boundary for writes between sampling ticks.
import { spawn, execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { assertStorageCapacity } from './storage-capacity.mjs'

const { directory, budget, baseline } = JSON.parse(process.env.GAME_STORAGE_BUDGET)
let failure
try {
  if (process.env.GAME_STORAGE_OWNER_PID && process.ppid !== Number(process.env.GAME_STORAGE_OWNER_PID)) throw Object.assign(new Error('Build owner exited'), { code: 'GAME_PROCESS_CANCELLED' })
  assertStorageCapacity(directory, budget, baseline)
} catch (error) { failure = error }
if (failure) {
  console.error(`[${failure.code}] ${failure.message}`)
  process.exitCode = failure.code === 'GAME_STORAGE_CAPACITY' ? 73 : 1
} else {
  const [executable, ...args] = process.argv.slice(2)
  const owner = Number(process.env.GAME_STORAGE_OWNER_PID || process.ppid)
  // Preserve the caller's lifecycle pipe all the way through the native child.
  const stdio = ['ignore', 'pipe', 'pipe', ...(process.env.GAME_STORAGE_LIFECYCLE_FD === '3' ? [3] : [])]
  const linux = process.platform === 'linux'
  const command = linux ? 'python3' : executable
  const commandArgs = linux ? [fileURLToPath(new URL('./storage-native-exec.py', import.meta.url)), executable, ...args] : args
  const child = spawn(command, commandArgs, { stdio, detached: process.platform !== 'win32', env: { ...process.env, GAME_STORAGE_SUPERVISOR_PID: String(process.pid) } })
  let killing
  const killTree = signal => {
    if (!child.pid) return
    if (process.platform === 'win32') {
      // Windows has no POSIX groups; taskkill owns recursive child termination.
      try { execFileSync(join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'taskkill.exe'), ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore', timeout: 10_000 }) }
      catch { child.kill('SIGKILL') }
    } else {
      try { process.kill(-child.pid, signal) } catch (error) { if (error.code !== 'ESRCH') throw error }
    }
  }
  const stop = () => { killTree('SIGTERM'); killing ??= setTimeout(() => killTree('SIGKILL'), 1000) }
  const fail = (code, message) => { failure ??= Object.assign(new Error(message), { code }); stop() }
  for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => fail('GAME_PROCESS_CANCELLED', 'Game build cancelled'))
  // The outer spawnSync must never kill just this supervisor while Godot keeps
  // writing. Own both timeout and output limits here, and return only on close.
  const timeoutMs = Number(process.env.GAME_STORAGE_TIMEOUT_MS || 120_000)
  const timeout = setTimeout(() => fail('GAME_PROCESS_TIMEOUT', 'Game native build timed out'), timeoutMs)
  let outputBytes = 0
  for (const [pipe, destination] of [[child.stdout, process.stdout], [child.stderr, process.stderr]]) {
    pipe.on('data', bytes => {
      outputBytes += bytes.length
      if (outputBytes > 16 * 1024 ** 2) fail('GAME_PROCESS_OUTPUT_LIMIT', 'Game native build exceeded its diagnostic output limit')
      else destination.write(bytes)
    })
  }
  const timer = setInterval(() => {
    if (process.ppid !== owner) { fail('GAME_PROCESS_CANCELLED', 'Build owner exited'); return }
    try { process.kill(owner, 0) } catch (error) { if (error.code === 'ESRCH') { fail('GAME_PROCESS_CANCELLED', 'Build owner exited'); return } }
    try { assertStorageCapacity(directory, budget, baseline) }
    catch (error) { failure ??= error; stop() }
  }, 250)
  child.on('error', error => { failure ??= error })
  child.on('close', (code, signal) => {
    if (failure || code !== 0 || signal) killTree('SIGKILL')
    clearInterval(timer); clearTimeout(killing); clearTimeout(timeout)
    if (!failure) { try { assertStorageCapacity(directory, budget, baseline) } catch (error) { failure = error } }
    if (failure) console.error(`[${failure.code?.startsWith('GAME_') ? failure.code : 'GAME_PROCESS_FAILED'}] ${failure.code?.startsWith('GAME_') ? failure.message : 'Game native build process could not run'}`)
    process.exitCode = failure?.code === 'GAME_STORAGE_CAPACITY' ? 73 : failure ? 1 : code ?? (signal ? 1 : 0)
  })
}
