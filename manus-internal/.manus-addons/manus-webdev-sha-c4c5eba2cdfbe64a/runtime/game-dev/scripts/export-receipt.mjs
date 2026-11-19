import { createHash } from 'node:crypto'
import { releaseFiles } from './release-manifest.mjs'

const hash = value => 'sha256:' + createHash('sha256').update(JSON.stringify(value)).digest('hex')
const digest = value => typeof value === 'string' && /^sha256:[a-f0-9]{64}$/.test(value)

// Capture the whole output of one export, before public HTML/share decoration.
// Equal bytes may be deduplicated; matching names or engine versions may not.
export function createExportReceipt(directory, profile, snapshotId) {
  const files = releaseFiles(directory, file => ['.build-fingerprint', '.build-files.json', '.build-profile.json'].includes(file))
  const receipt = { profile, snapshotId, files }
  return { ...receipt, digest: hash(receipt) }
}

export function verifyExportReceipt(receipt, profile, snapshotId, files, artifacts) {
  if (!receipt || receipt.profile !== profile || receipt.snapshotId !== snapshotId ||
      !receipt.files || Array.isArray(receipt.files) || typeof receipt.files !== 'object') throw new Error('Game export collection identity is invalid')
  const entries = Object.entries(receipt.files)
  if (!entries.length || entries.length > 20_000 || entries.some(([path, value]) =>
    path.includes('\\') || path.split('/').some(part => !part || part === '.' || part === '..') || !digest(value))) {
    throw new Error('Game export collection files are invalid')
  }
  for (const extension of ['html', 'js', 'wasm', 'pck']) {
    if (!digest(receipt.files['index.' + extension])) throw new Error('Game export collection is incomplete')
  }
  if (receipt.digest !== hash({ profile, snapshotId, files: receipt.files })) throw new Error('Game export collection digest is invalid')
  for (const [path, value] of entries) {
    // The shell is decorated separately and bound by the final manifest/generation.
    if (path === 'index.html') continue
    if (artifacts && (path === 'index.wasm' || path === 'index.pck')) {
      if (artifacts[path.slice(6)]?.sha256 !== value) throw new Error('Game artifacts do not match their export collection')
    } else if (files[path] !== value) throw new Error('Game loader or auxiliary file does not match its export collection')
  }
}
