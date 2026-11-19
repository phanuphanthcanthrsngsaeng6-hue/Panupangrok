import { localStorageAdmission } from './storage-local-admission.mjs'
import { execFileSync } from 'node:child_process'
import { lstatSync, readdirSync, statfsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const localStorage = () => process.env.WEBDEV_INIT_RUNNER === 'local' || process.platform !== 'linux'
export const STORAGE_MARGIN_BYTES = 2 * 1024 ** 3
export class GameStorageError extends Error {
  constructor(code = 'GAME_STORAGE_CAPACITY', details = {}) {
    super(code === 'GAME_STORAGE_ADMISSION_UNAVAILABLE'
      ? 'Game storage admission is unavailable; keep the current game and retry after the runtime storage service is restored'
      : 'Game storage capacity is insufficient for this build; the current game is preserved. Free unused managed cache or expand project storage before retrying')
    this.code = code
    this.retryable = false
    for (const key of ['availableBytes', 'requiredBytes', 'availableInodes', 'requiredInodes']) {
      if (Number.isSafeInteger(details[key]) && details[key] >= 0) this[key] = details[key]
    }
  }
}
export function storageError(error) {
  return ['ENOSPC', 'EDQUOT'].includes(error?.code) ? new GameStorageError() : error
}
export function directoryUsage(directory) {
  let bytes = 0; let inodes = 0
  const walk = path => {
    for (const name of readdirSync(path)) {
      const child = join(path, name)
      let info
      try { info = lstatSync(child) } catch (error) { if (error.code === 'ENOENT') continue; throw error }
      inodes++
      if (info.isDirectory()) walk(child)
      else if (info.isFile()) bytes += info.size
      // Never traverse links, even for accounting.
    }
  }
  walk(directory)
  return { bytes, inodes }
}
function admission(request) {
  try {
    const response = localStorage() ? localStorageAdmission(request) : JSON.parse(execFileSync('python3', [fileURLToPath(new URL('./storage-admission.py', import.meta.url))], {
      input: JSON.stringify({ ...request, pid: process.pid, local: localStorage() }), encoding: 'utf8', timeout: 15_000, stdio: ['pipe', 'pipe', 'pipe'],
    }))
    if (response.error) throw new GameStorageError(response.error, response)
    return response
  } catch (error) { throw error instanceof GameStorageError ? error : new GameStorageError('GAME_STORAGE_ADMISSION_UNAVAILABLE') }
}
export function assertStorageCapacity(directory, budget, baseline, { statfs = statfsSync, usage = directoryUsage } = {}) {
  const filesystem = statfs(directory)
  const availableBytes = filesystem.bavail * filesystem.bsize
  const fraction = Math.floor(filesystem.blocks * filesystem.bsize / 10)
  const requiredBytes = Math.max(STORAGE_MARGIN_BYTES, localStorage() ? Math.min(4 * 1024 ** 3, fraction) : fraction)
  const actual = usage(directory)
  if (availableBytes < requiredBytes || (filesystem.files > 0 && filesystem.ffree < 4096) ||
      actual.bytes - baseline.bytes > budget.bytes || actual.inodes - baseline.inodes > budget.inodes) {
    throw new GameStorageError('GAME_STORAGE_CAPACITY', { availableBytes, requiredBytes, availableInodes: filesystem.ffree, requiredInodes: 4096 })
  }
}
export function reserveBuildStorage(directory, source, { reserve = admission, usage = directoryUsage } = {}) {
  // Snapshot + imports + both exports + replaced export caches + site copies.
  // Native import expansion is measured while the child runs and may not exceed
  // this admitted peak; a larger game requires more capacity, never the reserve.
  const budget = { bytes: source.bytes * 8 + 512 * 1024 ** 2, inodes: source.inodes * 8 + 4096 }
  const baseline = usage(directory)
  const record = reserve({ action: 'reserve', path: directory, ...budget })
  let released = false
  return {
    check: () => assertStorageCapacity(directory, budget, baseline),
    environment: { GAME_STORAGE_BUDGET: JSON.stringify({ directory, budget, baseline }) },
    release() { if (!released) { reserve({ action: 'release', id: record.id }); released = true } },
  }
}
