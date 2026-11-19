// Only a successfully activated explicit preview build can navigate this game.
(() => {
  const generation = document.querySelector('meta[name="manus-game-preview-generation"]')?.content
  const resourceId = document.querySelector('meta[name="manus-game-preview-resource"]')?.content
  if (generation !== 'pending' && !/^[a-f0-9]{64}$/.test(generation || '')) return
  if (!/^wdp_[0-9a-z]{16,32}$/.test(resourceId || '')) return
  const base = new URL(window.location.href)
  if (generation === 'pending') {
    base.pathname = base.pathname.endsWith('/index.html') ? base.pathname.slice(0, -10) : base.pathname.replace(/\/?$/, '/')
    base.search = ''; base.hash = ''
  }
  let switched = false
  let timer
  const poll = async () => {
    try {
      const statusURL = new URL(generation === 'pending' ? '__manus__/game-status' : '../../game-status', base)
      if (generation !== 'pending') statusURL.searchParams.set('generation', generation)
      const response = await fetch(statusURL, { cache: 'no-store', signal: AbortSignal.timeout(5000) })
      if (response.ok) {
        const status = await response.json()
        const ownsPreview = status.version === 1 && status.resourceId === resourceId
        if (generation === 'pending' && ownsPreview) window.__manusUpdateGamePreviewBuild?.(status.buildPhase)
        if (ownsPreview && status.phase === 'ready' && /^[a-f0-9]{64}$/.test(status.generation || '') && status.generation !== generation) {
          switched = true
          const target = new URL(generation === 'pending' ? `__manus__/game-preview/${status.generation}/index.html` : `../${status.generation}/index.html`, base)
          target.search = window.location.search
          target.hash = window.location.hash
          window.location.replace(target.href)
        }
      }
    } catch { /* Transient ingress failures leave the current game running. */ }
    if (!switched) timer = setTimeout(poll, 1500)
  }
  timer = setTimeout(poll, 1500)
  window.addEventListener('pagehide', () => { switched = true; clearTimeout(timer) })
  window.addEventListener('pageshow', event => {
    if (event.persisted) { switched = false; clearTimeout(timer); void poll() }
  })
  document.addEventListener?.('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !switched) { clearTimeout(timer); void poll() }
  })
})()
