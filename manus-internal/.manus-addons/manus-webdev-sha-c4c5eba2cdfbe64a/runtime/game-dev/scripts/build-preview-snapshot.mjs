import { ensureSerialImports } from './import-settings.mjs'
import { storageError } from './storage-capacity.mjs'
import { createExportReceipt } from './export-receipt.mjs'
import { captureBuildSnapshot, buildSnapshotIdentity, discardBuildSnapshot, preserveGeneratedImportMetadata, matchingSourceSnapshotIdentity, refreshBuildProvenance, recordBuildProvenance } from './build-snapshot.mjs'
import { resolveBuildToolchain } from './build-toolchain.mjs'
import { exportFrozenProfile } from './snapshot-export.mjs'
import { assembleShareSite } from './share-metadata.mjs'
import { activatePreview, readCurrentPreview } from './preview-state.mjs'
import { recoverSiteInstall } from './site-install.mjs'
import { reconcileProvenance } from './asset-provenance.mjs'
import { exportedAssetEvidence } from './export-asset-inventory.mjs'
import { join } from 'node:path'

// The resident parent owns the project export lock and cancellation deadline.
const standalonePreview = process.argv.includes('--standalone')
let snapshot
try {
  const root = process.cwd()
  recoverSiteInstall(root)
  ensureSerialImports(root)
  refreshBuildProvenance(root, { includeLocalAssets: true })
  const toolchain = resolveBuildToolchain(root)
  snapshot = captureBuildSnapshot(root, toolchain.identity, { includeLocalAssets: true })
  let build = buildSnapshotIdentity(snapshot, { dirtyAssets: true })
  const current = readCurrentPreview(root)
  if ((current?.build?.sourceSnapshotId ?? current?.build?.snapshotId) !== build.snapshotId || current.build.profile !== 'preview') {
    // Record once after host sharing media is assembled, rather than scanning
    // and reconciling the same export both before and after that final step.
    const staging = exportFrozenProfile(snapshot, toolchain, 'preview', { recordProvenance: false })
    build = buildSnapshotIdentity(snapshot, { dirtyAssets: true })
    const exported = createExportReceipt(staging, 'preview', build.snapshotId)
    if (!standalonePreview) assembleShareSite(snapshot.project, staging)
    const provenance = reconcileProvenance(snapshot.project)
    recordBuildProvenance(snapshot.project, exportedAssetEvidence(staging, { profile: 'preview', assets: provenance.assets }), { renderedCaptureRoot: root })
    preserveGeneratedImportMetadata(root, snapshot)
    let source
    try { source = matchingSourceSnapshotIdentity(snapshot) }
    catch { /* Concurrent invalid edits cannot invalidate the frozen export. */ }
    activatePreview(root, staging, build.snapshotId, { ...build, version: 2, profile: 'preview', export: exported,
      ...(source ? { sourceSnapshotId: source.snapshotId } : {}) })
  } else {
    const provenance = reconcileProvenance(snapshot.project)
    recordBuildProvenance(snapshot.project, exportedAssetEvidence(join(root, 'dist/.preview/builds', current.generation), { profile: 'preview', assets: provenance.assets }), { renderedCaptureRoot: root })
    preserveGeneratedImportMetadata(root, snapshot)
    build = current.build
  }
  console.log(build.snapshotId)
} catch (error) {
  error = storageError(error)
  try { refreshBuildProvenance(process.cwd(), { includeLocalAssets: true }) } catch { /* Preserve the original build diagnostic. */ }
  console.error((error.code?.startsWith('GAME_STORAGE_') ? '[' + error.code + '] ' : '') + 'Game preview snapshot build failed: ' + (error.message || 'inspect the export diagnostics and retry'))
  process.exitCode = 1
} finally { if (snapshot) discardBuildSnapshot(snapshot) }
