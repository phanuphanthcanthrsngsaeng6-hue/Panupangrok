import { randomUUID } from 'node:crypto'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { bundledFontData } from './bundled-fonts.mjs'
import { installAssetFileSync } from './install-asset.mjs'
import { absentEntries, isSafeAssetRel, readAssetsLock } from './local-artifacts.mjs'

// Portable builds restore only packaged typography; other missing media still
// requires the project's existing asset workflow. Never replace local edits.
export function restoreBundledProjectFonts(root) {
  const lock = readAssetsLock(root)
  let restored = 0
  for (const relative of absentEntries(root, lock)) {
    const bytes = bundledFontData(lock[relative])
    if (!bytes) continue
    const target = join(root, relative)
    mkdirSync(dirname(target), { recursive: true })
    const temporary = `${target}.${randomUUID()}.tmp`
    try {
      writeFileSync(temporary, bytes, { flag: 'wx' })
      if (!isSafeAssetRel(root, relative)) throw new Error(`invalid asset path: ${relative}`)
      try {
        installAssetFileSync(temporary, target)
        restored++
      } catch (error) {
        if (error.code !== 'EEXIST' || !existsSync(target) || !isSafeAssetRel(root, relative)) throw error
      }
    } finally {
      rmSync(temporary, { force: true })
    }
  }
  return restored
}
