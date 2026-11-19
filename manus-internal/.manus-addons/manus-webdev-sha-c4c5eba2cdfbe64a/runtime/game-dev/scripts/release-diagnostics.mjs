import { StorageError } from './storage.mjs'
import { GameReleaseValidationError, RELEASE_ERROR_STAGES } from './release-errors.mjs'
import { GAME_RELEASE_SIZE_RECOVERY } from './release-limits.mjs'
import { GameStorageError } from './storage-capacity.mjs'

export const PUBLISH_DEV_ENDPOINT_ERROR = 'publish shell references a dev-only endpoint; preview instrumentation must stay response-only'

// Phase metadata stays in-process. Preserve the original Error identity/code for
// existing callers, and never serialize provider errors, causes or stderr.
const stages = new WeakMap()
const FAILURES = {
  arguments: ['invalid_arguments', 'Invalid Game save arguments.', 'Run save-release.mjs --message "commit message" from the Game project directory.'],
  local_git: ['game_save_git_failed', 'Game save failed while checking or committing local Git.', 'Inspect local Git and any existing commit before pushing or retrying.'],
  preparation: ['game_release_preparation_failed', 'Game release preparation failed.', 'Inspect the source, asset manifest and engine configuration before retrying.'],
  asset_sync: ['game_assets_sync_failed', 'Game asset synchronization failed.', 'Check the asset manifest and storage configuration before retrying.'],
  engine_export: ['game_export_failed', 'Game engine export failed.', 'Inspect the engine export diagnostics and fix the source or export configuration before retrying.'],
  upload_wasm: ['game_release_upload_failed', 'Game engine WASM upload failed.', 'Check project storage configuration before retrying.'],
  upload_pck: ['game_release_upload_failed', 'Game PCK upload failed.', 'Check project storage configuration before retrying.'],
  assemble_site: ['game_publish_assembly_failed', 'Game publish HTML assembly failed.', 'Inspect the exported HTML and publish configuration before retrying; an upload retry alone will not fix HTML assembly.'],
  verify_release: ['game_release_verification_failed', 'Game release verification failed.', 'Inspect the prepared release and source consistency before retrying.'],
  install_site: ['game_release_install_failed', 'Game prepared release installation failed.', 'Inspect local storage and the prepared release before retrying.'],
}

export function atReleaseStage(stage, action) {
  try { return action() } catch (error) {
    if (error instanceof Error && !stages.has(error)) stages.set(error, stage)
    throw error
  }
}

export function preserveReleaseStage(error, replacement) {
  if (error instanceof Error && replacement instanceof Error && stages.has(error) && !stages.has(replacement)) {
    stages.set(replacement, stages.get(error))
  }
  return replacement
}

export function releaseFailureDiagnostic(error, fallbackStage = 'preparation') {
  const recorded = error instanceof Error ? stages.get(error) : null
  const stage = Object.hasOwn(FAILURES, recorded) ? recorded : Object.hasOwn(FAILURES, fallbackStage) ? fallbackStage : 'preparation'
  const [code, message, recovery] = FAILURES[stage]
  if (error instanceof GameStorageError) {
    const safeCode = ['GAME_STORAGE_CAPACITY', 'GAME_STORAGE_ADMISSION_UNAVAILABLE'].includes(error.code) ? error.code : 'GAME_STORAGE_CAPACITY'
    const safe = new GameStorageError(safeCode)
    return { ok: false, stage, code: safe.code, message: safe.message, retryable: false,
      recovery: safeCode === 'GAME_STORAGE_ADMISSION_UNAVAILABLE'
        ? 'Keep the current game and retry after the runtime storage admission service is restored. Source or export configuration changes are not required for this storage failure.'
        : 'Free unused managed cache or expand project storage before retrying. Keep the current game; source or export configuration changes are not required for this storage failure.' }
  }
  if (error instanceof StorageError) {
    // Reconstruct from the fixed catalog; do not trust mutable message/recovery
    // fields or stringify the Error object, which could acquire private fields.
    const safe = new StorageError(error.code, error.httpStatus)
    return { ok: false, stage, code: safe.code, message: safe.message, recovery: safe.recovery,
      ...(safe.httpStatus ? { httpStatus: safe.httpStatus } : {}) }
  }
  if (error instanceof GameReleaseValidationError) {
    const safeCode = Object.hasOwn(RELEASE_ERROR_STAGES, error.code) ? error.code : 'release_manifest_invalid'
    return { ok: false, stage, code: safeCode, validationStage: RELEASE_ERROR_STAGES[safeCode],
      message: 'Game release validation failed.',
      recovery: safeCode === 'source_too_large' ? GAME_RELEASE_SIZE_RECOVERY : FAILURES.verify_release[2] }
  }
  if (error instanceof Error && error.message === PUBLISH_DEV_ENDPOINT_ERROR) {
    return { ok: false, stage, code: 'game_publish_dev_endpoint', message: PUBLISH_DEV_ENDPOINT_ERROR,
      recovery: 'Remove preview instrumentation and development service dependencies from the published HTML; preserve normal login code. An upload retry alone will not fix this check.' }
  }
  return { ok: false, stage, code, message, recovery }
}
