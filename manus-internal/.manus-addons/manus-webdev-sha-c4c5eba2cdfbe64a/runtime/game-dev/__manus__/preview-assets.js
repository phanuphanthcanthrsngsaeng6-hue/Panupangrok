// Game Assets reads use the mounted preview's existing ingress authorization.
(() => {
  const MAX_BYTES = 32 * 1024 * 1024
  let active = 0
  window.addEventListener('message', async event => {
    const data = event.data
    if (event.source !== window.parent || data?.type !== 'manus-game-asset-request' || data.version !== 1) return
    if (typeof data.nonce !== 'string' || !data.nonce || data.nonce.length > 128 || typeof data.path !== 'string' || data.path.length > 2048) return
    const parentOrigin = window.__manusGameParentOrigin?.(event)
    if (!parentOrigin) return
    const base = { type: 'manus-game-asset-result', version: 1, nonce: data.nonce, path: data.path }
    const reply = result => window.parent.postMessage({ ...base, ...result }, parentOrigin, result.bytes ? [result.bytes] : [])
    if (!data.path.startsWith('assets/') || data.path.includes('\\') || data.path.split('/').some(part => !part || part === '.' || part === '..')) {
      reply({ ok: false, error: 'invalid_path' })
      return
    }
    if (active >= 4) { reply({ ok: false, error: 'unavailable' }); return }
    active++
    try {
      const versioned = /\/__manus__\/game-preview\/[a-f0-9]{64}\/index\.html$/.test(window.location.pathname)
      const base = new URL(window.location.href)
      if (!versioned) base.pathname = base.pathname.endsWith('/index.html') ? base.pathname.slice(0, -10) : base.pathname.replace(/\/?$/, '/')
      const endpoint = new URL(versioned ? '../../game-asset' : '__manus__/game-asset', base)
      endpoint.search = ''
      endpoint.hash = ''
      endpoint.searchParams.set('path', data.path)
      const response = await fetch(endpoint, { cache: 'no-store', signal: AbortSignal.timeout(10_000) })
      if (response.status === 413 || Number(response.headers.get('content-length')) > MAX_BYTES) { reply({ ok: false, error: 'too_large' }); return }
      if (!response.ok) throw new Error('unavailable')
      const bytes = await response.arrayBuffer()
      if (bytes.byteLength > MAX_BYTES) { reply({ ok: false, error: 'too_large' }); return }
      reply({ ok: true, bytes, mime: response.headers.get('content-type') || 'application/octet-stream' })
    } catch { reply({ ok: false, error: 'unavailable' }) }
    finally { active-- }
  })
})()
