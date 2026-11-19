import { readFileSync } from 'node:fs'

// The project loading shell owns the approved embedded font bytes. Reuse its
// face while export preparation is still running, including on offline hosts.
// The OFL notice for those bytes ships with the bundled runtime font.
const shell = readFileSync(new URL('../loading-shell.html', import.meta.url), 'utf8')
const license = readFileSync(new URL('../fonts/NotoSansSC-OFL.txt', import.meta.url), 'utf8')
const style = shell.match(/<style id="manus-fonts">([\s\S]*?)<\/style>/)?.[1]
if (!style || !license.includes('SIL Open Font License')) throw new Error('The bundled Noto Sans SC loading font is incomplete')
export const loadingFontStyle = style
export const loadingFontFamily = '"Noto Sans SC", sans-serif'
