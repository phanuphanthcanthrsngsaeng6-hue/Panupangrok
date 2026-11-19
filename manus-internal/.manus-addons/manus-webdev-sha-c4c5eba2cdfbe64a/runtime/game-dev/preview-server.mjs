import { pruneAbandonedSnapshots } from './scripts/build-snapshot.mjs'
import { loadingFontFamily, loadingFontStyle } from './scripts/loading-fonts.mjs'
import { injectEngineReadiness, injectPreviewReadiness } from './scripts/preview-readiness.mjs'
// Resident Game preview. Explicit builds activate immutable output generations;
// edits and release preparation cannot replace files used by an already-running game.
import { spawn } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { GENERATION, PREVIEW_PATH, PREVIEW_STATUS_PATH, previewDirectory, readCurrentPreview, retainPreviewGeneration, prunePreviewHistory, pinPreviewStream } from './scripts/preview-state.mjs'
import { startPreviewControl } from './scripts/preview-control.mjs'
import { GAME_ASSET_PATH, serveGameAsset } from './scripts/preview-assets.mjs'
import {
  createReadStream,
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  statSync,
} from 'node:fs'
import { createServer } from 'node:http'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  COLLECTOR_URL,
  LOGS_URL,
  handleLogPost,
  injectCollectorTag,
  serveCollector,
} from './scripts/debug-logs.mjs'
import {
  ensureDistDirectory,
  missingAssets,
  releaseExportLock,
  tryAcquireExportLock,
} from './scripts/local-artifacts.mjs'
import { decodeUrlPath, resolveDistFile } from './scripts/server-paths.mjs'
import { MULTIPLAYER_CONFIG_PATH, serveMultiplayerConfig } from './scripts/multiplayer-config.mjs'
import { previewResourceId } from './scripts/project-identity.mjs'
import { restoreBundledProjectFonts } from './scripts/restore-bundled-fonts.mjs'

export async function startGamePreview({ standalonePreview = false, hydrateScript = null, storageProxy = null } = {}) {
  const PORT = Number(process.env.PORT || 3000)
  const HOST = process.env.HOST || (standalonePreview ? '127.0.0.1' : '0.0.0.0')
  if (!['0.0.0.0', '127.0.0.1', '::1'].includes(HOST)) throw new Error('Game preview HOST must be a supported local bind address')
  const DIST = ensureDistDirectory(process.cwd())
  const BUILD_SCRIPT = fileURLToPath(new URL('./scripts/build-preview-snapshot.mjs', import.meta.url))
  const HYDRATION_CHILD_TIMEOUT_MS = 245_000 // CLI owns the 240s transfer budget.
  const EXPORT_TIMEOUT_MS = 15 * 60_000 // Same export ceiling as checkpoint artifacts.
  // Capture the materialized project's identity at startup, never from a request.
  // A shared local Sandbox can still have another project's listener on this port.
  const resourceId = await previewResourceId(process.cwd())

  const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.wasm': 'application/wasm',
    '.pck': 'application/octet-stream',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.mp3': 'audio/mpeg',
    '.txt': 'text/plain; charset=utf-8',
  }

  let currentPreview = readCurrentPreview(process.cwd())
  const retentionTimer = setInterval(() => {
    if (!tryAcquireExportLock(process.cwd())) return
    try { pruneAbandonedSnapshots(process.cwd()); prunePreviewHistory(process.cwd()) } catch { /* Retry on the next maintenance tick. */ }
    finally { releaseExportLock(process.cwd()) }
  }, 60_000)
  retentionTimer.unref()
  let previewPointerStamp = ''
  function refreshCurrentPreview() {
    try {
      if (existsSync(join(DIST, '.site-install.json'))) return
      const info = statSync(join(previewDirectory(process.cwd()), 'current.json'))
      const stamp = `${info.mtimeMs}:${info.size}:${info.ino}`
      if (stamp !== previewPointerStamp) {
        const next = readCurrentPreview(process.cwd())
        if (next) currentPreview = next
        previewPointerStamp = stamp
      }
    } catch { /* Keep the last verified generation through failed preparations. */ }
  }
  let exportState = currentPreview ? 'ready' : 'waiting' // Candidate state; a good generation remains playable.
  let buildId = null
  let preparationStarted = 0
  let stopControl = null
  let activeChild = null
  let scheduledWork = null
  let stopping = false
  let shutdownExitCode = 0
  let ownsExportLock = false
  const exportLog = []
  function logExport(line) {
    process.stdout.write(line.endsWith('\n') ? line : line + '\n')
    for (const l of line.split('\n')) {
      if (l.trim()) exportLog.push(l)
    }
    while (exportLog.length > 60) exportLog.shift()
  }

  function previewStatus() {
    refreshCurrentPreview()
    return { version: 1, resourceId, phase: currentPreview ? 'ready' : exportState, generation: currentPreview?.generation || null, buildId, buildPhase: exportState }
  }

  function runExport() {
    if (stopping || exportState === 'exporting') return
    buildId = randomBytes(16).toString('hex')
    preparationStarted = performance.now()
    exportState = 'exporting'
    exportLog.length = 0
    mkdirSync(DIST, { recursive: true })
    startExportWhenLockFree()
  }

  // A single owned preparation child at a time; close confirms its pipes and
  // process have stopped before another phase begins or the lock is released.
  function runPreparationChild(command, args, timeoutMs, complete) {
    const started = performance.now()
    const child = spawn(command, args, { cwd: process.cwd(), detached: process.platform !== 'win32' })
    let failure = ''
    let output = ''
    let forceStop = null
    const stop = () => {
      const kill = signal => {
        try {
          if (process.platform !== 'win32' && child.pid) process.kill(-child.pid, signal)
          else child.kill(signal)
        } catch (error) { if (error.code !== 'ESRCH') throw error }
      }
      kill('SIGTERM')
      forceStop ??= setTimeout(() => kill('SIGKILL'), 5000)
    }
    activeChild = { stop }
    const timer = setTimeout(() => {
      failure = `${command} exceeded its preparation time budget`
      stop()
    }, timeoutMs)
    child.stdout.on('data', (d) => { output = (output + d.toString()).slice(-4096); logExport(d.toString()) })
    child.stderr.on('data', (d) => logExport(d.toString()))
    child.on('error', (err) => { failure = `could not launch ${command}: ${err.code || 'spawn error'}` })
    child.on('close', (code, signal) => {
      clearTimeout(timer)
      clearTimeout(forceStop)
      activeChild = null
      logExport(`[preparation] ${command} finished in ${((performance.now() - started) / 1000).toFixed(2)}s`)
      if (stopping) return finishShutdown()
      complete(failure || (code !== 0 ? `${command} exited with ${signal || `code ${code}`}` : ''), output.trim(), code)
    })
  }

  function releasePreparationLock() {
    releaseExportLock(process.cwd())
    ownsExportLock = false
  }

  function finishShutdown() {
    releasePreparationLock()
    stopControl?.()
    server.closeAllConnections()
    process.exit(shutdownExitCode)
  }

  function shutdown() {
    if (stopping) return
    stopping = true
    clearTimeout(scheduledWork)
    clearInterval(retentionTimer)
    server.close()
    if (activeChild) activeChild.stop()
    else finishShutdown()
  }
  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)

  // Release preparation takes the same lock; concurrent godot runs would
  // produce torn builds.
  function startExportWhenLockFree() {
    if (stopping) return
    if (!tryAcquireExportLock(process.cwd())) {
      if (performance.now() - preparationStarted >= 16 * 60_000) {
        finishExportFailure('timed out waiting for another export; retry the preview build later')
        return
      }
      logExport('[export] another export is in flight — waiting for it to finish')
      scheduledWork = setTimeout(startExportWhenLockFree, 2000)
      return
    }
    ownsExportLock = true
    startAssetPreparation()
  }

  function startAssetPreparation() {
    let missing
    try {
      restoreBundledProjectFonts(process.cwd())
      missing = missingAssets(process.cwd())
    } catch (err) {
      finishExportWithAssetFailure(err.message)
      return
    }
    if (missing.length) {
      if (!hydrateScript) {
        finishExportWithAssetFailure('Missing local assets: ' + missing.slice(0, 5).join(', ') + '. Restore assets through the platform asset workflow before building again.')
        return
      }
      logExport('[assets] restoring assets recorded in assets.lock.json...')
      runPreparationChild(process.execPath, [hydrateScript], HYDRATION_CHILD_TIMEOUT_MS, (error) => {
        if (error) finishExportWithAssetFailure(`asset restore failed: ${error}`)
        else startExportAfterHydration(1)
      })
      return
    }
    startExportAfterHydration(1)
  }

  function finishExportWithAssetFailure(detail) {
    exportState = 'failed'
    releasePreparationLock()
    logExport(`[export] refusing to export: ${detail}`)
    logExport('[export] restore the reported assets or fix storage access, then run npm run preview:build again; do not delete manifest entries to bypass a failure')
  }

  function finishExportFailure(detail) {
    exportState = 'failed'
    releasePreparationLock()
    logExport(`[export] ${detail}`)
  }

  // Runs with the export lock already held. File copying and Godot execute in a
  // bounded child, so a running game keeps serving while a new snapshot builds.
  function startExportAfterHydration() {
    if (stopping) return
    runPreparationChild(process.execPath, [BUILD_SCRIPT, ...(standalonePreview ? ['--standalone'] : [])], EXPORT_TIMEOUT_MS * 3, (error, _output, code) => {
      if (error) return finishExportFailure(error)
      currentPreview = readCurrentPreview(process.cwd())
      if (!currentPreview) return finishExportFailure('snapshot build produced no valid preview')
      exportState = 'ready'
      logExport('[export] done — game snapshot is ready')
      logExport(`[preparation] preview ready in ${((performance.now() - preparationStarted) / 1000).toFixed(2)}s`)
      releasePreparationLock()
    })
  }


  function placeholderPage() {
    const title = exportState === 'failed' ? 'Game preview could not be prepared' : 'Preparing your game…'
    const tail = exportLog.slice(-25).join('\n').replace(/&/g, '&amp;').replace(/</g, '&lt;')
    return `<!doctype html><html><head><meta charset="utf-8"><meta name="manus-game-loading-screen" content="1"><title>${title}</title>
  <style>${loadingFontStyle}
  body{font-family:${loadingFontFamily};background:#111;color:#ddd;padding:2rem;max-width:60rem;margin:auto}
  h1{font-size:1.1rem}pre{font-family:inherit;white-space:pre-wrap;background:#000;padding:1rem;border-radius:8px;font-size:.8rem}</style>
  </head><body><h1>${title}</h1><p>${
      exportState === 'failed'
        ? 'The Godot web export failed. Fix the errors below and run preview-build.mjs to retry.'
        : 'Your game preview will appear when it is ready.'
    }</p>${exportState === 'failed' ? `<pre>${tail}</pre>` : ''}</body></html>`
  }

  const server = createServer((req, res) => {
    let urlPath = decodeUrlPath(req.url)
    if (urlPath === null) {
      res.writeHead(400, { 'Cache-Control': 'no-store' }).end('Bad request')
      return
    }
    if (urlPath.startsWith('/api/')) {
      res.writeHead(503, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      }).end(JSON.stringify({ error: 'online_preview_requires_checkpoint' }))
      return
    }
    if (urlPath === PREVIEW_STATUS_PATH && ['GET', 'HEAD'].includes(req.method)) {
      const generation = new URL(req.url, 'http://localhost').searchParams.get('generation')
      if (generation && GENERATION.test(generation)) {
        try { retainPreviewGeneration(process.cwd(), generation) } catch { /* Status stays readable under storage pressure. */ }
      }
      // The Local dashboard checks this public, credential-free identity before
      // navigating its cross-origin iframe. Keep CORS scoped to this read surface.
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' })
      res.end(req.method === 'HEAD' ? undefined : JSON.stringify(previewStatus()))
      return
    }
    if (urlPath === GAME_ASSET_PATH && ['GET', 'HEAD'].includes(req.method)) {
      serveGameAsset(process.cwd(), req, res)
      return
    }
    if (urlPath === MULTIPLAYER_CONFIG_PATH && ['GET', 'HEAD'].includes(req.method)) {
      serveMultiplayerConfig(process.cwd(), req, res)
      return
    }
    if (urlPath.startsWith('/manus-storage/')) {
      if (storageProxy) void storageProxy(req, res, urlPath)
      else res.writeHead(404, { 'Cache-Control': 'no-store' }).end('Platform storage is not available in standalone preview')
      return
    }
    if (urlPath === COLLECTOR_URL) {
      serveCollector(res)
      return
    }
    if (urlPath === LOGS_URL && req.method === 'POST') {
      handleLogPost(req, res)
      return
    }
    refreshCurrentPreview()
    if (!currentPreview && !urlPath.startsWith(PREVIEW_PATH)) {
      const status = exportState === 'failed' ? 500 : 503
      const acceptsHtml = req.headers.accept?.includes('text/html')
      if (urlPath === '/' || urlPath === '/index.html' || acceptsHtml) {
        const body = injectPreviewReadiness(placeholderPage(), 'pending', resourceId)
        // The Cloud preview ingress replaces 5xx bodies. Deliver this managed
        // document successfully so its status bridge and retry polling survive.
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Length': Buffer.byteLength(body),
          'Cache-Control': 'no-store',
        })
        res.end(body)
      } else {
        res
          .writeHead(status, { 'Cache-Control': 'no-store' })
          .end('Game export is not ready')
      }
      return
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405).end('Method not allowed')
      return
    }
    // Relative redirects preserve the preview ingress prefix used by Cloud and Local.
    if (urlPath === '/' || urlPath === '/index.html') {
      const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''
      res.writeHead(302, { Location: `.${PREVIEW_PATH}${currentPreview.generation}/index.html${query}`, 'Cache-Control': 'no-store' }).end()
      return
    }
    const match = urlPath.match(/^\/__manus__\/game-preview\/([a-f0-9]{64})\/(.*)$/)
    if (!match || !GENERATION.test(match[1]) || match[2].split('/').some(part => part === '..' || part.startsWith('.'))) {
      res.writeHead(404, { 'Cache-Control': 'no-store' }).end('Not found')
      return
    }
    let retained
    try { retained = retainPreviewGeneration(process.cwd(), match[1]) } catch { retained = null }
    if (retained === null) {
      res.writeHead(503, { 'Cache-Control': 'no-store', 'Retry-After': '1' }).end('Preview maintenance is in progress; retry shortly')
      return
    }
    if (!retained) {
      if (match[2] === 'index.html' && currentPreview) {
        res.writeHead(302, { Location: `../${currentPreview.generation}/index.html`, 'Cache-Control': 'no-store' }).end()
      } else res.writeHead(410, { 'Cache-Control': 'no-store' }).end('Preview generation expired; reload the current preview')
      return
    }
    const snapshot = join(previewDirectory(process.cwd()), 'builds', match[1])
    urlPath = '/' + match[2]
    let filePath = resolveDistFile(snapshot, urlPath)
    if (!filePath) {
      res.writeHead(403).end('Forbidden')
      return
    }
    let stat
    try {
      stat = statSync(filePath)
      if (stat.isDirectory()) {
        filePath = join(filePath, 'index.html')
        stat = statSync(filePath)
      }
      if (!stat.isFile() || realpathSync(filePath) !== filePath) stat = undefined
    } catch {
      stat = undefined
    }
    if (!stat) {
      res.writeHead(404, { 'Cache-Control': 'no-store' }).end('Not found')
      return
    }
    const ext = extname(filePath).toLowerCase()
    // Preview instrumentation stays out of exported files and published shells.
    if (ext === '.html' || filePath === join(snapshot, 'index.js')) {
      const source = readFileSync(filePath, 'utf8')
      const body = ext === '.html'
        ? injectPreviewReadiness(injectCollectorTag(source), filePath === join(snapshot, 'index.html') ? match[1] : undefined, resourceId)
        : injectEngineReadiness(source)
      res.writeHead(200, {
        'Content-Type': MIME[ext],
        'Content-Length': Buffer.byteLength(body),
        'Cache-Control': 'no-store',
      })
      res.end(body)
      return
    }
    let unpin
    try { unpin = pinPreviewStream(process.cwd(), match[1]) } catch {}
    if (!unpin) {
      res.writeHead(503, { 'Cache-Control': 'no-store', 'Retry-After': '1' }).end('Preview maintenance is in progress; retry shortly')
      return
    }
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Content-Length': stat.size,
      'Cache-Control': 'no-store',
    })
    const stream = createReadStream(filePath)
    res.once('close', () => stream.destroy())
    stream.once('error', () => res.destroy())
    stream.once('close', unpin)
    stream.pipe(res)
  })

  try {
    stopControl = await startPreviewControl(process.cwd(), previewStatus, runExport)
    server.on('error', error => { console.error(`[game-preview] listener failed: ${error.code || 'error'}`); shutdownExitCode = 1; shutdown() })
    server.listen(PORT, HOST, () => {
      console.log(`Serving on http://${HOST === '::1' ? '[::1]' : HOST}:${server.address().port}`)
    })
  } catch (error) {
    console.error(`[game-preview] ${error.message === 'a game preview server is already running for this project' ? error.message : 'could not start preview control'}`)
    process.exitCode = 1
  }

}
