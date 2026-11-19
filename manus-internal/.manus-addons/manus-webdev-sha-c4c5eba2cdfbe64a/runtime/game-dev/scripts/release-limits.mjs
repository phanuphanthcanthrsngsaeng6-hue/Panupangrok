import { boundedReleasePath } from './release-errors.mjs'

// Limits for one saved Godot Git tree. The Runtime save and the server release
// check share them, so a save cannot pass a version that publishing rejects.
export const GAME_RELEASE_MAX_FILES = 10_000
export const GAME_RELEASE_MAX_FILE_BYTES = 32 * 1024 * 1024
export const GAME_RELEASE_MAX_TOTAL_BYTES = 128 * 1024 * 1024
// Recovery originals belong to the checkpoint, but have a separate bounded
// budget from the source/site required to validate the playable release.
export const GAME_RELEASE_MAX_HISTORY_FILE_BYTES = 64 * 1024 * 1024
export const GAME_RELEASE_MAX_HISTORY_BYTES = 512 * 1024 * 1024

// Font files share the whole-project budget without a separate file cap.
export function isGameCodeFontPath(path) {
  return /\.(?:ttf|otf|woff2?|ttc|otc)$/i.test(path)
}

// ASSET_HISTORY_DIRECTORY in asset-edit.mjs; a literal keeps the save free of its dependencies.
const HISTORY_PREFIX = '.manus-asset-history/'
const mib = bytes => `${Math.round(bytes / 1024 / 1024 * 10) / 10} MiB`

export const GAME_RELEASE_SIZE_RECOVERY =
  `A saved Godot version may contain at most ${GAME_RELEASE_MAX_FILES.toLocaleString('en-US')} Git files. ` +
  `Files outside ${HISTORY_PREFIX} may total ${mib(GAME_RELEASE_MAX_TOTAL_BYTES)}, ` +
  `with at most ${mib(GAME_RELEASE_MAX_FILE_BYTES)} per non-font file; ${HISTORY_PREFIX} has a separate ` +
  `${mib(GAME_RELEASE_MAX_HISTORY_BYTES)} budget with at most ${mib(GAME_RELEASE_MAX_HISTORY_FILE_BYTES)} per file. ` +
  // Media under assets/ is registered in assets.lock.json and kept out of the
  // Git tree, so only media outside assets/ counts against these limits.
  'Keep media the game loads under assets/ and update its res:// paths; the save stores it as managed assets outside Git. ' +
  'Delete files the game does not load, such as source recordings, or move them outside the project. ' +
  'Do not use git rm --cached, because the next save rejects staged edits. Then save again.'

/** Adds tree entries in Git order and returns the first limit they exceed. */
export function createGitTreeBudget() {
  let total = 0
  let history = 0
  return (path, size) => {
    if (path.startsWith(HISTORY_PREFIX)) {
      history += size
      if (size > GAME_RELEASE_MAX_HISTORY_FILE_BYTES) return { limit: 'history_file_bytes', actual: size, max: GAME_RELEASE_MAX_HISTORY_FILE_BYTES, path }
      if (history > GAME_RELEASE_MAX_HISTORY_BYTES) return { limit: 'history_bytes', actual: history, max: GAME_RELEASE_MAX_HISTORY_BYTES }
      return undefined
    }
    total += size
    if (!isGameCodeFontPath(path) && size > GAME_RELEASE_MAX_FILE_BYTES) return { limit: 'file_bytes', actual: size, max: GAME_RELEASE_MAX_FILE_BYTES, path }
    if (total > GAME_RELEASE_MAX_TOTAL_BYTES) return { limit: 'total_bytes', actual: total, max: GAME_RELEASE_MAX_TOTAL_BYTES }
    return undefined
  }
}

/** First limit exceeded by a whole tree listing of `{ path, size }` entries. */
export function gitTreeLimitIssue(entries) {
  if (entries.length > GAME_RELEASE_MAX_FILES) return { limit: 'files', actual: entries.length, max: GAME_RELEASE_MAX_FILES }
  const add = createGitTreeBudget()
  for (const { path, size } of entries) {
    const issue = add(path, size)
    if (issue) return issue
  }
  return undefined
}

// Also used by the server readiness note for the exceeded limit.
export const GAME_RELEASE_LIMIT_LABELS = {
  files: 'the Git file count',
  total_bytes: `the total size of files outside ${HISTORY_PREFIX}`,
  file_bytes: 'the size of one non-font file',
  history_bytes: `the total size of ${HISTORY_PREFIX}`,
  history_file_bytes: `the size of one ${HISTORY_PREFIX} file`,
}

export function gitTreeLimitMessage(issue) {
  const amount = value => issue.limit === 'files' ? value.toLocaleString('en-US') : mib(value)
  const path = boundedReleasePath(issue.path)
  return `Game release exceeds the publishing limit for ${GAME_RELEASE_LIMIT_LABELS[issue.limit]}${path ? ` (${path})` : ''}: ` +
    `${amount(issue.actual)} is above ${amount(issue.max)}.`
}
