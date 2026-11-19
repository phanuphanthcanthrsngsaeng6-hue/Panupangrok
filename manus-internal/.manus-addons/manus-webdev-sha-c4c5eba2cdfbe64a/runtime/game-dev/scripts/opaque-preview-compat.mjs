// Godot's optional browser hooks must not abort startup in Saved Preview's
// opaque iframe. Keep its URL guard intact and normal-origin behavior unchanged.
export function adaptGodotOpaquePreview(source) {
  for (const [name, result] of [
    ['_godot_js_display_window_icon_set', ''],
    ['_godot_js_pwa_cb', ''],
    ['_godot_js_pwa_update', '1'],
  ]) {
    const pattern = new RegExp(`function\\s+${name}\\s*\\([^)]*\\)\\s*\\{`, 'g')
    const matches = [...source.matchAll(pattern)]
    // The supported exporter is pinned; do not silently ship an incompatible
    // custom template or engine revision without its startup adaptation.
    if (matches.length !== 1) throw new Error(`Godot Web export expected one ${name} hook; found ${matches.length}`)
    const offset = matches[0].index + matches[0][0].length
    const guard = `if(globalThis.origin==="null"){return${result ? ' ' + result : ''};}`
    if (!source.startsWith(guard, offset)) source = source.slice(0, offset) + guard + source.slice(offset)
  }
  return source
}
