import { readFileSync } from 'node:fs'

const script = readFileSync(new URL('../__manus__/preview-readiness.js', import.meta.url), 'utf8')
const parentScript = readFileSync(new URL('../__manus__/preview-parent.js', import.meta.url), 'utf8')

const tuningScript = readFileSync(new URL('../__manus__/game-tuning.js', import.meta.url), 'utf8')
const assetScript = readFileSync(new URL('../__manus__/preview-assets.js', import.meta.url), 'utf8')
const generationScript = readFileSync(new URL('../__manus__/preview-generation.js', import.meta.url), 'utf8')
const backdropScript = readFileSync(new URL('../__manus__/preview-backdrop.js', import.meta.url), 'utf8')

export function injectPreviewReadiness(html, generation, resourceId) {
  const generationTag = generation === 'pending' || /^[a-f0-9]{64}$/.test(generation || '')
    ? `<meta name="manus-game-preview-generation" content="${generation}"><script>${generationScript}</script>` : ''
  const identityTag = /^wdp_[0-9a-z]{16,32}$/.test(resourceId || '')
    ? `<meta name="manus-game-preview-resource" content="${resourceId}">` : ''
  const tag = `${identityTag}<script>${parentScript}</script><script>${backdropScript}</script><script>${script}</script><script>${assetScript}</script>${generationTag}<script>${tuningScript}</script>`
  // Must execute before the engine script. Injection is response-only.
  return /<head\b[^>]*>/i.test(html)
    ? html.replace(/<head\b[^>]*>/i, match => match + tag)
    : tag + html
}

export function injectEngineReadiness(source) {
  // Keep the export's lexical Engine binding and static API intact. Only the
  // known Godot factory return is adapted in the preview response.
  if (!/\b(?:const|var|let) Engine = \(function \(\) \{/.test(source)) return source
  const factoryReturn = /return SafeEngine;(\s*\}\(\)\);)/g
  if ([...source.matchAll(factoryReturn)].length !== 1) return source
  return source.replace(factoryReturn,
    "return typeof window !== 'undefined' && typeof window.__manusWrapGameEngine === 'function' ? window.__manusWrapGameEngine(SafeEngine) : SafeEngine;$1")
}
