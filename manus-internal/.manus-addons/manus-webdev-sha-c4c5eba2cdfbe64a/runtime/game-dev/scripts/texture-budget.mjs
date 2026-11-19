// Read stored image dimensions without decoding pixels or changing game assets.
import { closeSync, lstatSync, openSync, readSync, readdirSync, statSync } from 'node:fs'
import { extname, join } from 'node:path'
import { readModelDocument, resolveModelResource } from './model-dependencies.mjs'

const HEADER_BYTES = 65536
const MAX_METADATA = 8 * 1024 * 1024
const MAX_ENTRIES = 4096
const POLICY = 'game-texture-budgets.json'
const safePath = path => typeof path === 'string' && path.length > 0 && path.length <= 2048 &&
  !/[\\:\x00-\x1f\x7f]/.test(path) && path.split('/').every(part => part && part !== '.' && part !== '..')
const fail = message => { throw new Error(message) }
const integer = value => Number.isSafeInteger(value) && value >= 0

function localSource(root, path) {
  if (!safePath(path)) fail('unsafe project resource path')
  let target = root
  for (const part of path.split('/')) {
    target = join(target, part)
    if (lstatSync(target).isSymbolicLink()) fail('linked resources cannot be inspected')
  }
  const stat = lstatSync(target)
  if (!stat.isFile()) fail('resource is not a regular file')
  return {
    length: stat.size,
    read(offset, length) {
      if (!integer(offset) || !integer(length) || offset + length > stat.size || length > MAX_METADATA) fail('invalid resource range')
      const fd = openSync(target, 'r')
      try {
        const bytes = Buffer.alloc(length)
        if (readSync(fd, bytes, 0, length, offset) !== length) fail('resource changed while reading')
        return bytes
      } finally { closeSync(fd) }
    },
  }
}

function dataSource(uri) {
  const match = /^data:[^,]*;base64,([A-Za-z0-9+/]*={0,2})$/.exec(uri)
  if (!match || match[1].length % 4) fail('unsupported or malformed embedded data URI')
  const encoded = match[1]
  const length = encoded.length / 4 * 3 - (encoded.endsWith('==') ? 2 : encoded.endsWith('=') ? 1 : 0)
  return {
    length,
    read(offset, count) {
      if (!integer(offset) || !integer(count) || offset + count > length || count > HEADER_BYTES) fail('invalid embedded image range')
      const start = Math.floor(offset / 3)
      return Buffer.from(encoded.slice(start * 4, Math.ceil((offset + count) / 3) * 4), 'base64').subarray(offset - start * 3, offset - start * 3 + count)
    },
  }
}

// The fixed prefix bounds JPEG marker scanning even for malformed input.
export function imageDimensions(bytes) {
  let width, height
  if (bytes.length >= 24 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) &&
      bytes.toString('ascii', 12, 16) === 'IHDR') {
    width = bytes.readUInt32BE(16); height = bytes.readUInt32BE(20)
  } else if (bytes.length >= 30 && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') {
    const type = bytes.toString('ascii', 12, 16)
    if (type === 'VP8X') {
      width = 1 + bytes.readUIntLE(24, 3); height = 1 + bytes.readUIntLE(27, 3)
    } else if (type === 'VP8 ' && bytes.subarray(23, 26).equals(Buffer.from([157, 1, 42]))) {
      width = bytes.readUInt16LE(26) & 0x3fff; height = bytes.readUInt16LE(28) & 0x3fff
    } else if (type === 'VP8L' && bytes[20] === 47) {
      width = 1 + ((bytes[22] & 63) << 8 | bytes[21])
      height = 1 + ((bytes[24] & 15) << 10 | bytes[23] << 2 | bytes[22] >> 6)
    }
  } else if (bytes.length >= 4 && bytes[0] === 255 && bytes[1] === 216) {
    let offset = 2
    while (offset + 4 <= bytes.length) {
      if (bytes[offset++] !== 255) break
      while (bytes[offset] === 255) offset++
      const marker = bytes[offset++]
      if (marker === 217 || marker === 218) break
      if (marker === 1 || marker >= 208 && marker <= 215) continue
      if (offset + 2 > bytes.length) break
      const size = bytes.readUInt16BE(offset)
      if (size < 2 || offset + size > bytes.length) break
      if ([192, 193, 194, 195, 197, 198, 199, 201, 202, 203, 205, 206, 207].includes(marker) && size >= 8) {
        height = bytes.readUInt16BE(offset + 3); width = bytes.readUInt16BE(offset + 5); break
      }
      offset += size
    }
  } else if (bytes.length >= 32 && bytes.subarray(0, 12).equals(Buffer.from([171, 75, 84, 88, 32, 50, 48, 187, 13, 10, 26, 10]))) {
    width = bytes.readUInt32LE(20); height = bytes.readUInt32LE(24)
    if (bytes.readUInt32LE(28) > 1) fail('volume texture inspection is unsupported')
  }
  if (!width || !height) fail('unsupported image format or incomplete dimension header (64 KiB limit)')
  return { width, height }
}

function projectPaths(root, report) {
  const result = []
  let visited = 0
  const walk = (dir, prefix = '') => {
    for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)) {
      if (++visited > 20000) {
        report('.', 'project scan exceeds 20000 entries; use a frozen snapshot')
        return false
      }
      if (entry.name.startsWith('.') || !prefix && ['node_modules', 'dist', 'site', 'build', 'exports', 'test-output', 'game-captures'].includes(entry.name)) continue
      const path = prefix + entry.name
      if (entry.isSymbolicLink()) {
        let file = false
        // Classify by metadata only; never traverse linked directories or read linked files.
        try { file = statSync(join(dir, entry.name)).isFile() } catch {}
        if (file) result.push(path) // Candidate/resource-reference checks reject relevant file links.
        else report(path, 'linked resources cannot be inspected')
        continue
      }
      if (entry.isDirectory()) { if (walk(join(dir, entry.name), path + '/') === false) return false }
      else result.push(path)
    }
  }
  try { walk(root) } catch (error) { report('.', error) }
  return result.sort()
}

function readPolicy(root) {
  let source
  try { source = localSource(root, POLICY) }
  catch (error) { if (error.code === 'ENOENT') return {}; throw error }
  if (source.length > 256 * 1024) fail('texture budget policy exceeds 256 KiB')
  let value
  try { value = JSON.parse(source.read(0, source.length)) } catch { fail('invalid texture budget policy JSON') }
  if (value?.version !== 1 || !value.textures || typeof value.textures !== 'object' || Array.isArray(value.textures) ||
      Object.keys(value.textures).length > MAX_ENTRIES) fail('expected version 1 texture budget policy')
  for (const [key, budget] of Object.entries(value.textures)) {
    const path = key.replace(/#image\/\d+$/, '')
    if (!safePath(path) || !budget || ![256, 512, 1024, 2048, 4096].includes(budget.maxSize) ||
        budget.maxSize > 1024 && (typeof budget.reason !== 'string' || !budget.reason.trim() || budget.reason.length > 1000)) {
      fail('invalid texture budget entry: use a local path, supported size, and a reason above 1024')
    }
  }
  return value.textures
}

function modelImages(root, path) {
  const { value, binaryChunk } = readModelDocument(root, path)
  const images = value.images ?? [], buffers = value.buffers ?? [], views = value.bufferViews ?? []
  if (!Array.isArray(images) || images.length > MAX_ENTRIES || !Array.isArray(buffers) || !Array.isArray(views)) fail('invalid image or buffer list')
  const imageId = (image, index) => {
    // Invalid URIs are reported by source() without discarding sibling images.
    if (typeof image?.uri === 'string' && !image.uri.startsWith('data:')) {
      try { return resolveModelResource(path, image.uri) } catch {}
    }
    return path + '#image/' + index
  }
  return images.map((image, index) => ({
    id: imageId(image, index),
    owner: path,
    source() {
      if (!image || typeof image !== 'object') fail('invalid image entry')
      if (image.uri !== undefined) {
        if (typeof image.uri !== 'string') fail('invalid image URI')
        return image.uri.startsWith('data:') ? dataSource(image.uri) : localSource(root, resolveModelResource(path, image.uri))
      }
      if (!integer(image.bufferView)) fail('missing image resource')
      const view = views[image.bufferView]
      if (!view || !integer(view.buffer) || !integer(view.byteOffset ?? 0) || !integer(view.byteLength)) fail('invalid image buffer view')
      const buffer = buffers[view.buffer]
      if (!buffer || !integer(buffer.byteLength)) fail('invalid image buffer')
      let source
      if (typeof buffer.uri === 'string') {
        source = buffer.uri.startsWith('data:') ? dataSource(buffer.uri) : localSource(root, resolveModelResource(path, buffer.uri))
      } else if (buffer.uri === undefined && view.buffer === 0 && binaryChunk) {
        const file = localSource(root, path)
        source = { length: binaryChunk.length, read: (offset, count) => file.read(binaryChunk.offset + offset, count) }
      } else fail('missing image buffer resource')
      const offset = view.byteOffset ?? 0
      if (buffer.byteLength > source.length || offset + view.byteLength > buffer.byteLength) fail('image buffer view exceeds stored buffer')
      return { length: view.byteLength, read: (start, count) => source.read(offset + start, count) }
    },
  }))
}

function materialImages(root, path, report) {
  const source = localSource(root, path)
  if (source.length > MAX_METADATA) fail('Godot resource exceeds 8 MiB inspection limit')
  const content = source.read(0, source.length).toString('utf8')
  const resources = new Map(), images = [], shaders = new Map()
  for (const match of content.matchAll(/^\[ext_resource ([^\r\n]+)\]$/gm)) {
    const id = /\bid="([^"]+)"/.exec(match[1])?.[1], target = /\bpath="res:\/\/([^"]+)"/.exec(match[1])?.[1]
    if (id && target && /\btype="Texture2D"/.test(match[1])) resources.set(id, target)
    if (id && target && /\btype="Shader"/.test(match[1])) shaders.set(id, target)
  }
  const sections = content.split(/(?=^\[)/m)
  const shaderKind = section => {
    const shader = /^shader\s*=\s*(ExtResource|SubResource)\(\s*"([^"]+)"\s*\)/m.exec(section)
    let code = ''
    if (shader?.[1] === 'ExtResource' && shaders.has(shader[2])) {
      const source = localSource(root, shaders.get(shader[2]))
      if (source.length > MAX_METADATA) fail('shader exceeds 8 MiB inspection limit')
      code = source.read(0, source.length).toString('utf8')
    } else if (shader?.[1] === 'SubResource') {
      code = sections.find(part => /^\[sub_resource\b[^\r\n]*\btype="Shader"/.test(part) &&
        /\bid="([^"]+)"/.exec(part.split('\n', 1)[0])?.[1] === shader[2]) ?? ''
    }
    code = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\r\n]*/g, '')
    return /\bshader_type\s+(spatial|canvas_item|particles|sky|fog)\s*;/.exec(code)?.[1]
  }
  const rootIsMaterial = /^\[gd_resource\b[^\r\n]*\btype="(?:StandardMaterial3D|ORMMaterial3D)"/m.test(content)
  const rootIsShader = /^\[gd_resource\b[^\r\n]*\btype="ShaderMaterial"/m.test(content)
  let materialIndex = 0
  for (const section of sections) {
    const header = section.split('\n', 1)[0]
    const builtIn = /^\[sub_resource\b[^\r\n]*\btype="(?:StandardMaterial3D|ORMMaterial3D)"/.test(header) || rootIsMaterial && header.trim() === '[resource]'
    const shader = /^\[sub_resource\b[^\r\n]*\btype="ShaderMaterial"/.test(header) || rootIsShader && header.trim() === '[resource]'
    if (!builtIn && !shader) continue
    const materialPath = path + '#material/' + materialIndex++
    if (shader) {
      try {
        const kind = shaderKind(section)
        if (kind === 'canvas_item' || kind === 'particles') continue
        if (!kind) fail('ShaderMaterial type cannot be determined; inspect its textures manually')
      } catch (error) { report(materialPath, error); continue }
    }
    for (const match of section.matchAll(/^([\w/]+)\s*=\s*(ExtResource|SubResource)\(\s*"([^"]+)"\s*\)/gm)) {
      try {
        const textureProperty = /texture|^detail_(?:albedo|normal|mask)$/.test(match[1]) || shader && match[1].startsWith('shader_parameter/')
        if (match[2] === 'SubResource' && textureProperty) fail('nested material texture resource requires manual inspection')
        if (match[2] !== 'ExtResource') continue
        const id = resources.get(match[3])
        if (!id && textureProperty) fail('3D material texture reference cannot be resolved')
        if (!id) continue
        images.push({ id, owner: path, source: () => localSource(root, id) })
      } catch (error) { report(materialPath + '/' + match[1], error) }
    }
  }
  return images
}

export function inspectTextureBudgets(root, { paths } = {}) {
  const uninspected = [], reported = new Set(), found = new Map()
  const report = (path, error) => {
    const reason = typeof error === 'string' ? error : error.code === 'ENOENT' ? 'missing local resource' : error.message
    const key = JSON.stringify([path, reason])
    if (reported.has(key)) return
    if (uninspected.length >= 20000) {
      if (uninspected.length === 20000) uninspected.push({ path: '.', reason: 'project exceeds 20000 uninspected resource limit' })
      return
    }
    reported.add(key)
    uninspected.push({ path, reason })
  }
  let policy = {}
  try { policy = readPolicy(root) } catch (error) { report(POLICY, error) }
  try { paths ??= projectPaths(root, report) } catch (error) { report('.', error); paths = [] }
  if (paths.length > 20000) {
    report('.', 'project exceeds 20000 resource inspection limit')
    paths = paths.slice(0, 20000)
  }
  for (const path of paths) {
    const extension = extname(path).toLowerCase()
    if (!['.gltf', '.glb', '.tres', '.tscn', '.obj', '.fbx', '.blend', '.dae', '.res', '.scn', '.material', '.mesh'].includes(extension)) continue
    try {
      if (['.obj', '.fbx', '.blend', '.dae'].includes(extension)) fail('texture inspection for this model format is unsupported; verify its stored textures separately')
      if (['.res', '.scn', '.material', '.mesh'].includes(extension)) fail('binary Godot resource texture inspection is unsupported; verify its stored textures separately')
      const images = ['.glb', '.gltf'].includes(extension) ? modelImages(root, path) : materialImages(root, path, report)
      for (const image of images) {
        const maxSize = (policy[image.id] ?? policy[path])?.maxSize ?? 1024
        const previous = found.get(image.id)
        if (previous) { previous.maxSize = Math.max(previous.maxSize, maxSize); previous.owners.add(path); continue }
        if (found.size >= 20000) fail('project exceeds 20000 texture inspection limit')
        found.set(image.id, { ...image, maxSize, owners: new Set([path]) })
      }
    } catch (error) { report(path, error) }
  }
  const textures = []
  for (const image of found.values()) {
    try {
      const source = image.source()
      const dimensions = imageDimensions(source.read(0, Math.min(source.length, HEADER_BYTES)))
      textures.push({ path: image.id, owners: [...image.owners].sort(), ...dimensions, maxSize: image.maxSize })
    } catch (error) { report(image.id, error) }
  }
  textures.sort((a, b) => a.path.localeCompare(b.path))
  const oversized = textures.filter(image => Math.max(image.width, image.height) > image.maxSize)
  return { ok: !oversized.length && !uninspected.length, textures, oversized, uninspected }
}

export function warnTextureBudgets(root, { paths, warn = console.warn } = {}) {
  const report = inspectTextureBudgets(root, { paths })
  if (!report.ok) {
    const next = (report.oversized.length ? ' Resize oversized stored textures before delivery.' : '') +
      (report.uninspected.length ? ' Inspect uninspected resources manually.' : '')
    warn('[texture-budget] ' + report.oversized.length + ' oversized; ' + report.uninspected.length + ' uninspected.' + next + ' Run check-textures.mjs --strict for the full report.')
    for (const image of report.oversized.slice(0, 12)) warn('[texture-budget] ' + image.path + ': ' + image.width + '×' + image.height + ', budget ' + image.maxSize + ' px')
    for (const item of report.uninspected.slice(0, 12)) warn('[texture-budget] ' + item.path + ': ' + item.reason)
  }
  return report
}
