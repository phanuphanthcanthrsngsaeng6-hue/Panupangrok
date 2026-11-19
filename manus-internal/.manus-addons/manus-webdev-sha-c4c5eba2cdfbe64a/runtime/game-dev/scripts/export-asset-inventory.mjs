import { createHash } from 'node:crypto'
import { closeSync, fstatSync, lstatSync, openSync, readSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { isProvenanceMediaPath } from './asset-provenance.mjs'
import { readPreparedShare } from './share-metadata.mjs'
import { assetTypeOf } from './local-artifacts.mjs'

// Standalone PCK V2-V4 layout: Godot core/io/file_access_pack.cpp,
// PackedSourcePCK::try_open_pack. Read the exported bytes, never source-tree
// ResourceLoader fallbacks. Unknown formats remain unknown, without blocking play.
const MAX_FILES = 100_000
const MAX_DIRECTORY_BYTES = 32 * 1024 * 1024
const MAX_REMAP_BYTES = 1024 * 1024
const MAX_HOST_MEDIA = 20_000
const MAX_HOST_FILE_BYTES = 512 * 1024 * 1024
const MAX_HOST_MEDIA_BYTES = 2 * 1024 * 1024 * 1024
const invalid = () => { throw new Error('Unsupported or invalid exported pack inventory') }
const safePath = value => typeof value === 'string' && value.length > 0 &&
  !/[\\\x00-\x1f\x7f:]/.test(value) && value.split('/').every(part => part && part !== '.' && part !== '..')
const resourcePath = value => value.startsWith('res://') ? value.slice(6) : value

export function fileDigest(path) {
  if (!lstatSync(path).isFile() || lstatSync(path).isSymbolicLink()) invalid()
  const fd = openSync(path, 'r')
  try {
    if (!fstatSync(fd).isFile()) invalid()
    const hash = createHash('sha256'), buffer = Buffer.allocUnsafe(1024 * 1024)
    for (;;) {
      const size = readSync(fd, buffer, 0, buffer.length, null)
      if (!size) break
      hash.update(buffer.subarray(0, size))
    }
    return 'sha256:' + hash.digest('hex')
  } finally { closeSync(fd) }
}

export function readPackInventory(path) {
  if (!lstatSync(path).isFile() || lstatSync(path).isSymbolicLink()) invalid()
  const fd = openSync(path, 'r')
  try {
    const length = fstatSync(fd).size
    let offset = 0
    const read = size => {
      if (!Number.isSafeInteger(size) || size < 0 || offset + size > length) invalid()
      const bytes = Buffer.alloc(size)
      if (readSync(fd, bytes, 0, size, offset) !== size) invalid()
      offset += size
      return bytes
    }
    const u32 = () => read(4).readUInt32LE()
    const u64 = () => {
      const value = read(8).readBigUInt64LE()
      if (value > BigInt(Number.MAX_SAFE_INTEGER)) invalid()
      return Number(value)
    }
    if (read(4).toString() !== 'GDPC') invalid()
    const version = u32()
    if (![2, 3, 4].includes(version)) invalid()
    read(12) // Engine version.
    const flags = u32()
    if (flags & ~2) invalid() // Encrypted directories and sparse bundles need other readers.
    const base = u64()
    if (version >= 3) offset = u64()
    else read(64)
    const start = offset, count = u32(), entries = new Map()
    if (count > MAX_FILES) invalid()
    for (let i = 0; i < count; i++) {
      const size = u32()
      if (!size || size > 16 * 1024) invalid()
      const name = resourcePath(new TextDecoder('utf-8', { fatal: true }).decode(read(size)).replace(/\0+$/, ''))
      const position = base + u64(), bytes = u64()
      read(16) // MD5 is not a source identity; the whole PCK SHA binds this observation.
      const fileFlags = u32()
      if (!safePath(name) || entries.has(name) || fileFlags || !Number.isSafeInteger(position) || position + bytes > length) invalid()
      entries.set(name, { position, size: bytes })
      if (offset - start > MAX_DIRECTORY_BYTES) invalid()
    }
    const paths = new Set(entries.keys())
    const aliases = new Map()
    let remapBytes = 0
    for (const [name, entry] of entries) {
      if (!/\.(?:import|remap)$/.test(name)) continue
      remapBytes += entry.size
      if (entry.size > MAX_REMAP_BYTES || remapBytes > MAX_DIRECTORY_BYTES) invalid()
      offset = entry.position
      const text = new TextDecoder('utf-8', { fatal: true }).decode(read(entry.size))
      let section = '', targets = []
      for (const line of text.split(/\r?\n/)) {
        const header = /^\s*\[([^\]]+)\]\s*$/.exec(line)
        if (header) { section = header[1]; continue }
        if (section !== 'remap') continue
        const match = /^\s*path(?:\.[\w.-]+)?\s*=\s*"(res:\/\/[^"\n]+)"\s*$/.exec(line)
        if (match) {
          const target = resourcePath(match[1])
          if (!safePath(target)) invalid()
          targets.push(target)
        }
      }
      if (targets.length) aliases.set(name.replace(/\.(?:import|remap)$/, ''), targets)
    }
    // Imported assets count only when their packed remap resolves to packed bytes.
    for (let pass = 0; pass <= aliases.size; pass++) {
      let changed = false
      for (const [name, targets] of aliases) if (!paths.has(name) && targets.some(target => paths.has(target))) {
        paths.add(name); changed = true
      }
      if (!changed) break
    }
    return { paths, version, entries: entries.size }
  } finally { closeSync(fd) }
}

export function exportedAssetEvidence(directory, { profile, assets = {}, hostDirectory = directory } = {}) {
  let pckSha256
  try {
    const pack = join(directory, 'index.pck')
    pckSha256 = fileDigest(pack)
    const inventory = readPackInventory(pack)
    const shippedPaths = inventory.paths
    const sharing = readPreparedShare(hostDirectory)
    // Host media may be renamed or exist only in the sharing cache. Preserve
    // verified host facts separately from retained source-file counts.
    const bySize = new Map()
    for (const [path, entry] of Object.entries(assets)) {
      if (!safePath(path) || !Number.isSafeInteger(entry.size) || entry.size <= 0 || !/^sha256:[a-f0-9]{64}$/.test(entry.sha256 ?? '')) continue
      if (!bySize.has(entry.size)) bySize.set(entry.size, [])
      bySize.get(entry.size).push([path, entry.sha256])
    }
    let visited = 0, mediaBytes = 0
    const hostMedia = []
    const walk = (directory, prefix = '') => {
      if (!lstatSync(directory).isDirectory() || lstatSync(directory).isSymbolicLink()) invalid()
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        if (++visited > MAX_FILES) invalid()
        const relative = prefix + entry.name, path = join(directory, entry.name)
        if (entry.isDirectory()) walk(path, relative + '/')
        else if (entry.isFile() && !['index.pck', 'index.wasm'].includes(relative)) {
          const size = lstatSync(path).size, media = isProvenanceMediaPath(relative)
          const candidates = bySize.get(size)
          if (media) {
            const font = assetTypeOf(relative) === 'font'
            if (!font) mediaBytes += size
            if (!safePath(relative) || hostMedia.length >= MAX_HOST_MEDIA ||
                (!font && size > MAX_HOST_FILE_BYTES) || mediaBytes > MAX_HOST_MEDIA_BYTES) invalid()
          }
          if (media || candidates) {
            const hash = fileDigest(path)
            const matches = (candidates ?? []).filter(([, digest]) => digest === hash).map(([source]) => source).sort()
            const sources = new Set(matches.filter(source => source === relative))
            for (const declared of Object.values(sharing?.schemaVersion === 2 ? sharing.assets : {})) {
              if (declared.path === relative && declared.digest === hash && declared.sizeBytes === size && matches.includes(declared.sourcePath)) sources.add(declared.sourcePath)
            }
            // Equal bytes do not prove that every duplicate source path shipped.
            // Prefer path/receipt evidence; a unique content match is unambiguous.
            if (!sources.size && matches.length === 1) sources.add(matches[0])
            const sourcePaths = [...sources].sort()
            for (const source of sourcePaths) shippedPaths.add(source)
            if (media) hostMedia.push({ path: relative, sha256: hash, size, sourcePaths,
              ...(!sourcePaths.length && matches.length > 1 ? { contentMatches: matches } : {}) })
          }
        } else if (!entry.isFile()) invalid()
      }
    }
    walk(hostDirectory)
    hostMedia.sort((left, right) => left.path.localeCompare(right.path, 'en'))
    return { shippedPaths, exportInfo: { profile, pckSha256, coverage: 'verified', hostMedia } }
  } catch {
    return { exportInfo: { profile, ...(pckSha256 ? { pckSha256 } : {}), coverage: 'unknown' } }
  }
}
