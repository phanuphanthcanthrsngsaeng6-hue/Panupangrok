// Only these bounded diagnostics cross the Runtime/Server trust boundary.
export const RELEASE_ERROR_STAGES = Object.freeze({
  release_manifest_missing: 'manifest', release_manifest_invalid: 'manifest',
  input_mismatch: 'inputs', input_manifest_invalid: 'inputs', source_too_large: 'inputs',
  artifact_invalid: 'artifacts', site_files_changed: 'site',
  build_receipt_invalid: 'build',
  sharing_invalid: 'sharing', backend_invalid: 'backend',
})
// A project-relative release path; anything else is dropped rather than shown.
export function boundedReleasePath(path) {
  return typeof path === 'string' && path.length <= 512 && !/[\\:\x00-\x1f\x7f]/.test(path) &&
    path.split('/').every(part => part && part !== '.' && part !== '..') ? path : undefined
}
export class GameReleaseValidationError extends Error {
  constructor(code, message, path, options) {
    super(message, options)
    this.code = Object.hasOwn(RELEASE_ERROR_STAGES, code) ? code : 'release_manifest_invalid'
    this.stage = RELEASE_ERROR_STAGES[this.code]
    const bounded = boundedReleasePath(path)
    if (bounded) this.path = bounded
  }
}
export function releaseCheck(code, message, run, path) {
  try { return run() } catch (error) {
    if (error instanceof GameReleaseValidationError) throw error
    throw new GameReleaseValidationError(code, message, path, { cause: error })
  }
}
