// Preview-only decoration over Godot's letterbox pixels. The engine canvas and
// its input coordinates are untouched; no second engine or cross-frame capture.
(() => {
  window.__manusStartGamePreviewBackdrop = () => {
    const metadata = document.querySelector('meta[name="manus-game-preview-backdrop"]')?.content
    const match = /^(\d+),(\d+),(keep|keep_width|keep_height)$/.exec(metadata || '')
    const source = document.getElementById('canvas')
    if (!match || !(source instanceof HTMLCanvasElement) || document.getElementById('manus-game-preview-backdrop')) return
    const ratio = Number(match[1]) / Number(match[2])
    if (!Number.isFinite(ratio) || ratio <= 0) return
    const layer = document.createElement('div')
    layer.id = 'manus-game-preview-backdrop'
    layer.setAttribute('aria-hidden', 'true')
    layer.style.cssText = 'position:fixed;pointer-events:none;overflow:hidden;z-index:1;display:none;'
    const reflection = document.createElement('canvas')
    reflection.width = Math.max(1, Math.round(256 * Math.min(1, ratio)))
    reflection.height = Math.max(1, Math.round(256 * Math.min(1, 1 / ratio)))
    reflection.style.cssText = 'position:absolute;width:100%;height:100%;object-fit:cover;transform:scale(1.7);filter:blur(50px);'
    const tint = document.createElement('div')
    // Both Figma variants use this tint; light/dark artwork supplies the color.
    tint.style.cssText = 'position:absolute;inset:-60px;filter:blur(50px);background:linear-gradient(86.3deg,rgba(0,0,0,.8) 22.65%,rgba(0,0,0,.85) 50.818%);'
    layer.append(reflection, tint)
    const context = reflection.getContext('2d')
    const gl = source.getContext('webgl2')
    if (!context || !gl) return
    const bands = [new Uint8Array(0), new Uint8Array(0)]
    const opaqueBlack = new Uint32Array(new Uint8Array([0, 0, 0, 255]).buffer)[0]
    source.after(layer)
    let frame = 0, previous = -Infinity, disposed = false
    const draw = time => {
      if (disposed || document.hidden) return
      frame = requestAnimationFrame(draw)
      const bounds = source.getBoundingClientRect()
      const { width, height } = bounds
      const tall = width / height < ratio
      const bars = Math.abs(width / height - ratio) > .001 &&
        (match[3] === 'keep' || (tall ? match[3] === 'keep_height' : match[3] === 'keep_width'))
      if (!source.isConnected || !width || !height || !source.width || !source.height || !bars) {
        layer.style.display = 'none'
        return
      }
      const gameWidth = tall ? width : height * ratio
      const gameHeight = tall ? width / ratio : height
      const x = (width - gameWidth) / 2, y = (height - gameHeight) / 2
      const right = x + gameWidth, bottom = y + gameHeight
      // Project settings are only a candidate: games can change their viewport
      // at runtime (e.g. Platformer's Adaptive setting). Never tint drawn pixels.
      const sx = source.width / width, sy = source.height / height
      const strips = tall
        ? [[0, 0, source.width, Math.floor(y * sy)], [0, Math.ceil(bottom * sy), source.width, source.height - Math.ceil(bottom * sy)]]
        : [[0, 0, Math.floor(x * sx), source.height], [Math.ceil(right * sx), 0, source.width - Math.ceil(right * sx), source.height]]
      // Inspect native pixels, not a downsample that could miss a small HUD.
      // Large or unreadable bands fail closed rather than doing unbounded readback.
      if (source.width * source.height > 4_194_304 || strips.reduce((total, [, , w, h]) => total + w * h, 0) > 1_048_576) {
        layer.style.display = 'none'
        return
      }
      let readFramebuffer
      try {
        // Read the presented WebGL buffer directly. A 2D drawImage can
        // snapshot the entire GPU canvas before cropping and allocates ImageData.
        // Godot's explicit swap control leaves an Emscripten FBO bound. Read
        // the presented canvas, not an arbitrary internal render target, and
        // restore the read binding in finally (the draw binding is untouched).
        if (gl.isContextLost() || !gl.getContextAttributes()?.preserveDrawingBuffer ||
            gl.getParameter(gl.PIXEL_PACK_BUFFER_BINDING) !== null ||
            ![1, 2, 4].includes(gl.getParameter(gl.PACK_ALIGNMENT)) || gl.getParameter(gl.PACK_ROW_LENGTH) || gl.getParameter(gl.PACK_SKIP_PIXELS) || gl.getParameter(gl.PACK_SKIP_ROWS)) {
          layer.style.display = 'none'; return
        }
        readFramebuffer = gl.getParameter(gl.READ_FRAMEBUFFER_BINDING)
        if (readFramebuffer !== null) gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null)
        if (gl.getParameter(gl.READ_BUFFER) !== gl.BACK) { layer.style.display = 'none'; return }
        for (const [index, [left, top, w, h]] of strips.entries()) {
          if (!w || !h) { layer.style.display = 'none'; return }
          if (bands[index].length !== w * h * 4) bands[index] = new Uint8Array(w * h * 4)
          const data = bands[index]
          // Failed reads must not leave a previously valid black band in use.
          data.fill(1)
          gl.readPixels(left, source.height - top - h, w, h, gl.RGBA, gl.UNSIGNED_BYTE, data)
          const words = new Uint32Array(data.buffer)
          for (let i = 0; i < words.length; i++) {
            if (words[i] !== opaqueBlack) { layer.style.display = 'none'; return }
          }
        }
      } catch { layer.style.display = 'none'; return }
      finally {
        if (readFramebuffer != null) gl.bindFramebuffer(gl.READ_FRAMEBUFFER, readFramebuffer)
      }
      // Revalidate bands every frame so a LIVE viewport change hides the effect
      // immediately; the blurred scene itself needs only ten copies per second.
      // Round toward the outer edge: fractional viewport boundaries may contain
      // game pixels. Decorate only the exact native bands inspected above.
      const maskX = tall ? 0 : strips[0][2] / sx, maskY = tall ? strips[0][3] / sy : 0
      const maskRight = tall ? width : strips[1][0] / sx, maskBottom = tall ? strips[1][1] / sy : height
      // Clip the decoration to the bars, including after resize/orientation changes.
      Object.assign(layer.style, {
        left: `${bounds.left}px`, top: `${bounds.top}px`, width: `${width}px`, height: `${height}px`,
        clipPath: `polygon(evenodd,0 0,100% 0,100% 100%,0 100%,0 0,${maskX}px ${maskY}px,${maskRight}px ${maskY}px,${maskRight}px ${maskBottom}px,${maskX}px ${maskBottom}px,${maskX}px ${maskY}px)`,
      })
      if (time - previous < 100) return
      previous = time
      try {
        context.drawImage(source, x / width * source.width, y / height * source.height,
          gameWidth / width * source.width, gameHeight / height * source.height,
          0, 0, reflection.width, reflection.height)
        layer.style.display = 'block'
      } catch { layer.style.display = 'none' }
    }
    const resume = () => {
      cancelAnimationFrame(frame)
      if (!document.hidden && !disposed) frame = requestAnimationFrame(draw)
    }
    const dispose = event => {
      cancelAnimationFrame(frame)
      if (event.persisted) return
      disposed = true
      document.removeEventListener('visibilitychange', resume)
      window.removeEventListener('pagehide', dispose)
      window.removeEventListener('pageshow', resume)
      layer.remove()
    }
    document.addEventListener('visibilitychange', resume)
    window.addEventListener('pagehide', dispose)
    window.addEventListener('pageshow', resume)
    resume()
  }
})()
