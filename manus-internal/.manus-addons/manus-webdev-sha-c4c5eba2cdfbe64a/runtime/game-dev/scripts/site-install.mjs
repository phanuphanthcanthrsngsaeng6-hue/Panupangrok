import { cpSync, existsSync, lstatSync, mkdirSync, readFileSync, realpathSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { releaseFiles } from './release-manifest.mjs'

const journalPath = root => join(root, 'dist', '.site-install.json')
const backupPath = root => join(root, 'dist', '.site-previous')
const sameFiles = (directory, files) => JSON.stringify(releaseFiles(directory)) === JSON.stringify(files)
const POINTERS = new Set(['dist/.snapshots/prepared.json', 'dist/.preview/current.json'])
function pointerPath(root, relative) {
  if (!POINTERS.has(relative)) throw new Error('Game release recovery pointer is invalid')
  const target = join(realpathSync(root), relative)
  const parent = dirname(target)
  if (!existsSync(parent)) mkdirSync(parent, { recursive: true })
  if (realpathSync(parent) !== parent || (existsSync(target) && (!lstatSync(target).isFile() || lstatSync(target).isSymbolicLink()))) throw new Error('Game release recovery pointer is invalid')
  return target
}
function remove(directory) {
  if (existsSync(directory) && (!lstatSync(directory).isDirectory() || lstatSync(directory).isSymbolicLink())) {
    throw new Error('Game release directory must be a regular directory')
  }
  rmSync(directory, { recursive: true, force: true })
}

export function recoverSiteInstall(root) {
  const journal = journalPath(root)
  const backup = backupPath(root)
  const site = join(root, 'site')
  if (!existsSync(journal)) {
    // Compatibility with an interrupted installation by the previous runtime.
    if (existsSync(backup) && !existsSync(site)) {
      const files = releaseFiles(backup)
      writeFileSync(journal, JSON.stringify({ version: 1, hadSite: true, files }), { flag: 'wx' })
      recoverSiteInstall(root)
    }
    return
  }
  if (!lstatSync(journal).isFile() || lstatSync(journal).isSymbolicLink()) throw new Error('Game release recovery journal is invalid')
  const state = JSON.parse(readFileSync(journal, 'utf8'))
  if (state.version !== 1 || typeof state.hadSite !== 'boolean' ||
      (state.hadSite && (!state.files || !sameFiles(backup, state.files)))) {
    throw new Error('Game release backup verification failed')
  }
  remove(site)
  if (state.hadSite) {
    cpSync(backup, site, { recursive: true, errorOnExist: true, force: false })
    if (!sameFiles(site, state.files)) throw new Error('Game release recovery verification failed')
  }
  for (const [relative, bytes] of Object.entries(state.pointers ?? {})) {
    const target = pointerPath(root, relative)
    if (bytes === null) rmSync(target, { force: true })
    else {
      if (typeof bytes !== 'string' || bytes.length > 8 * 1024 * 1024) throw new Error('Game release recovery pointer is invalid')
      writeFileSync(target, bytes)
    }
  }
  rmSync(journal)
  try { remove(backup) } catch { /* The committed site is valid; cleanup can retry later. */ }
}

/** Caller holds the export lock; staging and site belong to the local workspace. */
export function installSite(root, staging, verify, { pointers = [] } = {}) {
  const site = join(root, 'site')
  const backup = backupPath(root)
  const journal = journalPath(root)
  const hadSite = existsSync(site)
  const files = hadSite ? releaseFiles(site) : null
  const previousPointers = Object.fromEntries(pointers.map(relative => {
    const file = pointerPath(root, relative)
    return [relative, existsSync(file) ? readFileSync(file, 'utf8') : null]
  }))
  remove(backup)
  if (hadSite) {
    cpSync(site, backup, { recursive: true, errorOnExist: true, force: false })
    if (!sameFiles(backup, files)) throw new Error('Game release backup verification failed')
  }
  // Persist before modifying site; a partial journal fails closed on recovery.
  writeFileSync(journal, JSON.stringify({ version: 1, hadSite, files, pointers: previousPointers }), { flag: 'wx' })
  try {
    remove(site)
    renameSync(staging, site)
    verify(site)
    rmSync(journal)
  } catch (error) {
    recoverSiteInstall(root)
    throw error
  }
  try { remove(backup) } catch { /* Delivery committed; only cleanup remains. */ }
}
