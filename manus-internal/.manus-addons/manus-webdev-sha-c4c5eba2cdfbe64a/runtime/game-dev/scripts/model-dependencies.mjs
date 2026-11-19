// Inspect only the bounded glTF JSON metadata, never model buffers or network URLs.
import { closeSync, lstatSync, openSync, readSync } from 'node:fs'
import { extname, join, posix } from 'node:path'

const MAX_JSON_BYTES = 8 * 1024 * 1024
const MAX_REFERENCES = 4096
const MAX_CHUNKS = 64
const safeRelative = value => typeof value === 'string' && value.length > 0 && value.length <= 2048 &&
  !/[\\:\x00-\x1f\x7f]/.test(value) && value.split('/').every(part => part && part !== '.' && part !== '..')
const invalid = (path, message) => new Error(`Model ${path}: ${message}`)

export function isModelResourcePath(path) {
  return typeof path === 'string' && ['.glb', '.gltf'].includes(extname(path).toLowerCase())
}

// Also allow deletion before a model has been registered in managed storage.
// Keep the same traversal/symlink boundary as dependency inspection.
export function isSafeLocalModelPath(root, path) {
  if (!safeRelative(path) || !path.startsWith('assets/') || !isModelResourcePath(path)) return false
  let target = root
  for (const part of path.split('/')) {
    target = join(target, part)
    try { if (lstatSync(target).isSymbolicLink()) return false }
    catch (error) { if (error.code !== 'ENOENT') throw error }
  }
  try { return lstatSync(target).isFile() }
  catch (error) { if (error.code === 'ENOENT') return true; throw error }
}

function regularFile(root, path) {
  if (!safeRelative(path)) throw invalid(path, 'use a project-relative resource path')
  let target = root
  for (const part of path.split('/')) {
    target = join(target, part)
    const stat = lstatSync(target)
    if (stat.isSymbolicLink()) throw invalid(path, 'linked model dependencies are unsupported')
  }
  const stat = lstatSync(target)
  if (!stat.isFile()) throw invalid(path, 'resource must be a regular file')
  return { target, size: stat.size }
}

export function readModelDocument(root, path) {
  const { target, size } = regularFile(root, path)
  const fd = openSync(target, 'r')
  try {
    const read = (offset, length) => {
      if (length < 0 || offset + length > size) throw invalid(path, 'truncated metadata')
      const bytes = Buffer.alloc(length)
      if (readSync(fd, bytes, 0, length, offset) !== length) throw invalid(path, 'metadata changed while reading')
      return bytes
    }
    let bytes, binaryChunk
    if (extname(path).toLowerCase() === '.gltf') {
      if (size > MAX_JSON_BYTES) throw invalid(path, 'JSON exceeds the metadata limit')
      bytes = read(0, size)
    } else {
      const header = read(0, 12)
      if (header.toString('ascii', 0, 4) !== 'glTF' || header.readUInt32LE(4) !== 2 || header.readUInt32LE(8) !== size) {
        throw invalid(path, 'expected a complete GLB v2 file')
      }
      let offset = 12, chunks = 0
      while (offset < size) {
        if (++chunks > MAX_CHUNKS) throw invalid(path, 'too many GLB chunks')
        const chunk = read(offset, 8), length = chunk.readUInt32LE(0), type = chunk.readUInt32LE(4)
        if (length % 4 || offset + 8 + length > size) throw invalid(path, 'invalid GLB chunk length')
        if (chunks === 1 && type !== 0x4e4f534a) throw invalid(path, 'first GLB chunk must be JSON')
        if (type === 0x4e4f534a) {
          if (bytes || length > MAX_JSON_BYTES) throw invalid(path, 'invalid or oversized GLB JSON metadata')
          bytes = read(offset + 8, length)
        }
        if (type === 0x004e4942) {
          if (binaryChunk) throw invalid(path, 'duplicate GLB binary chunk')
          binaryChunk = { offset: offset + 8, length }
        }
        offset += 8 + length
      }
      if (!bytes) throw invalid(path, 'GLB JSON metadata is missing')
    }
    let value
    try { value = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)) }
    catch { throw invalid(path, 'invalid JSON metadata') }
    if (!value || typeof value !== 'object' || Array.isArray(value) || value.asset?.version !== '2.0') {
      throw invalid(path, 'expected glTF 2.0 metadata')
    }
    return { value, binaryChunk }
  } finally { closeSync(fd) }
}

const metadata = (root, path) => readModelDocument(root, path).value

export function resolveModelResource(path, source) {
  if (typeof source !== 'string' || /[?#]/.test(source)) throw invalid(path, 'external dependency must be a local relative URI')
  let uri
  try { uri = decodeURIComponent(source) } catch { throw invalid(path, 'invalid dependency URI encoding') }
  if (!uri || uri.length > 2048 || /^[\/]|[\\:\x00-\x1f\x7f]/.test(uri)) {
    throw invalid(path, 'external dependency must be a local relative URI')
  }
  const dependency = posix.normalize(posix.join(posix.dirname(path), uri))
  if (!safeRelative(dependency)) throw invalid(path, 'dependency escapes the project')
  return dependency
}

function requiredExtensions(value, path) {
  const names = value.extensionsRequired === undefined ? [] : value.extensionsRequired
  if (!Array.isArray(names) || names.length > 64 || names.some(name => typeof name !== 'string' || !/^[A-Za-z][A-Za-z0-9_]{0,127}$/.test(name))) {
    throw invalid(path, 'invalid required extension list')
  }
  return [...new Set(names)].sort()
}

export function modelRequiredExtensions(root, path) {
  return isModelResourcePath(path) ? requiredExtensions(metadata(root, path), path) : []
}

// This exact importer rejection was reproduced in the GameDev trials. Unknown
// or newer engines keep their normal importer; never infer universal support.
export function assertModelImportCompatibility(root, paths, engineVersion) {
  if (engineVersion !== '4.7.2.stable.official.ed1daf0bf') return
  const failures = []
  for (const path of paths.filter(isModelResourcePath)) {
    if (modelRequiredExtensions(root, path).includes('KHR_mesh_quantization')) failures.push(path)
  }
  if (failures.length) {
    throw invalid(failures.slice(0, 8).join(', '), `Godot ${engineVersion} does not support required KHR_mesh_quantization (${failures.length} model(s)); select an unquantized catalog member or use procedural geometry before importing`)
  }
}

/** Current local dependencies; receipt membership alone does not prove runtime use. */
export function modelResourceDependencies(root, path) {
  if (!isModelResourcePath(path)) return []
  const value = metadata(root, path), dependencies = new Set()
  let references = 0
  for (const field of ['images', 'buffers']) {
    if (value[field] === undefined) continue
    if (!Array.isArray(value[field]) || value[field].length > MAX_REFERENCES) throw invalid(path, 'invalid dependency list')
    for (const item of value[field]) {
      if (++references > MAX_REFERENCES) throw invalid(path, 'too many dependencies')
      if (!item || typeof item !== 'object' || Array.isArray(item)) throw invalid(path, 'invalid dependency entry')
      if (item.uri === undefined) continue // GLB BIN chunk or embedded bufferView.
      if (typeof item.uri !== 'string') throw invalid(path, 'invalid dependency URI')
      if (item.uri.startsWith('data:')) continue
      // Query/fragment delimiters are URI syntax only before decoding. Encoded
      // delimiters can belong to a local filename, as in texture%231.png.
      const dependency = resolveModelResource(path, item.uri)
      try { regularFile(root, dependency) }
      catch (error) {
        if (error.code === 'ENOENT') throw invalid(path, `missing dependency ${dependency}`)
        throw error
      }
      dependencies.add(dependency)
    }
  }
  return [...dependencies].sort()
}
