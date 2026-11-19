import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

export const MULTIPLAYER_CONFIG_PATH = '/multiplayer/bootstrap.json'

// Only public deployment configuration crosses this boundary. TURN credentials
// remain in the room service and are issued after room authentication.
export function multiplayerConfig(root, { env = process.env, publish = false } = {}) {
  const source = join(root, 'multiplayer', 'config.json')
  if (!existsSync(source)) return null
  const config = JSON.parse(readFileSync(source, 'utf8'))
  if (typeof config.build !== 'string' || !/^[a-zA-Z0-9._-]{1,100}$/.test(config.build)) {
    throw new Error('Invalid multiplayer build identifier')
  }
  const signalingUrl = env.GAME_MULTIPLAYER_SIGNALING_URL || config.signalingUrl || ''
  const iceTransportPolicy = env.GAME_MULTIPLAYER_ICE_POLICY || config.iceTransportPolicy || 'all'
  if (!['all', 'relay'].includes(iceTransportPolicy)) throw new Error('Invalid multiplayer ICE policy')
  if (signalingUrl) {
    let url
    try { url = new URL(signalingUrl) } catch { throw new Error('Invalid multiplayer service endpoint') }
    const hostname = url.hostname.replace(/\.$/, '')
    const loopback = ['localhost', '[::1]', '[::]', '0.0.0.0'].includes(hostname) || hostname.endsWith('.localhost') || /^127\./.test(hostname)
    const local = url.protocol === 'ws:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
    if ((publish && loopback) || (url.protocol !== 'wss:' && (!local || publish)) || url.username || url.password || url.search || url.hash || url.pathname !== '/ws') {
      throw new Error('Multiplayer requires a public WSS /ws endpoint; loopback WS is only for local preview')
    }
  }
  return { version: 1, build: config.build, signalingUrl, iceTransportPolicy }
}

export function serveMultiplayerConfig(root, req, res, options) {
  let config
  try { config = multiplayerConfig(root, options) } catch {
    res.writeHead(503, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
    res.end(JSON.stringify({ error: 'multiplayer_unavailable' }))
    return
  }
  const body = JSON.stringify(config || { error: 'multiplayer_unavailable' })
  res.writeHead(config?.signalingUrl ? 200 : 503, {
    'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Content-Length': Buffer.byteLength(body),
  })
  res.end(req.method === 'HEAD' ? undefined : body)
}

export function publishMultiplayerConfig(root, site, options = {}) {
  const config = multiplayerConfig(root, { ...options, publish: true })
  if (!config) return
  mkdirSync(join(site, 'multiplayer'), { recursive: true })
  writeFileSync(join(site, MULTIPLAYER_CONFIG_PATH), JSON.stringify(config, null, 2) + '\n')
}
