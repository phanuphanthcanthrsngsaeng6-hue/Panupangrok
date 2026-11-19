import { collectBuildInputs, verifyBuildInputs, buildKey } from './build-inputs.mjs'
import { GameReleaseValidationError, releaseCheck } from './release-errors.mjs'
import { readBackendContract } from '../leaderboard-reference/server/backend-contract.mjs'
import { verifyExportReceipt } from './export-receipt.mjs'
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, lstatSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { gitSnapshotPaths } from './snapshot-inputs.mjs'
import { verifyShareSite } from './share-metadata.mjs'

export const RELEASE_MANIFEST = 'game-release.json'
export const GAME_RELEASE_SCHEMA = 'manus.game.release/v1'
const digest = bytes => 'sha256:' + createHash('sha256').update(bytes).digest('hex')

export function releaseFiles(root, exclude = () => false, { hashContents = true } = {}) {
  const files = {}
  function walk(directory, prefix = '') {
    if (!lstatSync(directory).isDirectory() || lstatSync(directory).isSymbolicLink()) throw new Error('Release directory must be a regular directory')
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)) {
      const relative = prefix + entry.name
      if (exclude(relative, entry)) continue
      if (entry.isDirectory()) walk(join(directory, entry.name), relative + '/')
      else if (entry.isFile()) files[relative] = hashContents ? digest(readFileSync(join(directory, entry.name))) : null
      else throw new Error(`Unsupported release entry: ${relative}`)
    }
  }
  walk(root)
  return files
}

// Internal cache identity only. The durable source identity is inputs.tree.
export function releaseSourceFingerprint(root, { snapshot = false, includeLocalAssets = false } = {}) {
  return buildKey(collectBuildInputs(root, { paths: snapshot ? gitSnapshotPaths(root, { includeLocalAssets }) : null }), null)
}

export function createReleaseManifest(root, site, artifacts) {
  const backend = readBackendContract(root)
  const inputs = collectBuildInputs(root, { paths: artifacts.build ? gitSnapshotPaths(root) : null })
  return {
    ...(backend ? { backendContractSha256: backend.sha256 } : {}),
    schema: GAME_RELEASE_SCHEMA,
    engineVersion: artifacts.engine_version,
    inputs,
    ...(artifacts.build ? { build: Object.fromEntries(Object.entries(artifacts.build).filter(([key]) => key !== 'version')) } : {}),
    artifacts: {
      wasm: { path: artifacts.wasm_url, sha256: artifacts.wasm_sha256 },
      pck: { path: artifacts.pck_url, sha256: artifacts.pck_sha256 },
    },
    files: releaseFiles(site, relative => relative === RELEASE_MANIFEST),
  }
}

export function verifyRelease(root, site = join(root, 'site'), { installing = false, gitExecutable = 'git', sharing = true } = {}) {
  if (!installing && existsSync(join(root, 'dist', '.site-install.json'))) {
    throw new Error('Game release installation is incomplete; rerun prepare-release')
  }
  if (!existsSync(join(site, RELEASE_MANIFEST))) throw new GameReleaseValidationError('release_manifest_missing', 'Game release manifest is missing', 'site/game-release.json')
  const manifest = releaseCheck('release_manifest_invalid', 'Game release manifest is invalid', () => JSON.parse(readFileSync(join(site, RELEASE_MANIFEST), 'utf8')), 'site/game-release.json')
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) throw new GameReleaseValidationError('release_manifest_invalid', 'Game release manifest is invalid')
  if (manifest.schema !== GAME_RELEASE_SCHEMA) throw new GameReleaseValidationError('release_manifest_invalid', 'Game checkpoint uses the retired development release format; rebuild and save with the current tools')
  const inputs = releaseCheck('input_manifest_invalid', 'Game source tree record is invalid', () => verifyBuildInputs(root, manifest.inputs, { paths: gitSnapshotPaths(root, { gitExecutable }), gitExecutable }))
  if (typeof manifest.engineVersion !== 'string' || !manifest.engineVersion) {
    throw new GameReleaseValidationError('release_manifest_invalid', 'Game release engine identity is missing')
  }
  const backend = releaseCheck('backend_invalid', 'Game backend contract is invalid', () => readBackendContract(root))
  if (manifest.backendContractSha256 !== undefined && manifest.backendContractSha256 !== backend?.sha256) throw new GameReleaseValidationError('backend_invalid', 'Game backend compatibility declaration changed; prepare a new release')
  // Build receipts describe release, never a preview PCK, and bind the frozen
  // source tree to the recorded toolchain, without comparing it to the current runtime.
  const build = manifest.build
  if (!build) throw new GameReleaseValidationError('build_receipt_invalid', 'Game release build receipt is missing or unsupported; use the current runtime to prepare and save a new checkpoint')
  if (build.profile !== 'release' || !build.toolchain ||
      typeof build.toolchain.engineVersion !== 'string' || build.toolchain.engineVersion !== manifest.engineVersion ||
      !/^sha256:[a-f0-9]{64}$/.test(build.toolchain.engineDigest) ||
      !/^sha256:[a-f0-9]{64}$/.test(build.toolchain.runtimeDigest) ||
      build.snapshotId !== buildKey(inputs, build.toolchain)) {
    throw new GameReleaseValidationError('build_receipt_invalid', 'Game release build profile or snapshot identity is invalid')
  }
  if (!build.export ||
      !['debug', 'release'].every(profile => /^sha256:[a-f0-9]{64}$/.test(build.toolchain.templates?.[profile]))) throw new GameReleaseValidationError('build_receipt_invalid', 'Game release build receipt is incomplete')
  verifyReleaseFiles(site, manifest)
  releaseCheck('build_receipt_invalid', 'Game export receipt is invalid', () => verifyExportReceipt(manifest.build.export, 'release', manifest.build.snapshotId, manifest.files, manifest.artifacts))
  verifyArtifactReferences(site, manifest)
  if (sharing) releaseCheck('sharing_invalid', 'Game release sharing data is invalid', () => verifyShareSite(root, site))
  return manifest
}

/** Historical playback validates saved bytes, independent of the current build policy. */
export function verifyPlayableRelease(site) {
  if (!existsSync(join(site, RELEASE_MANIFEST))) throw new GameReleaseValidationError('release_manifest_missing', 'Game release manifest is missing')
  const manifest = releaseCheck('release_manifest_invalid', 'Game release manifest is invalid', () => JSON.parse(readFileSync(join(site, RELEASE_MANIFEST), 'utf8')))
  // Presentation files have their own validation. Never exempt executable files
  // using paths supplied by sharing metadata (which may itself be malformed).
  const recordedFiles = manifest.files
  manifest.files = verifyReleaseFiles(site, manifest, { optionalPresentation: true })
  manifest.presentationIncomplete = Object.keys(recordedFiles).some(path => presentationFile(path) && !manifest.files[path])
  verifyArtifactReferences(site, manifest)
  return manifest
}

/** Read a saved release without reapplying today's build/export policy.
 * The immutable source identity and playable bytes remain mandatory. Build receipts
 * are checked by verifyRelease when producing/saving a release, not when consuming it.
 */
export function verifySavedRelease(root, site = join(root, 'site'), { gitExecutable = 'git' } = {}) {
  const manifest = verifyPlayableRelease(site)
  releaseCheck('input_manifest_invalid', 'Game source tree record is invalid', () =>
    verifyBuildInputs(root, manifest.inputs, { paths: gitSnapshotPaths(root, { gitExecutable }), gitExecutable }))
  return manifest
}

const presentationFile = path => path === 'game-sharing.json' ||
  ['index.icon.png', 'index.apple-touch-icon.png'].includes(path) || /^share\/[a-f0-9]{64}\.png$/.test(path)

function verifyReleaseFiles(site, manifest, { optionalPresentation = false } = {}) {
  if (!manifest || manifest.schema !== GAME_RELEASE_SCHEMA || typeof manifest.engineVersion !== 'string' || !manifest.engineVersion) {
    throw new GameReleaseValidationError('release_manifest_invalid', 'Game release manifest is invalid')
  }
  for (const extension of ['wasm', 'pck']) {
    const artifact = manifest.artifacts?.[extension]
    if (!artifact || !/^sha256:[a-f0-9]{64}$/.test(artifact.sha256) || artifact.path !== `/manus-storage/game/sha256/${artifact.sha256.slice(7)}.${extension}`) {
      throw new GameReleaseValidationError('artifact_invalid', 'Invalid game release artifact')
    }
  }
  const files = releaseFiles(site, relative => relative === RELEASE_MANIFEST)
  const required = entries => Object.fromEntries(Object.entries(entries ?? {}).filter(([path]) => !optionalPresentation || !presentationFile(path)))
  if (!files['index.html'] || !files['index.js'] || JSON.stringify(required(files)) !== JSON.stringify(required(manifest.files))) throw new GameReleaseValidationError('site_files_changed', 'Game release site files changed')
  // Historical delivery only includes bytes whose stored digest was verified.
  return Object.fromEntries(Object.entries(files).filter(([path, hash]) => manifest.files?.[path] === hash))
}

function verifyArtifactReferences(site, manifest) {
  const shell = readFileSync(join(site, 'index.html'), 'utf8')
  if (!shell.includes(manifest.artifacts.wasm.path) || !shell.includes(manifest.artifacts.pck.path)) throw new GameReleaseValidationError('artifact_invalid', 'Game release shell does not reference its artifacts')
}
