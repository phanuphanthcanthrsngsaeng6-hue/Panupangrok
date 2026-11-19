// Managed preview bridge. Kept out of source files and published shells.
(() => {
  let status = 'loading'
  let request
  let observed = false
  let lastBuildStatusAt = Date.now()
  const wrapped = new WeakSet()
  const pendingBuild = () => !observed && document.querySelector('meta[name="manus-game-preview-generation"]')?.content === 'pending'
  const reply = () => {
    const hasLoadingScreen = !!document.querySelector('meta[name="manus-game-loading-screen"][content="1"]')
    const generation = document.querySelector('meta[name="manus-game-preview-generation"]')?.content
    const resourceId = document.querySelector('meta[name="manus-game-preview-resource"]')?.content
    const previewGeneration = /^[a-f0-9]{64}$/.test(generation || '') ? generation : null
    const age = Date.now() - lastBuildStatusAt
    // A static placeholder cannot keep claiming healthy preparation after its
    // resident server disappears. Only successful status polling renews it.
    const awaitingBuild = status === 'loading' && pendingBuild() && age >= 0 && age <= 15_000
    if (request && (observed || hasLoadingScreen)) window.parent.postMessage({ type: 'manus-game-preview-status', version: 2, nonce: request.nonce, resourceId, status, hasLoadingScreen, awaitingBuild, previewGeneration }, request.origin)
  }
  window.__manusUpdateGamePreviewBuild = phase => {
    if (!pendingBuild() || !['waiting', 'exporting', 'failed'].includes(phase)) return
    lastBuildStatusAt = Date.now()
    status = phase === 'failed' ? 'failed' : 'loading'
    reply()
  }
  const fail = () => {
    observed = true
    if (status !== 'ready') { status = 'failed'; reply() }
  }
  const observeEngine = target => {
    if (!target || typeof target.startGame !== 'function' || wrapped.has(target)) return
    wrapped.add(target)
    observed = true
    const original = target.startGame
    target.startGame = function (...args) {
      try {
        const result = original.apply(this, args)
        Promise.resolve(result).then(() => {
          status = 'ready'; reply()
          try { window.__manusStartGamePreviewBackdrop?.() } catch { /* Decoration cannot fail game startup. */ }
        }, fail)
        return result
      } catch (error) { fail(); throw error }
    }
    reply()
  }
  // Godot's public factory returns an engine with its own prototype.
  window.__manusWrapGameEngine = Constructor => new Proxy(Constructor, {
    construct(target, args, newTarget) {
      const instance = Reflect.construct(target, args, newTarget)
      observeEngine(instance)
      return instance
    },
  })
  const wrapEngine = () => observeEngine(window.Engine?.prototype)
  // Capture external engine-script completion before the following inline boot script.
  document.addEventListener('load', wrapEngine, true)
  document.addEventListener('DOMContentLoaded', reply, { once: true })
  wrapEngine()
  window.addEventListener('error', fail)
  window.addEventListener('unhandledrejection', fail)
  window.addEventListener('message', event => {
    if (event.source !== window.parent || event.data?.type !== 'manus-game-preview-status-request' || event.data?.version !== 2) return
    if (typeof event.data.nonce !== 'string' || !event.data.nonce || event.data.nonce.length > 128) return
    const parentOrigin = window.__manusGameParentOrigin?.(event)
    if (!parentOrigin) return
    request = { nonce: event.data.nonce, origin: parentOrigin }
    reply()
  })
})()
