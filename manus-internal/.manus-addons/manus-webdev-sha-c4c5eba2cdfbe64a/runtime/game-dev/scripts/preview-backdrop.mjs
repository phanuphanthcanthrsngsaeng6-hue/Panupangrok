// Freeze presentation geometry with its export, never read the mutable project
// when serving an older preview generation. Unknown/custom scaling stays intact.
export function previewBackdropMetadata(html, project) {
  let section = ''
  const settings = new Map()
  for (const line of project.split(/\r?\n/)) {
    const header = line.match(/^\s*\[([^\]]+)\]\s*(?:;.*)?$/)
    if (header) section = header[1]
    else if (section === 'display') {
      const entry = line.match(/^\s*(window\/[^=]+?)\s*=\s*([^;]*?)\s*(?:;.*)?$/)
      if (entry) settings.set(entry[1], entry[2])
    }
  }
  // Other feature overrides depend on the player's device. Do not guess its
  // viewport from the base setting and risk covering playable pixels.
  const geometryKey = /^window\/(?:size\/viewport_(?:width|height)|stretch\/(?:mode|aspect|scale_mode))\.(.+)$/
  if ([...settings.keys()].some(key => { const feature = key.match(geometryKey)?.[1]; return feature && feature !== 'web' })) return html
  const get = key => settings.get(`window/${key}.web`) ?? settings.get(`window/${key}`)
  const width = Number(get('size/viewport_width')), height = Number(get('size/viewport_height'))
  const aspect = get('stretch/aspect') ?? '"keep"'
  if (!['"canvas_items"', '"viewport"'].includes(get('stretch/mode')) ||
      !['"keep"', '"keep_width"', '"keep_height"'].includes(aspect) ||
      get('stretch/scale_mode') === '"integer"' ||
      !Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0 || width > 16384 || height > 16384) return html
  const tag = `<meta name="manus-game-preview-backdrop" content="${width},${height},${JSON.parse(aspect)}">`
  return html.replace(/<head\b[^>]*>/i, match => match + tag)
}
