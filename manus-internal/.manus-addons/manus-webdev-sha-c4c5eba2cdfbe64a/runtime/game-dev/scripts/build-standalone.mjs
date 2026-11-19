import { ensureSerialImports } from './import-settings.mjs'
import { storageError } from './storage-capacity.mjs'
import { existsSync, lstatSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { assertAssetsPresent, ensureDistDirectory, acquireExportLockSync, releaseExportLock, validateExportDirectory } from './local-artifacts.mjs'
import { captureBuildSnapshot, discardBuildSnapshot, preserveGeneratedImportMetadata, buildSnapshotIdentity, refreshBuildProvenance, recordBuildProvenance } from './build-snapshot.mjs'
import { resolveBuildToolchain } from './build-toolchain.mjs'
import { importFrozenSnapshot, exportFrozenProfile } from './snapshot-export.mjs'
import { createExportReceipt, verifyExportReceipt } from './export-receipt.mjs'
import { hasCachedExport, stampExportCache } from './export-cache.mjs'
import { releaseArtifactIdentity } from './release-artifact-identity.mjs'
import { reconcileProvenance } from './asset-provenance.mjs'
import { exportedAssetEvidence } from './export-asset-inventory.mjs'
import { releaseProjection } from './release-profile.mjs'
import { restoreBundledProjectFonts } from './restore-bundled-fonts.mjs'

// Local delivery owns no platform state: no storage, checkpoint or site/ writes.
export function buildStandalone(root) {
  acquireExportLockSync(root)
  let snapshot
  try {
    const dist = ensureDistDirectory(root)
    const target = join(dist, 'standalone')
    const backup = join(dist, '.standalone-previous')
    for (const directory of [target, backup]) {
      if (existsSync(directory) && (!lstatSync(directory).isDirectory() || lstatSync(directory).isSymbolicLink())) {
        throw new Error('Standalone output must be a regular directory')
      }
    }
    if (existsSync(backup) && !existsSync(target)) renameSync(backup, target)
    ensureSerialImports(root)
    restoreBundledProjectFonts(root)
    assertAssetsPresent(root)
    refreshBuildProvenance(root, { includeLocalAssets: true })
    releaseProjection(root, { includeLocalAssets: true })
    const toolchain = resolveBuildToolchain(root)
    snapshot = captureBuildSnapshot(root, toolchain.identity, { includeLocalAssets: true })
    const engineInput = releaseArtifactIdentity(snapshot.project, toolchain)
    const candidate = buildSnapshotIdentity(snapshot, { dirtyAssets: true })
    try {
      const receipt = JSON.parse(readFileSync(join(dist, '.standalone-export.json'), 'utf8'))
      validateExportDirectory(root, target)
      if (!hasCachedExport(root, target, engineInput)) throw new Error('Cached export changed')
      const actual = createExportReceipt(target, 'release', receipt.snapshotId)
      verifyExportReceipt(receipt, 'release', receipt.snapshotId, actual.files)
      if (receipt.engineInput !== engineInput || receipt.digest !== actual.digest) throw new Error('Cached export changed')
      if (receipt.sourceSnapshotId !== candidate.snapshotId) {
        const provenance = reconcileProvenance(snapshot.project)
        recordBuildProvenance(snapshot.project, exportedAssetEvidence(target, { profile: 'release', assets: provenance.assets }), { renderedCaptureRoot: root })
        preserveGeneratedImportMetadata(root, snapshot)
        writeFileSync(join(dist, '.standalone-export.json'), JSON.stringify({ ...receipt, ...actual, sourceSnapshotId: candidate.snapshotId }) + '\n')
      }
      return { directory: 'dist/standalone', pck: 'dist/standalone/index.pck', snapshotId: candidate.snapshotId,
        artifactSnapshotId: actual.snapshotId, sha256: actual.files['index.pck'], reused: true }
    } catch { /* Missing, stale or changed output needs one new export. */ }
    // Stabilize imports without producing an unused full preview export.
    importFrozenSnapshot(snapshot, toolchain)
    const output = exportFrozenProfile(snapshot, toolchain, 'release')
    validateExportDirectory(snapshot.project, output)
    const build = buildSnapshotIdentity(snapshot, { dirtyAssets: true })
    rmSync(backup, { recursive: true, force: true })
    if (existsSync(target)) renameSync(target, backup)
    try { renameSync(output, target) }
    catch (error) {
      if (existsSync(backup)) renameSync(backup, target)
      throw error
    }
    rmSync(backup, { recursive: true, force: true })
    const receipt = createExportReceipt(target, 'release', build.snapshotId)
    const exportedInput = releaseArtifactIdentity(snapshot.project, toolchain)
    stampExportCache(target, exportedInput)
    preserveGeneratedImportMetadata(root, snapshot)
    let source = build
    // Concurrent edits cannot be labelled as the exported candidate. Import
    // cache paths may differ while effective engine inputs remain identical.
    try {
      if (releaseArtifactIdentity(root, toolchain, releaseProjection(root, { includeLocalAssets: true })) === exportedInput) {
        source = buildSnapshotIdentity({ project: root, toolchain: toolchain.identity }, { dirtyAssets: true, includeLocalAssets: true })
      }
    } catch { /* Concurrent invalid edits cannot invalidate the frozen export. */ }
    writeFileSync(join(dist, '.standalone-export.json'), JSON.stringify({ ...receipt, toolchain: build.toolchain, engineInput: exportedInput, sourceSnapshotId: source.snapshotId }) + '\n')
    return { directory: 'dist/standalone', pck: 'dist/standalone/index.pck', snapshotId: source.snapshotId, artifactSnapshotId: build.snapshotId, sha256: receipt.files['index.pck'] }
  } catch (error) {
    error = storageError(error)
    try { refreshBuildProvenance(root, { includeLocalAssets: true }) } catch { /* Preserve the original build diagnostic. */ }
    throw error
  } finally {
    if (snapshot) discardBuildSnapshot(snapshot)
    releaseExportLock(root)
  }
}
