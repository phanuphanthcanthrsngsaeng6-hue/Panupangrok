import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, relative, resolve, sep } from 'node:path'

export const ORIGIN_FILE = '.manus-game-template.json'
const RTS_CORE = [
  'scripts/sim/rts_simulation.gd',
  'scripts/view/battlefield.gd',
  'scripts/core/iso_projection.gd',
]
const SKIP = new Set(['.git', '.godot', 'node_modules', 'dist', 'site', 'docs', 'tests', 'test-output'])

function templateOrigin(text, bootstrapCommit = null) {
  const origin = JSON.parse(text)
  if (origin.schema_version !== 1 || typeof origin.template_id !== 'string' || typeof origin.game_genre !== 'string') {
    throw new Error('Game template origin is invalid; restore the bootstrap record before checkpointing')
  }
  return { ...origin, bootstrap_commit: bootstrapCommit }
}

export function readTemplateOrigin(root) {
  const marker = join(root, ORIGIN_FILE)
  const pending = () => existsSync(marker) ? templateOrigin(readFileSync(marker, 'utf8')) : null
  const git = (args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', timeout: 10_000, stdio: ['ignore', 'pipe', 'pipe'] })
  try { git(['rev-parse', '--git-dir']) } catch (error) {
    // A new Local project can precede Git initialization. Corrupt metadata and
    // authorization failures must not silently become an untracked project.
    if (!existsSync(join(root, '.git')) && error.status === 128 && /not a git repository/.test(String(error.stderr))) return pending()
    throw error
  }
  try { git(['rev-parse', '--verify', '--quiet', 'HEAD']) } catch (error) {
    if (error.status !== 1) throw error
    const branch = git(['symbolic-ref', '--quiet', 'HEAD']).trim()
    if (!branch.startsWith('refs/heads/')) throw error
    try { git(['show-ref', '--verify', '--quiet', branch]) } catch (branchError) {
      if (branchError.status === 1) return pending() // Valid symbolic HEAD, absent branch: unborn Git.
      throw branchError
    }
    throw error
  }
  // Once committed, the first recorded provenance remains authoritative even
  // if the current marker is modified or removed.
  const commits = git(['log', '--first-parent', '--reverse', '--format=%H', '--', ORIGIN_FILE]).trim().split('\n').filter(Boolean)
  if (!commits.length) return pending()
  const prefix = git(['rev-parse', '--show-prefix']).trim()
  return templateOrigin(git(['show', `${commits[0]}:${prefix}${ORIGIN_FILE}`]), commits[0])
}

function projectFile(root, resource) {
  if (!resource.startsWith('res://')) throw new Error('Game entry point must resolve to a project resource')
  const file = resolve(root, resource.slice(6))
  const rel = relative(resolve(root), file)
  if (!rel || rel === '..' || rel.startsWith(`..${sep}`)) throw new Error('Game resource is outside the project')
  return rel.split(sep).join('/')
}

function scriptIndex(root) {
  const classes = new Map()
  const sources = new Map()
  const uids = new Map()
  const walk = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const file = join(directory, entry.name)
      if (entry.isDirectory() && !SKIP.has(entry.name)) walk(file)
      else if (entry.isFile() && /\.(gd|tscn|tres)$/.test(entry.name)) {
        const rel = relative(root, file).split(sep).join('/')
        const text = readFileSync(file, 'utf8').replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[^\n]*)/g,
          (token) => token.startsWith('#') ? '' : token)
        sources.set(rel, text)
        const uid = entry.name.endsWith('.gd') && existsSync(`${file}.uid`)
          ? readFileSync(`${file}.uid`, 'utf8').trim()
          : text.match(/^\[gd_(?:scene|resource)\b[^\n]*\buid="([^"]+)"/m)?.[1]
        if (uid) uids.set(uid, rel)
        const name = text.match(/^\s*class_name\s+(\w+)/m)?.[1]
        if (name) {
          if (classes.has(name)) throw new Error(`Duplicate game class: ${name}`)
          classes.set(name, rel)
        }
      }
    }
  }
  walk(root)
  return { classes, sources, uids }
}

export function validateTemplateRetention(root, origin = readTemplateOrigin(root)) {
  if (!origin) return { status: 'legacy', reason: 'No recorded initialization contract' }
  if (origin.template_id !== 'game-rts' || origin.game_genre !== 'rts') {
    return { status: 'not-required', template: origin.template_id, genre: origin.game_genre }
  }
  const config = readFileSync(join(root, 'project.godot'), 'utf8')
  const main = config.match(/^\s*run\/main_scene\s*=\s*"([^"]+)"/m)?.[1]
  if (!main) throw new Error('RTS template validation: project.godot has no gameplay entry scene')
  const { classes, sources, uids } = scriptIndex(root)
  const resolveResource = (resource) => {
    if (!resource.startsWith('uid://')) return projectFile(root, resource)
    const file = uids.get(resource)
    if (!file) throw new Error(`RTS template validation: unresolved resource ${resource}`)
    return file
  }
  const pending = [resolveResource(main)]
  const reachable = new Set()
  while (pending.length) {
    const file = pending.pop()
    if (reachable.has(file)) continue
    reachable.add(file)
    const source = sources.get(file)
    if (source === undefined) throw new Error(`RTS template validation: missing gameplay resource ${file}`)
    for (const [, resource] of source.matchAll(/["'](res:\/\/[^"']+\.(?:gd|tscn|tres)|uid:\/\/[^"']+)["']/g)) {
      // Scene/resource UID declarations identify this resource itself.
      if (resource.startsWith('uid://') && !uids.has(resource)) continue
      pending.push(resolveResource(resource))
    }
    // Godot's registered classes can be used without an explicit preload.
    const code = source.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, '')
    for (const identifier of code.matchAll(/\b[A-Za-z_]\w*\b/g)) {
      const dependency = classes.get(identifier[0])
      if (dependency && dependency !== file) pending.push(dependency)
    }
  }
  const missing = RTS_CORE.filter((file) => !reachable.has(file))
  if (missing.length) {
    throw new Error(`RTS template core is disconnected from ${main}: ${missing.join(', ')}. Extend the initialized RTS implementation; keeping unused template files does not satisfy the adaptation contract.`)
  }
  return { status: 'passed', template: origin.template_id, genre: origin.game_genre, entry: main, core: RTS_CORE }
}
