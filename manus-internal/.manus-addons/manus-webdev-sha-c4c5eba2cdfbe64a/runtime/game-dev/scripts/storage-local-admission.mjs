// Local hosts have no Sandbox package writers and need no Python prerequisite.
// This uses the same conservative reservation policy in the user's temp folder.
import { randomBytes } from 'node:crypto'
import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, realpathSync, renameSync, rmSync, rmdirSync, statfsSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const unavailable = () => ({ error: 'GAME_STORAGE_ADMISSION_UNAVAILABLE' })
function alive(pid) {
  try { process.kill(pid, 0); return true } catch (error) { return error.code !== 'ESRCH' }
}
export function localStorageAdmission(request) {
  const directory = join(realpathSync(tmpdir()), 'manus-game-storage-reservations')
  const lock = join(directory, 'admission.lock')
  const reclaim = join(directory, 'admission-reclaim')
  const claim = () => {
    try { writeFileSync(lock, String(process.pid), { flag: 'wx', mode: 0o600 }); return true }
    catch (error) { if (error.code !== 'EEXIST') throw error; return false }
  }
  try {
    try { mkdirSync(directory, { mode: 0o700 }) } catch (error) { if (error.code !== 'EEXIST') throw error }
    if (!lstatSync(directory).isDirectory() || realpathSync(directory) !== directory) return unavailable()
    let locked = claim()
    const deadline = performance.now() + 15_000
    while (!locked) {
      let guarded = false
      try { mkdirSync(reclaim); guarded = true } catch (error) { if (error.code !== 'EEXIST') throw error }
      if (guarded) {
        try {
          try {
            const info = lstatSync(lock)
            if (!info.isFile() || info.isSymbolicLink() || info.size > 32) return unavailable()
            const pid = Number(readFileSync(lock, 'utf8').trim())
            if (Number.isSafeInteger(pid) && pid > 0 && !alive(pid)) rmSync(lock)
          } catch (error) { if (error.code !== 'ENOENT') throw error }
          locked = claim()
        } finally { rmdirSync(reclaim) }
      }
      if (!locked) {
        if (performance.now() >= deadline) return unavailable()
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 20)
      }
    }
    try {
      if (request.action === 'release') {
        if (!/^[a-f0-9]{32}$/.test(request.id ?? '')) return unavailable()
        const file = join(directory, request.id + '.json')
        if (!existsSync(file)) return {}
        if (!lstatSync(file).isFile() || lstatSync(file).isSymbolicLink()) return unavailable()
        if (JSON.parse(readFileSync(file, 'utf8')).pid === process.pid) rmSync(file)
        return {}
      }
      const filesystem = statfsSync(request.path)
      const device = String(statSync(request.path).dev)
      let reservedBytes = 0; let reservedInodes = 0
      for (const name of readdirSync(directory)) {
        const pending = name.match(/^\.pending-([1-9][0-9]*)-[a-f0-9]{32}$/)
        if (pending && !alive(Number(pending[1]))) { rmSync(join(directory, name), { force: true }); continue }
        if (!/^[a-f0-9]{32}\.json$/.test(name)) continue
        const file = join(directory, name)
        const info = lstatSync(file)
        if (!info.isFile() || info.isSymbolicLink() || info.size > 4096) return unavailable()
        const value = JSON.parse(readFileSync(file, 'utf8'))
        if (!Number.isSafeInteger(value.pid) || value.pid <= 0 || typeof value.device !== 'string' ||
            !Number.isSafeInteger(value.bytes) || value.bytes < 0 || !Number.isSafeInteger(value.inodes) || value.inodes < 0) return unavailable()
        if (!alive(value.pid)) { rmSync(file); continue }
        if (value.device === device) { reservedBytes += value.bytes; reservedInodes += value.inodes }
      }
      const margin = Math.max(2 * 1024 ** 3, Math.min(4 * 1024 ** 3, Math.floor(filesystem.blocks * filesystem.bsize / 10)))
      const availableBytes = filesystem.bavail * filesystem.bsize
      const requiredBytes = margin + reservedBytes + request.bytes
      const requiredInodes = 4096 + reservedInodes + request.inodes
      if (availableBytes < requiredBytes || (filesystem.files && filesystem.ffree < requiredInodes)) {
        return { error: 'GAME_STORAGE_CAPACITY', availableBytes, requiredBytes, availableInodes: filesystem.ffree, requiredInodes }
      }
      const id = randomBytes(16).toString('hex')
      const pending = join(directory, `.pending-${process.pid}-${id}`)
      try {
        writeFileSync(pending, JSON.stringify({ pid: process.pid, device, bytes: request.bytes, inodes: request.inodes }), { flag: 'wx', mode: 0o600 })
        renameSync(pending, join(directory, id + '.json'))
      } finally { rmSync(pending, { force: true }) }
      return { id, marginBytes: margin }
    } finally { rmSync(lock, { force: true }) }
  } catch (error) { return { error: ['ENOSPC', 'EDQUOT'].includes(error.code) ? 'GAME_STORAGE_CAPACITY' : 'GAME_STORAGE_ADMISSION_UNAVAILABLE' } }
}
