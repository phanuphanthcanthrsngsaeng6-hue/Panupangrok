import { verifyExportReceipt } from './export-receipt.mjs'
import { releaseFiles } from './release-manifest.mjs'
import { createHash, randomBytes } from 'node:crypto'
import { directoryUsage } from './storage-capacity.mjs'
import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, realpathSync, renameSync, rmSync, rmdirSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { ensureDistDirectory, validateExportDirectory } from './local-artifacts.mjs'

export const GENERATION = /^[a-f0-9]{64}$/
export const PREVIEW_PATH = '/__manus__/game-preview/'
export const PREVIEW_STATUS_PATH = '/__manus__/game-status'

// Preview output and control state are runtime cache, excluded from project Git.
export function previewDirectory(root) {
  const directory = join(ensureDistDirectory(root), '.preview')
  for (const child of [directory, join(directory, 'builds')]) {
    if (!existsSync(child)) mkdirSync(child)
    if (!lstatSync(child).isDirectory() || realpathSync(child) !== child) throw new Error('preview cache must be a project directory')
  }
  return directory
}

export function readCurrentPreview(root) {
  if (existsSync(join(root, 'dist', '.site-install.json'))) return null
  const directory = previewDirectory(root)
  try {
    const file = join(directory, 'current.json')
    if (!lstatSync(file).isFile() || lstatSync(file).isSymbolicLink()) return null
    const current = JSON.parse(readFileSync(file, 'utf8'))
    // Version 1 could be an automatic export of the unmodified scaffold.
    if (current.version !== 2 || !GENERATION.test(current.generation) || typeof current.fingerprint !== 'string') return null
    const snapshot = join(directory, 'builds', current.generation)
    validateExportDirectory(root, snapshot)
    if (outputGeneration(snapshot) !== current.generation) return null
    if (current.build && (current.build.profile !== 'preview' || current.build.snapshotId !== current.fingerprint)) return null
    if (current.build?.version === 2 && !current.build.export) return null
    if (current.build?.export !== undefined) verifyExportReceipt(current.build.export, 'preview', current.build.snapshotId, releaseFiles(snapshot))
    return current
  } catch { return null }
}

function outputGeneration(directory) {
  const hash = createHash('sha256')
  const walk = parent => {
    for (const name of readdirSync(parent).sort()) {
      const file = join(parent, name)
      if (lstatSync(file).isDirectory()) walk(file)
      else hash.update(relative(directory, file).replaceAll('\\', '/') + '\0').update(readFileSync(file)).update('\0')
    }
  }
  walk(directory)
  return hash.digest('hex')
}

export function activatePreview(root, staging, fingerprint, build) {
  validateExportDirectory(root, staging)
  const directory = previewDirectory(root)
  if (build && (build.profile !== 'preview' || build.snapshotId !== fingerprint)) throw new Error('Game preview build identity is invalid')
  if (build?.export !== undefined) verifyExportReceipt(build.export, 'preview', fingerprint, releaseFiles(staging))
  const generation = outputGeneration(staging)
  const target = join(directory, 'builds', generation)
  if (existsSync(target)) {
    validateExportDirectory(root, target)
    if (outputGeneration(target) !== generation) throw new Error('preview cache content changed')
    rmSync(staging, { recursive: true, force: true })
  } else renameSync(staging, target)
  const current = { version: 2, generation, fingerprint, ...(build ? { build } : {}) }
  const temporary = join(directory, `.current-${randomBytes(8).toString('hex')}.tmp`)
  try {
    writeFileSync(temporary, JSON.stringify(current) + '\n', { flag: 'wx', mode: 0o600 })
    renameSync(temporary, join(directory, 'current.json'))
  } finally { rmSync(temporary, { force: true }) }
  try { prunePreviewHistory(root) } catch { /* Activation succeeded; cleanup retries before the next build. */ }
  return current
}

export const PREVIEW_LEASE_MS = 10 * 60_000
export const PREVIEW_HISTORY_BYTES = 512 * 1024 ** 2
const HISTORY_AGE_MS = 24 * 60 * 60_000

// Serializes requests renewing their generation against deletion. This lock is
// separate from the export lock: a running game must serve while Godot builds.
function withPreviewRetentionLock(root, run) {
  const directory = previewDirectory(root)
  const lock = join(directory, '.retention-lock')
  const claim = () => {
    try { writeFileSync(lock, String(process.pid), { flag: 'wx', mode: 0o600 }); return true }
    catch (error) { if (error.code !== 'EEXIST') throw error; return false }
  }
  if (!claim()) {
    const reclaim = lock + '-reclaim'
    try { mkdirSync(reclaim) } catch (error) { if (error.code === 'EEXIST') return null; throw error }
    let acquired = false
    try {
      try {
        const info = lstatSync(lock)
        if (!info.isFile() || info.isSymbolicLink() || info.size > 32) return null
        const pid = Number(readFileSync(lock, 'utf8').trim())
        if (!Number.isSafeInteger(pid) || pid <= 0) return null
        try { process.kill(pid, 0); return null } catch (error) { if (error.code !== 'ESRCH') return null }
        rmSync(lock)
      } catch (error) { if (error.code !== 'ENOENT') throw error }
      acquired = claim()
    } finally { rmdirSync(reclaim) }
    if (!acquired) return null
  }
  try { return run(directory) } finally { rmSync(lock, { force: true }) }
}
function leaseDirectory(directory) {
  const leases = join(directory, 'leases')
  if (!existsSync(leases)) mkdirSync(leases)
  if (!lstatSync(leases).isDirectory() || realpathSync(leases) !== leases) throw new Error('Preview leases must be a project directory')
  return leases
}

// Every served generation and browser status heartbeat renews the lease. A
// suspended tab expires after ten minutes; on resume it navigates to current.
export function retainPreviewGeneration(root, generation, { now = Date.now() } = {}) {
  if (!GENERATION.test(generation ?? '')) return false
  // Existing unexpired leases make hot asset requests independent of a sweep.
  try {
    const lease = join(previewDirectory(root), 'leases', generation)
    if (lstatSync(lease).isFile() && !lstatSync(lease).isSymbolicLink() && now - Number(readFileSync(lease, 'utf8')) < PREVIEW_LEASE_MS / 2) return true
  } catch {}
  return withPreviewRetentionLock(root, directory => {
    const target = join(directory, 'builds', generation)
    if (!existsSync(target) || !lstatSync(target).isDirectory() || realpathSync(target) !== target) return false
    const lease = join(leaseDirectory(directory), generation)
    if (existsSync(lease)) {
      if (!lstatSync(lease).isFile() || lstatSync(lease).isSymbolicLink()) return false
      // Polling every 1.5 seconds needs no corresponding disk write.
      if (now - Number(readFileSync(lease, 'utf8')) < 60_000) return true
    }
    const temporary = join(directory, `.lease-${randomBytes(8).toString('hex')}.tmp`)
    try { writeFileSync(temporary, String(now), { flag: 'wx', mode: 0o600 }); renameSync(temporary, lease) }
    finally { rmSync(temporary, { force: true }) }
    return true
  })
}

export function prunePreviewHistory(root, { now = Date.now(), maxBytes = PREVIEW_HISTORY_BYTES, keepInactive = 2 } = {}) {
  if (existsSync(join(root, 'dist/.site-install.json')) || !existsSync(join(root, 'dist/.preview/current.json'))) return []
  return withPreviewRetentionLock(root, directory => {
    // An invalid pointer is a recovery problem, not permission to collect.
    const current = readCurrentPreview(root)
    if (!current) return []
    const leases = leaseDirectory(directory)
    const builds = join(directory, 'builds')
    const activeStreams = new Set()
    const streams = join(directory, 'streams')
    if (existsSync(streams)) {
      if (!lstatSync(streams).isDirectory() || realpathSync(streams) !== streams) return []
      for (const name of readdirSync(streams)) {
        const match = name.match(/^([a-f0-9]{64})-([1-9][0-9]*)-[a-f0-9]{16}$/)
        if (!match) continue
        try { process.kill(Number(match[2]), 0); activeStreams.add(match[1]) }
        catch (error) { if (error.code === 'ESRCH') rmSync(join(streams, name), { force: true }); else activeStreams.add(match[1]) }
      }
    }
    const entries = []
    for (const generation of readdirSync(builds)) {
      if (!GENERATION.test(generation)) continue
      const path = join(builds, generation)
      if (!lstatSync(path).isDirectory() || realpathSync(path) !== path) continue
      let seen = 0
      const lease = join(leases, generation)
      try {
        if (!lstatSync(lease).isFile() || lstatSync(lease).isSymbolicLink()) continue
        seen = Number(readFileSync(lease, 'utf8'))
        if (!Number.isFinite(seen) || seen < 0) continue
      } catch (error) { if (error.code !== 'ENOENT') continue }
      entries.push({ generation, path, lease, seen, modified: lstatSync(path).mtimeMs,
        protected: generation === current.generation || activeStreams.has(generation) || now - seen < PREVIEW_LEASE_MS })
    }
    const removed = []
    let kept = 0; let bytes = 0
    for (const entry of entries.sort((a, b) => b.modified - a.modified)) {
      if (entry.protected) continue
      // Only verified runtime exports can be collected, including old-runtime
      // exports without leases. Unknown files and symlinks remain untouched.
      try { validateExportDirectory(root, entry.path) } catch { continue }
      const usage = directoryUsage(entry.path)
      if (kept < keepInactive && bytes + usage.bytes <= maxBytes && now - Math.max(entry.modified, entry.seen) < HISTORY_AGE_MS) {
        kept++; bytes += usage.bytes; continue
      }
      rmSync(entry.path, { recursive: true, force: true })
      rmSync(entry.lease, { force: true })
      removed.push(entry.generation)
    }
    return removed
  }) ?? []
}

// The response owns this pin through stream close, even on very slow downloads.
export function pinPreviewStream(root, generation) {
  if (!GENERATION.test(generation ?? '')) return null
  return withPreviewRetentionLock(root, directory => {
    const target = join(directory, 'builds', generation)
    if (!existsSync(target) || !lstatSync(target).isDirectory() || realpathSync(target) !== target) return null
    const streams = join(directory, 'streams')
    if (!existsSync(streams)) mkdirSync(streams)
    if (!lstatSync(streams).isDirectory() || realpathSync(streams) !== streams) return null
    const pin = join(streams, `${generation}-${process.pid}-${randomBytes(8).toString('hex')}`)
    writeFileSync(pin, '', { flag: 'wx', mode: 0o600 })
    return () => rmSync(pin, { force: true })
  })
}
