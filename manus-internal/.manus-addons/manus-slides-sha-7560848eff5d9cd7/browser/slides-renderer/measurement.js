const maxCaptureHeight = 12000

// 只读取页面几何信息；消息、iframe 和截图生命周期由 worker 负责。
export function measureSlideDocument(frameDocument, frameWindow, payload, deck) {
  const root = frameDocument.querySelector('.slide-container') || frameDocument.body
  const rootRect = root.getBoundingClientRect()
  let bottom = Math.max(rootRect.height, root.scrollHeight || 0)
  for (const element of root.querySelectorAll('*')) {
    const style = frameWindow.getComputedStyle(element)
    if (style.display === 'none' || style.visibility === 'hidden') continue
    const rect = element.getBoundingClientRect()
    bottom = Math.max(bottom, rect.bottom - rootRect.top)
  }
  const documentHeight = Math.max(deck?.designHeight || payload.height, Math.ceil(bottom))
  const documentWidth = Math.max(
    deck?.designWidth || payload.width,
    Math.ceil(frameDocument.documentElement.scrollWidth || payload.width),
  )
  const captureHeight = payload.fullPage ? Math.min(documentHeight, maxCaptureHeight) : payload.height
  return {
    viewport: { width: payload.width, height: payload.height },
    document: { width: documentWidth, height: documentHeight },
    capture: { width: documentWidth, height: captureHeight },
    truncated: Boolean(payload.fullPage && documentHeight > maxCaptureHeight),
    deck,
    height: Math.max(0, Math.ceil(bottom)),
    overflow: Math.max(0, Math.ceil(bottom) - payload.height),
  }
}
