import { constants, copyFileSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { ensureDistDirectory } from './local-artifacts.mjs'
import { snapshotSourceFiles } from './build-snapshot.mjs'

const recoverable = new Set(['GAME_EXPORT_ARTIFACT_MISSING', 'GAME_EXPORT_ARTIFACT_CHANGED', 'GAME_EXPORT_TWEAK_REMAINS'])
export const exportRecoveryError = (code, message) => Object.assign(new Error(message), { code })

/** The caller supplies a private snapshot, never the user's working project.
 * A single budget is shared by every export in that checkpoint preparation. */
export async function recoverFrozenExport(root, output, run, { cancelled = () => false, budgetFile } = {}) {
  const canRetry = !budgetFile || !existsSync(budgetFile)
  const files = canRetry ? snapshotSourceFiles(root) : {}
  // Keep recovery inside the private candidate so caller cleanup also owns it
  // after a killed compiler. Same-filesystem clones avoid copying large assets.
  const backup = canRetry ? mkdtempSync(join(ensureDistDirectory(root), '.export-recovery-')) : null
  const checkCancelled = async () => {
    // Synchronous engine calls delay JS signal handlers until this turn yields.
    await new Promise(resolve => setImmediate(resolve))
    if (cancelled()) throw exportRecoveryError('GAME_EXPORT_CANCELLED', 'Game export cancelled')
  }
  try {
    for (const file of Object.keys(files)) {
      mkdirSync(dirname(join(backup, file)), { recursive: true })
      copyFileSync(join(root, file), join(backup, file), constants.COPYFILE_FICLONE)
    }
    for (let attempt = 0; ; attempt++) {
      await checkCancelled()
      try {
        const result = await run()
        await checkCancelled()
        return result
      } catch (error) {
        await checkCancelled()
        if (!canRetry || !recoverable.has(error.code) || attempt === 1 || budgetFile && existsSync(budgetFile)) throw error
        if (budgetFile) writeFileSync(budgetFile, 'used\n', { flag: 'wx' })
        // Restore exactly the captured input, including removal of sidecars created
        // by the failed attempt. No source is read again from sourceRoot.
        for (const file of Object.keys(snapshotSourceFiles(root))) rmSync(join(root, file))
        rmSync(join(root, '.godot'), { recursive: true, force: true })
        rmSync(output, { recursive: true, force: true })
        for (const file of Object.keys(files)) {
          mkdirSync(dirname(join(root, file)), { recursive: true })
          copyFileSync(join(backup, file), join(root, file), constants.COPYFILE_FICLONE)
        }
        if (JSON.stringify(snapshotSourceFiles(root)) !== JSON.stringify(files)) throw new Error('Game recovery could not restore the frozen input')
        console.log('[export] rebuilding once from the same frozen input: ' + error.code)
      }
    }
  } finally { if (backup) rmSync(backup, { recursive: true, force: true }) }
}
