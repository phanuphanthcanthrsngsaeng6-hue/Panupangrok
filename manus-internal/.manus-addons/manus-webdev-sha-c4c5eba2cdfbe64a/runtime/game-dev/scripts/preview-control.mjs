import { randomBytes, timingSafeEqual } from 'node:crypto'
import { lstatSync, readFileSync, realpathSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { join } from 'node:path'
import { previewDirectory } from './preview-state.mjs'

function readControl(root) {
  const file = join(previewDirectory(root), 'control.json')
  const info = lstatSync(file)
  if (!info.isFile() || info.isSymbolicLink()) throw new Error('invalid preview control state')
  const state = JSON.parse(readFileSync(file, 'utf8'))
  if (state.version !== 1 || state.project !== realpathSync(root) || !Number.isInteger(state.pid) || state.pid <= 0 ||
      !Number.isInteger(state.port) || state.port < 1 || state.port > 65535 || !/^[a-f0-9]{64}$/.test(state.token)) {
    throw new Error('invalid preview control state')
  }
  process.kill(state.pid, 0)
  return state
}

async function request(state, path, method = 'GET') {
  const response = await fetch(`http://127.0.0.1:${state.port}${path}`, {
    method, headers: { Authorization: `Bearer ${state.token}` }, redirect: 'error', signal: AbortSignal.timeout(10_000),
  })
  if (!response.ok) throw new Error('preview server rejected the request')
  const result = await response.json()
  if (result.pid !== state.pid) throw new Error('preview server identity changed')
  return result.status
}

export async function readPreviewStatus(root) { return request(readControl(root), '/status') }

export async function requestPreviewBuild(root) {
  const state = readControl(root)
  return { state, status: await request(state, '/build', 'POST'), poll: () => request(state, '/status') }
}

export async function startPreviewControl(root, status, build) {
  const directory = previewDirectory(root)
  const lock = join(directory, 'server.lock')
  const claimed = () => writeFileSync(lock, String(process.pid), { flag: 'wx', mode: 0o600 })
  try { claimed() } catch (error) {
    if (error.code !== 'EEXIST') throw error
    const info = lstatSync(lock)
    if (!info.isFile() || info.isSymbolicLink()) throw new Error('invalid preview server lock')
    const pid = Number(readFileSync(lock, 'utf8'))
    if (!Number.isInteger(pid) || pid <= 0) throw new Error('invalid preview server lock')
    try {
      process.kill(pid, 0)
      throw new Error('a game preview server is already running for this project')
    } catch (ownerError) { if (ownerError.code !== 'ESRCH') throw ownerError }
    rmSync(lock)
    claimed()
  }
  const releaseLock = () => { try { if (readFileSync(lock, 'utf8') === String(process.pid)) rmSync(lock) } catch {} }
  const token = randomBytes(32).toString('hex')
  const authorization = Buffer.from(`Bearer ${token}`)
  const server = createServer((req, res) => {
    const candidate = Buffer.from(req.headers.authorization || '')
    if (req.headers.origin || req.socket.remoteAddress !== '127.0.0.1' || candidate.length !== authorization.length || !timingSafeEqual(candidate, authorization)) {
      res.writeHead(403).end('Forbidden')
      return
    }
    if (req.method === 'GET' && req.url === '/status') {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
      res.end(JSON.stringify({ pid: process.pid, status: status() }))
    } else if (req.method === 'POST' && req.url === '/build' && !req.headers['transfer-encoding'] && (!req.headers['content-length'] || req.headers['content-length'] === '0')) {
      build()
      res.writeHead(202, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
      res.end(JSON.stringify({ pid: process.pid, status: status() }))
    } else res.writeHead(405).end('Method not allowed')
  })
  try {
    await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve) })
  } catch (error) { releaseLock(); throw error }
  const file = join(directory, 'control.json')
  const temporary = join(directory, `.control-${token.slice(0, 16)}.tmp`)
  try {
    writeFileSync(temporary, JSON.stringify({ version: 1, project: realpathSync(root), pid: process.pid, port: server.address().port, token }), { mode: 0o600, flag: 'wx' })
    renameSync(temporary, file)
  } catch (error) { server.close(); releaseLock(); throw error }
  finally { rmSync(temporary, { force: true }) }
  return () => {
    try { if (readControl(root).token === token) rmSync(file) } catch {}
    releaseLock()
    server.closeAllConnections()
    server.close()
  }
}
