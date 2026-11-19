import { measureSlideDocument } from './measurement.js'

function timeout(promise, milliseconds, message) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(message)), milliseconds),
    ),
  ])
}

async function loadFrame(payload) {
  const frame = document.createElement('iframe')
  frame.width = String(payload.width)
  frame.height = String(payload.height)
  frame.style.width = `${payload.width}px`
  frame.style.height = `${payload.height}px`
  document.body.replaceChildren(frame)
  let loadTimedOut = false
  const loaded = new Promise((resolve) =>
    frame.addEventListener('load', resolve, { once: true }),
  )
  frame.src = payload.htmlURL
  await Promise.race([
    loaded,
    new Promise((resolve) =>
      setTimeout(() => {
        loadTimedOut = true
        resolve()
      }, 12000),
    ),
  ])
  const frameDocument = frame.contentDocument
  const frameWindow = frame.contentWindow
  if (!frameDocument || !frameWindow) {
    throw new Error('slides browser worker cannot access the workspace document')
  }
  const style = frameDocument.createElement('style')
  style.textContent =
    '*, *::before, *::after { animation: none !important; transition: none !important; }'
  ;(frameDocument.head || frameDocument.documentElement).appendChild(style)
  if (frameDocument.fonts?.ready) {
    await Promise.race([
      frameDocument.fonts.ready,
      new Promise((resolve) => setTimeout(resolve, 2000)),
    ])
  }
  await new Promise((resolve) => setTimeout(resolve, Number(payload.delayMs) || 0))
  return { frame, frameDocument, frameWindow, loadTimedOut }
}

async function prepareDeck(frameDocument, frameWindow, slideNumber) {
  const nextFrame = () =>
    new Promise((resolve) => frameWindow.requestAnimationFrame(resolve))
  const deck = frameDocument.querySelector('deck-stage')
  if (!deck) throw new Error('slideNumber requires a <deck-stage> element')
  if (!frameWindow.customElements.get('deck-stage')) {
    await timeout(
      frameWindow.customElements.whenDefined('deck-stage'),
      3000,
      'Timed out waiting for <deck-stage>',
    )
  }
  await timeout(
    (async () => {
      while (!Number.isFinite(Number(deck.length)) || Number(deck.length) <= 0) {
        await nextFrame()
      }
    })(),
    3000,
    'Timed out waiting for slides',
  )
  const totalSlides = Number(deck.length)
  if (slideNumber > totalSlides) throw new Error('slideNumber is out of range')
  const targetIndex = slideNumber - 1
  deck.setAttribute('no-rail', '')
  frameWindow.postMessage({ __omelette_presenting: true }, '*')
  frameWindow.postMessage({ __omelette_preview_mode: true }, '*')
  if (typeof deck.goTo !== 'function') throw new Error('deck-stage has no goTo')
  deck.goTo(targetIndex)
  await timeout(
    (async () => {
      while (Number(deck.index) !== targetIndex) await nextFrame()
    })(),
    3000,
    'Timed out navigating to slide',
  )
  const overlay = deck.shadowRoot?.querySelector('.overlay')
  overlay?.removeAttribute('data-visible')
  deck.shadowRoot
    ?.querySelectorAll('.rail, .rail-resize, .ctxmenu, .confirm-backdrop')
    .forEach((element) => { element.style.setProperty('display', 'none', 'important') })
  await nextFrame()
  await nextFrame()
  const rail = deck.shadowRoot?.querySelector('.rail')
  const railResize = deck.shadowRoot?.querySelector('.rail-resize')
  const cleanCapture =
    deck.hasAttribute('no-rail') &&
    (!overlay || !overlay.hasAttribute('data-visible')) &&
    (!rail || frameWindow.getComputedStyle(rail).display === 'none') &&
    (!railResize || frameWindow.getComputedStyle(railResize).display === 'none')
  if (!cleanCapture) throw new Error('Unable to hide deck outline')
  return {
    requestedSlideNumber: slideNumber,
    activeSlideNumber: Number(deck.index) + 1,
    totalSlides,
    designWidth: Number(deck.designWidth) || Number(deck.getAttribute('width')) || 0,
    designHeight:
      Number(deck.designHeight) || Number(deck.getAttribute('height')) || 0,
    cleanCapture,
  }
}

async function execute(payload) {
  const loaded = await loadFrame(payload)
  const { frame, frameDocument, frameWindow, loadTimedOut } = loaded
  const deck = payload.slideNumber
    ? await prepareDeck(frameDocument, frameWindow, payload.slideNumber)
    : undefined
  const measured = measureSlideDocument(frameDocument, frameWindow, payload, deck)
  frame.style.width = `${measured.capture.width}px`
  frame.style.height = `${measured.capture.height}px`
  return { ...measured, loadTimedOut }
}

window.addEventListener('manus-browser-worker-message', async (event) => {
  const { id, payload } = event.detail || {}
  try {
    const result = await execute(payload)
    window.dispatchEvent(
      new CustomEvent('manus-browser-worker-response', {
        detail: { id, result },
      }),
    )
  } catch (error) {
    window.dispatchEvent(
      new CustomEvent('manus-browser-worker-response', {
        detail: { id, error: error instanceof Error ? error.message : String(error) },
      }),
    )
  }
})
