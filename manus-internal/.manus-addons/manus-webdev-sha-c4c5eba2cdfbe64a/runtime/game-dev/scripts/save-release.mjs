import { execFileSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { closeSync, existsSync, lstatSync, openSync, readFileSync, realpathSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { prepareArtifacts, releaseExportLock, tryAcquireExportLock } from './artifacts-lib.mjs'
import { readPreparedSnapshot, writePreparedIndex } from './build-snapshot.mjs'
import { releaseFiles } from './release-manifest.mjs'
import { excludeSnapshotInput } from './snapshot-inputs.mjs'
import { atReleaseStage } from './release-diagnostics.mjs'
import { GameReleaseValidationError } from './release-errors.mjs'
import { gitTreeLimitIssue, gitTreeLimitMessage } from './release-limits.mjs'

const fail = (message, options) => new Error(`Game save ${message}`, options)

// Compare the complete tree, not only the release fingerprint: ignored files
// injected by a Git hook must not silently become part of a published commit.
function verifyTree(git, tree, project) {
  let assets = {}
  if (existsSync(join(project, 'assets.lock.json'))) {
    const lock = JSON.parse(readFileSync(join(project, 'assets.lock.json'), 'utf8'))
    assets = lock.assets ?? lock
  }
  const files = releaseFiles(project, (rel, entry) => {
    if (rel === 'site' || rel.startsWith('site/')) return false
    return excludeSnapshotInput(rel, entry) || (rel.startsWith('assets/') && Object.hasOwn(assets, rel))
  })
  const entries = git(['ls-tree', '-r', '-z', '-l', tree]).toString().split('\0').filter(Boolean).map(entry => {
    const match = /^(100644|100755) blob ([a-f0-9]+) +([0-9]+)\t([\s\S]+)$/.exec(entry)
    if (!match || !Object.hasOwn(files, match[4])) throw fail('Git tree differs from the prepared candidate; inspect Git before retrying')
    return { mode: match[1], object: match[2], size: Number(match[3]), path: match[4] }
  })
  if (entries.length !== Object.keys(files).length) throw fail('Git tree differs from the prepared candidate; inspect Git before retrying')
  // The publish check reads this same tree with the same limits; fail before a
  // commit that publishing would reject and that an unchanged save would keep.
  const overLimit = gitTreeLimitIssue(entries)
  if (overLimit) throw new GameReleaseValidationError('source_too_large', gitTreeLimitMessage(overLimit), overLimit.path)
  for (const { mode, object, path: rel } of entries) {
    const path = join(project, rel)
    const expectedMode = lstatSync(path).mode & 0o111 ? '100755' : '100644'
    if (mode !== expectedMode || git(['hash-object', '--stdin'], { input: readFileSync(path) }).toString().trim() !== object) {
      throw fail('Git tree differs from the prepared candidate; inspect Git before retrying')
    }
  }
}

/** One deterministic preparation/commit operation. Push and checkpoint recording
 * remain owned by the existing Cloud/Local Webdev Git transport. */
export function saveGameRelease(root, message, { prepare = prepareArtifacts } = {}) {
  if (typeof message !== 'string' || !message.trim() || message.includes('\0') || Buffer.byteLength(message) > 4096) {
    throw fail('requires a nonempty commit message of at most 4096 bytes')
  }
  root = realpathSync(root)
  const git = (args, options = {}) => execFileSync('git', args, {
    cwd: root, stdio: 'pipe', timeout: 60_000, maxBuffer: 8 * 1024 * 1024, ...options,
  })
  if (!existsSync(join(root, 'project.godot'))) throw fail('requires a Game project')
  if (realpathSync(git(['rev-parse', '--show-toplevel']).toString().trim()) !== root) throw fail('requires the project Git root')
  // The Host explicitly sets the default Managed index. Resolve the default independently of that override.
  const { GIT_INDEX_FILE: suppliedIndex, ...normalGitEnv } = process.env
  const index = resolve(root, git(['rev-parse', '--git-path', 'index'], { env: normalGitEnv }).toString().trim())
  if (suppliedIndex && resolve(root, suppliedIndex) !== index) throw fail('requires the normal project Git index')
  const branch = git(['symbolic-ref', '--quiet', 'HEAD']).toString().trim()
  const head = git(['rev-parse', 'HEAD']).toString().trim()
  const checkHead = () => {
    if (git(['rev-parse', 'HEAD']).toString().trim() !== head || git(['symbolic-ref', '--quiet', 'HEAD']).toString().trim() !== branch) {
      throw fail('Git HEAD changed during preparation; no commit was attempted')
    }
  }
  if (existsSync(index + '.lock')) throw fail('is blocked by another Git operation')
  for (const marker of ['MERGE_HEAD', 'CHERRY_PICK_HEAD', 'REVERT_HEAD', 'rebase-merge', 'rebase-apply']) {
    if (existsSync(resolve(root, git(['rev-parse', '--git-path', marker]).toString().trim()))) throw fail('requires the current merge or rebase to finish first')
  }
  if (git(['diff', '--cached', '--name-only', '-z']).length) throw fail('found existing staged edits; commit or unstage them first')
  // Fail before a long build if normal Git cannot create an authored commit.
  git(['var', 'GIT_AUTHOR_IDENT'])
  git(['var', 'GIT_COMMITTER_IDENT'])
  const prepared = atReleaseStage('preparation', () => prepare(root))
  checkHead()
  if (!tryAcquireExportLock(root)) throw fail('candidate is busy; no commit was attempted')
  let fd
  let ownsIndexLock = false
  const temporary = join(dirname(index), `.game-save-index-${randomBytes(12).toString('hex')}`)
  const env = { ...process.env, GIT_INDEX_FILE: temporary }
  // Replace the normal index with a commit through the held index.lock. Files
  // in the working tree are never checked out or overwritten.
  let indexWriteStarted = false
  const replaceIndexWith = (sha, scratch) => {
    git(['read-tree', sha], { env: { ...process.env, GIT_INDEX_FILE: scratch } })
    const bytes = readFileSync(scratch)
    indexWriteStarted = true
    writeFileSync(fd, bytes)
    closeSync(fd)
    fd = undefined
    renameSync(index + '.lock', index)
    ownsIndexLock = false
  }
  let tree
  let committed = false
  let commitAttempted = false
  try {
    const snapshot = readPreparedSnapshot(root)
    if (snapshot.manifest.build?.snapshotId !== prepared.source_fingerprint) throw fail('candidate was replaced by another preparation; no commit was attempted')
    checkHead()
    // Hold the normal index lock from candidate construction until the verified
    // commit replaces the index. Every earlier exit, including a killed process,
    // leaves the normal index untouched. Git commit uses the private index, so
    // its own lock does not conflict with this guard.
    fd = openSync(index + '.lock', 'wx', 0o600)
    ownsIndexLock = true
    writePreparedIndex(root, snapshot, env)
    tree = git(['write-tree'], { env }).toString().trim()
    verifyTree(git, tree, snapshot.project)
    checkHead()
    if (tree === git(['rev-parse', 'HEAD^{tree}']).toString().trim()) {
      return { status: 'unchanged', sha: head, snapshotId: snapshot.manifest.build.snapshotId, checkpoint: 'not_recorded' }
    }
    commitAttempted = true
    git(['commit', '--file=-'], { env, input: message, timeout: 120_000 })
    committed = true
    const sha = git(['rev-parse', 'HEAD']).toString().trim()
    if (git(['symbolic-ref', '--quiet', 'HEAD']).toString().trim() !== branch ||
        git(['show', '-s', '--format=%P', sha]).toString().trim() !== head ||
        git(['rev-parse', `${sha}^{tree}`]).toString().trim() !== tree) {
      throw fail('commit was changed by another Git operation or hook; inspect it before pushing, and do not rerun the save blindly')
    }
    // Hooks may change the private index after commit. Match the verified commit
    // without checking out any files or overwriting edits B in the working tree.
    replaceIndexWith(sha, temporary)
    return { status: 'committed', sha, snapshotId: snapshot.manifest.build.snapshotId, checkpoint: 'not_recorded' }
  } catch (error) {
    // A post-commit failure can coexist with a durable local commit. Never
    // rollback or replay it automatically, and never report a saved checkpoint.
    if (commitAttempted) {
      try { committed ||= git(['rev-parse', 'HEAD']).toString().trim() !== head } catch { /* Outcome may be unavailable; preserve Git state. */ }
    }
    if (committed) {
      // The normal index still holds the old HEAD, which reads as a staged revert
      // of the new commit. When HEAD holds the verified tree, align the index as
      // on success. A rewritten commit is left as is for inspection. A separate
      // scratch index avoids a lock left by an interrupted git commit, and a
      // partly written index.lock is never reused.
      if (fd !== undefined && !indexWriteStarted) {
        try {
          const current = git(['rev-parse', 'HEAD']).toString().trim()
          if (git(['rev-parse', `${current}^{tree}`]).toString().trim() === tree) replaceIndexWith(current, temporary + '-head')
        } catch { /* Keep the save error; the index lock is removed below. */ }
      }
      throw fail('local commit exists but save verification did not finish; inspect Git before pushing or retrying. ' +
        'If git diff --cached shows changes, unstage them with git reset (without --hard); do not commit them', { cause: error })
    }
    throw error
  } finally {
    if (fd !== undefined) closeSync(fd)
    if (ownsIndexLock) rmSync(index + '.lock', { force: true })
    for (const path of [temporary, temporary + '-head']) {
      rmSync(path, { force: true })
      rmSync(path + '.lock', { force: true })
    }
    releaseExportLock(root)
  }
}
