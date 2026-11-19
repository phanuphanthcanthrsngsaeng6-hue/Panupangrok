// Backport emscripten-core/emscripten#25926 to the pinned Godot Web templates.
// Android WebView includes both Version/4.0 and Safari/ in its Chromium UA.
// Only correct the generated Safari predicate; keep every version floor and
// leave release templates without assertions and already-fixed templates intact.
export function adaptGodotBrowserVersionCheck(source) {
  return source.replace(
    /((?:var|let|const)\s+currentSafariVersion\s*=\s*userAgent\.includes\((['"])Safari\/\2\)\s*&&\s*)(?=userAgent\.match\()/g,
    '$1!userAgent.includes("Chrome/")&&',
  )
}
