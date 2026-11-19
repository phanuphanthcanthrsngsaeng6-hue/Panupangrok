// Browser log capture for the game preview. The Vite templates get this from
// their debug collector plugin; without Vite the dev server does the same three
// jobs itself: serve the collector, inject it, and persist what it posts back.
// The collector is the same vendored script the web templates ship.
import { appendFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const COLLECTOR_URL = '/__manus__/debug-collector.js'
const LOGS_URL = '/__manus__/logs'
const COLLECTOR_FILE = fileURLToPath(new URL('../__manus__/debug-collector.js', import.meta.url))
const LOG_DIR = '.manus-logs'
const MAX_LOG_SIZE_BYTES = 1024 * 1024
const TRIM_TARGET_BYTES = Math.floor(MAX_LOG_SIZE_BYTES * 0.6)
const MAX_POST_BYTES = 256 * 1024
const MAX_ENTRIES_PER_SOURCE = 500
// Payload key → log file, matching the Vite templates' contract.
const LOG_SOURCES = {
  consoleLogs: 'browserConsole',
  networkRequests: 'networkRequests',
  sessionEvents: 'sessionReplay',
}

export { COLLECTOR_URL, LOGS_URL }

let collectorCache = null

function readCollector() {
  if (collectorCache !== null) return collectorCache
  try {
    collectorCache = readFileSync(COLLECTOR_FILE, 'utf8')
  } catch {
    collectorCache = ''
  }
  return collectorCache
}

export function collectorAvailable() {
  return readCollector() !== ''
}

export function serveCollector(res) {
  const body = readCollector()
  if (!body) {
    res.writeHead(404, { 'Cache-Control': 'no-store' }).end('debug collector unavailable')
    return
  }
  res.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-store' })
  res.end(body)
}

// Response-only: dist/index.html stays untouched, so the published shell
// assembled from it can never carry the collector.
export function injectCollectorTag(html) {
  if (!collectorAvailable() || html.includes(COLLECTOR_URL)) return html
  const tag = `<script src="${COLLECTOR_URL}" defer></script>`
  if (html.includes('</head>')) return html.replace('</head>', `${tag}\n</head>`)
  if (html.includes('<script')) return html.replace('<script', `${tag}\n<script`)
  return `${tag}\n${html}`
}

function trimLogFile(logPath) {
  try {
    if (statSync(logPath).size <= MAX_LOG_SIZE_BYTES) return
    const lines = readFileSync(logPath, 'utf8').split('\n')
    const kept = []
    let bytes = 0
    for (let i = lines.length - 1; i >= 0; i--) {
      const lineBytes = Buffer.byteLength(`${lines[i]}\n`, 'utf8')
      if (bytes + lineBytes > TRIM_TARGET_BYTES) break
      kept.unshift(lines[i])
      bytes += lineBytes
    }
    writeFileSync(logPath, `${kept.join('\n')}\n`, 'utf8')
  } catch {
    /* best effort */
  }
}

function writeEntries(root, source, entries) {
  const dir = join(root, LOG_DIR)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  const logPath = join(dir, `${source}.log`)
  const lines = entries
    .slice(0, MAX_ENTRIES_PER_SOURCE)
    .map((entry) => `[${new Date().toISOString()}] ${JSON.stringify(entry)}`)
  appendFileSync(logPath, `${lines.join('\n')}\n`, 'utf8')
  trimLogFile(logPath)
}

export function handleLogPost(req, res, root = process.cwd()) {
  // Buffer the chunks and decode once: a multi-byte character split across two
  // chunks would otherwise be mangled and drop the whole batch.
  const chunks = []
  let bytes = 0
  let rejected = false
  req.on('data', (chunk) => {
    if (rejected) return
    bytes += chunk.length
    if (bytes > MAX_POST_BYTES) {
      rejected = true
      chunks.length = 0
      res.writeHead(413, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ success: false, error: 'payload too large' }))
      return
    }
    chunks.push(chunk)
  })
  req.on('end', () => {
    if (rejected) return
    try {
      const payload = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
      for (const [key, source] of Object.entries(LOG_SOURCES)) {
        const entries = payload[key]
        if (Array.isArray(entries) && entries.length) writeEntries(root, source, entries)
      }
      res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ success: true }))
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ success: false, error: String(err?.message || err) }))
    }
  })
}
