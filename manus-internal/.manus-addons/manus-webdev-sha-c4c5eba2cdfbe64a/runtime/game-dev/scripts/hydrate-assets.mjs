// On-demand preview restore. Checkpoint/publication retain their synchronous API.
import { spawn } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { existsSync, mkdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { setTimeout as delay } from 'node:timers/promises'
import { installAssetFile } from './install-asset.mjs'
import { bundledFontData } from './bundled-fonts.mjs'
import {
  MAX_ASSET_SIZE_BYTES,
  assetTypeOf,
  assetDownloadRequest,
  isSafeAssetRel,
  missingAssets,
  readAssetsManifest,
  verifyDownloadedAsset,
} from './artifacts-lib.mjs'

import { HYDRATION_TIMEOUT_MS, RESTORE_WORKERS as WORKERS, RESTORE_MAX_ATTEMPTS as MAX_ATTEMPTS, TRANSIENT_HTTP_CODES } from './asset-restore-policy.mjs'
export { HYDRATION_TIMEOUT_MS } from './asset-restore-policy.mjs'
const TRANSIENT_CURL_CODES = new Set([5, 6, 7, 16, 18, 28, 35, 52, 55, 56, 92])

// Wait for close, including cancellation, before allowing lock release or cleanup.
// Never expose curl's command/stderr: it may contain a signed URL or API key.
function runCurl(args, signal, deadline) {
  signal.throwIfAborted()
  const remaining = deadline - performance.now()
  if (remaining <= 0) throw new Error('asset restore exceeded its time budget')
  return new Promise((resolve, reject) => {
    const child = spawn('curl', [
      '-sS', '--fail', '--connect-timeout', String(Math.min(15, remaining / 1000)),
      '--max-time', String(Math.min(60, remaining / 1000)),
      '--write-out', '\n%{http_code}', ...args,
    ], { stdio: ['ignore', 'pipe', 'ignore'] })
    let output = ''
    let spawnError = false
    const cancel = () => child.kill('SIGKILL')
    signal.addEventListener('abort', cancel, { once: true })
    if (signal.aborted) cancel()
    const timer = setTimeout(cancel, Math.min(60_000, remaining))
    child.stdout.on('data', (data) => {
      // Presign JSON is small; bound unexpected output without retaining secrets.
      if (output.length + data.length > 1024 * 1024) cancel()
      else output += data.toString()
    })
    child.on('error', () => { spawnError = true })
    child.on('close', (code) => {
      clearTimeout(timer)
      signal.removeEventListener('abort', cancel)
      if (signal.aborted) return reject(signal.reason)
      const split = output.lastIndexOf('\n')
      const status = Number(output.slice(split + 1))
      if (code === 0 && status >= 200 && status < 300) {
        resolve(output.slice(0, split))
        return
      }
      const error = new Error(spawnError ? 'could not launch curl' : `download failed (HTTP ${status || 0}, curl ${code})`)
      error.retryable = !spawnError && (status >= 400
        ? TRANSIENT_HTTP_CODES.has(status)
        : TRANSIENT_CURL_CODES.has(code) || code === null)
      reject(error)
    })
  })
}

async function restoreAsset(root, rel, entry, signal, deadline, log) {
  if (!isSafeAssetRel(root, rel)) throw new Error(`invalid asset path: ${rel}`)
  const target = join(root, rel)
  if (existsSync(target)) return false
  signal.throwIfAborted()
  const bundled = bundledFontData(entry)
  const request = bundled ? null : assetDownloadRequest(entry, rel)
  mkdirSync(dirname(target), { recursive: true })
  const temporary = `${target}.${randomUUID()}.tmp`
  writeFileSync(temporary, '', { flag: 'wx' })
  try {
    for (let attempt = 1; ; attempt++) {
      signal.throwIfAborted()
      try {
        if (bundled) {
          writeFileSync(temporary, bundled)
        } else {
          let url = request.url
          if (request.presign) {
            const response = await runCurl([...request.headers, url], signal, deadline)
            try { url = JSON.parse(response).url } catch { throw new Error('invalid storage download response') }
            if (typeof url !== 'string' || !/^https?:\/\//.test(url)) throw new Error('empty or invalid storage download URL')
          }
          await runCurl([
            ...(request.presign ? ['-L'] : []),
            ...(assetTypeOf(rel) === 'font' ? [] : ['--max-filesize', String(MAX_ASSET_SIZE_BYTES)]),
            '-o', temporary, url,
          ], signal, deadline)
        }
        signal.throwIfAborted()
        verifyDownloadedAsset(temporary, entry, rel)
        if (!isSafeAssetRel(root, rel)) throw new Error(`invalid asset path: ${rel}`)
        // Installation cannot overwrite a local edit created during download.
        // Temp and target are adjacent for an atomic same-filesystem operation.
        try {
          await installAssetFile(temporary, target, signal)
        } catch (error) {
          if (error.code === 'EEXIST' && existsSync(target)) return false
          throw error
        }
        return true
      } catch (err) {
        if (signal.aborted || !err.retryable || attempt >= MAX_ATTEMPTS) throw err
        log(`[assets] retrying ${rel} (${attempt + 1}/${MAX_ATTEMPTS})`)
        await delay(250 * attempt, undefined, { signal })
      }
    }
  } finally {
    rmSync(temporary, { force: true })
  }
}

export async function hydratePreviewAssets(root = process.cwd(), {
  signal, timeoutMs = HYDRATION_TIMEOUT_MS, log = console.log,
} = {}) {
  const started = performance.now()
  const deadline = started + timeoutMs
  const controller = new AbortController()
  const cancel = () => controller.abort(signal.reason)
  signal?.addEventListener('abort', cancel, { once: true })
  if (signal?.aborted) cancel()
  const timer = setTimeout(() => controller.abort(new Error('asset restore exceeded its time budget')), timeoutMs)
  let next = 0
  let restored = 0
  let completed = 0
  try {
    controller.signal.throwIfAborted()
    const entries = readAssetsManifest(root).assets
    const targets = missingAssets(root)
    log(`[assets] preparing ${targets.length} missing file(s); at most ${WORKERS} transfers`)
    const worker = async () => {
      try {
        while (next < targets.length) {
          controller.signal.throwIfAborted()
          const rel = targets[next++]
          try {
            if (await restoreAsset(root, rel, entries[rel], controller.signal, deadline, log)) restored++
          } catch (err) {
            throw new Error(`cannot restore ${rel}: ${err.message}`)
          }
          completed++
          log(`[assets] prepared ${completed}/${targets.length}: ${rel}`)
        }
      } catch (err) {
        controller.abort(err)
      }
    }
    // All workers finish cleanup before a failure returns to the preview server.
    await Promise.all(Array.from({ length: Math.min(WORKERS, targets.length) }, worker))
    controller.signal.throwIfAborted()
    const remaining = missingAssets(root)
    if (remaining.length) throw new Error(`asset restore left ${remaining.length} unreadable file(s)`)
    log(`[assets] restored ${restored} file(s) in ${((performance.now() - started) / 1000).toFixed(2)}s`)
    return restored
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', cancel)
  }
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const controller = new AbortController()
  const cancel = () => controller.abort(new Error('asset restore cancelled'))
  process.on('SIGTERM', cancel)
  process.on('SIGINT', cancel)
  try {
    await hydratePreviewAssets(process.cwd(), { signal: controller.signal, ...(process.argv.includes('--quiet') ? { log: () => {} } : {}) })
  } catch (err) {
    console.error(`[assets] restore failed: ${err?.message || err}`)
    process.exitCode = 1
  } finally {
    process.removeListener('SIGTERM', cancel)
    process.removeListener('SIGINT', cancel)
  }
}
