import { closeSync, constants, fstatSync, openSync, readSync, realpathSync } from 'node:fs'
import { extname, join } from 'node:path'
import { readAssetsManifest } from './local-artifacts.mjs'

export const GAME_ASSET_PATH = '/__manus__/game-asset'
const MAX_BYTES = 32 * 1024 * 1024
const MIME = {
  '.glb': 'model/gltf-binary',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.gif': 'image/gif', '.bmp': 'image/bmp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.wav': 'audio/wav', '.ogg': 'audio/ogg', '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.ttf': 'font/ttf', '.otf': 'font/otf',
  '.woff': 'font/woff', '.woff2': 'font/woff2',
}

export function serveGameAsset(root, req, res) {
  let fd
  const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "sandbox; default-src 'none'" }
  try {
    const path = new URL(req.url, 'http://127.0.0.1').searchParams.get('path')
    if (!path || path.length > 2048 || !path.startsWith('assets/') || path.includes('\\') || path.split('/').some(part => !part || part === '.' || part === '..') || /[\u0000-\u001f\u007f]/.test(path)) {
      res.writeHead(400, headers).end('Invalid asset path')
      return
    }
    if (!Object.hasOwn(readAssetsManifest(root).assets, path)) {
      res.writeHead(404, headers).end('Asset unavailable')
      return
    }
    const file = join(realpathSync(root), path)
    if (realpathSync(file) !== file) throw new Error('symlink asset')
    fd = openSync(file, constants.O_RDONLY | (constants.O_NOFOLLOW || 0))
    const info = fstatSync(fd)
    if (!info.isFile()) throw new Error('nonregular asset')
    if (info.size > MAX_BYTES) {
      res.writeHead(413, headers).end('Asset too large')
      return
    }
    // A concurrently rewritten source asset cannot make this allocation unbounded.
    const buffer = Buffer.allocUnsafe(info.size + 1)
    let length = 0
    while (length < buffer.byteLength) {
      const count = readSync(fd, buffer, length, buffer.byteLength - length, length)
      if (count === 0) break
      length += count
    }
    if (length !== info.size) throw new Error('asset changed during read')
    const bytes = buffer.subarray(0, length)
    res.writeHead(200, { ...headers, 'Content-Type': MIME[extname(path).toLowerCase()] || 'application/octet-stream', 'Content-Length': bytes.byteLength })
    res.end(req.method === 'HEAD' ? undefined : bytes)
  } catch { res.writeHead(404, headers).end('Asset unavailable') }
  finally { if (fd !== undefined) closeSync(fd) }
}
