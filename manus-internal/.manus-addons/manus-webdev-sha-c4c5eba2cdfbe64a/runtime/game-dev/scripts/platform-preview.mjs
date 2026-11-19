import { storageConfig } from './storage.mjs'
import { readAssetsManifest } from './local-artifacts.mjs'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
// Published sites serve /manus-storage/<key> natively; mirroring it here keeps
// the published shell behaving identically in the dev preview.
function loadStorageApiConfig() {
  try { return storageConfig() } catch { return { url: '', key: '' } }
}

export async function handleStorageProxy(req, res, urlPath) {
  const storageKey = urlPath.replace(/^\/manus-storage\//, '')
  const { url, key } = loadStorageApiConfig()
  if (!storageKey || !storagePathBelongsToProject(urlPath)) {
    res.writeHead(403, { 'Cache-Control': 'no-store' }).end('Forbidden')
    return
  }
  if (!url || !key) {
    res.writeHead(502, { 'Cache-Control': 'no-store' }).end('Storage proxy not configured')
    return
  }
  try {
    const presign = new URL('v1/storage/presign/get', url + '/')
    presign.searchParams.set('path', storageKey)
    const r = await fetch(presign, { headers: { Authorization: `Bearer ${key}` } })
    if (!r.ok) {
      res.writeHead(502, { 'Cache-Control': 'no-store' }).end(`Storage backend error (${r.status})`)
      return
    }
    const { url: signed } = await r.json()
    if (!signed) {
      res.writeHead(502, { 'Cache-Control': 'no-store' }).end('Empty signed URL from backend')
      return
    }
    res.writeHead(307, { Location: signed, 'Cache-Control': 'no-store' }).end()
  } catch (err) {
    res.writeHead(502, { 'Cache-Control': 'no-store' }).end(`Storage proxy error: ${err?.message || err}`)
  }
}

function storagePathBelongsToProject(urlPath) {
  const paths = new Set()
  try {
    for (const entry of Object.values(readAssetsManifest(process.cwd()).assets)) {
      if (entry.path.startsWith('/manus-storage/')) paths.add(entry.path)
    }
  } catch {
    return false
  }
  try {
    const state = JSON.parse(readFileSync(join(process.cwd(), '.manus-artifacts.json'), 'utf8'))
    for (const key of ['pck_url', 'wasm_url']) {
      if (typeof state[key] === 'string' && state[key].startsWith('/manus-storage/')) paths.add(state[key])
    }
  } catch {}
  return paths.has(urlPath)
}
