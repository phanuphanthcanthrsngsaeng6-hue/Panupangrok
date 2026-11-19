#!/usr/bin/env node
// Project-local attribution is independent of storage registration and requires no network access.
import { createHash, randomUUID } from 'node:crypto'
import { closeSync, existsSync, lstatSync, mkdirSync, openSync, readFileSync, readdirSync, readSync, realpathSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { basename, dirname, extname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { provenanceReceiptEvents } from './provenance-receipts.mjs'
import { bundledFontLicense, provenanceFontFiles, shareReceiptEvents } from './provenance-share-receipts.mjs'
import { isModelResourcePath, modelResourceDependencies } from './model-dependencies.mjs'

export const PROVENANCE_FILE = 'asset-provenance.json'
// Legacy reports remain excluded from source fingerprints; they are no longer written.
export const PROVENANCE_REPORT = 'asset-provenance-report.md'
const MAX_JSON = 16 * 1024 * 1024
const MAX_FILES = 20_000
const MEDIA = new Set('.png .jpg .jpeg .webp .gif .svg .avif .bmp .tga .exr .hdr .wav .ogg .mp3 .flac .m4a .aac .mp4 .webm .ttf .otf .woff .woff2 .glb .gltf .obj .mtl .fbx .blend .dae .bin'.split(' '))
const CODE = new Set('.gd .tscn .tres .godot .gdshader .cfg .json .js .mjs .ts .tsx .jsx .html .css'.split(' '))
const SKIP = new Set(['.git', '.godot', '.manus-game-tools', '.manus-asset-history', 'node_modules', 'dist', 'site', 'test', 'tests', 'tools', 'docs', 'captures', 'test-output'])
const ORIGINS = new Set(['catalog', 'external', 'template', 'procedural', 'ai', 'derivative', 'unknown'])
const GENERATED = new Set(['summary', 'export', 'warnings'])
const COMPUTED_ASSET = new Set(['used', 'shipped', 'useEvidence', 'referenceEvidence', 'declaredUseEvidence', 'status'])
const COVERAGE_DECISIONS = new Set(['existing', 'catalog_direct', 'catalog_adapted', 'intentional_procedural', 'procedural_gap', 'unresolved'])
const SEARCH_OUTCOMES = new Set(['results', 'empty', 'cancelled', 'authorization_failure', 'service_unavailable', 'request_failed'])
const MAX_SEARCH_ATTEMPTS = 128
const MAX_SEARCH_OUTCOMES = 8
const fail = message => { throw new Error(`Asset provenance: ${message}`) }
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value
const json = value => JSON.stringify(canonical(value), null, 2) + '\n'
const digest = bytes => 'sha256:' + createHash('sha256').update(bytes).digest('hex')
const text = (value, limit = 1024) => typeof value === 'string' ? value.replace(/[\x00-\x1f\x7f]/g, ' ').slice(0, limit).trim() : undefined
const sha = value => typeof value === 'string' && /^(?:sha256:)?[a-f0-9]{64}$/.test(value) ? (value.startsWith('sha256:') ? value : `sha256:${value}`) : undefined
const entries = value => value && typeof value === 'object' && !Array.isArray(value) ? Object.entries(value) : []
const count = (values, predicate = () => true) => values.filter(predicate).length

function safeRel(value) {
  return typeof value === 'string' && value.length <= 2048 && !value.startsWith('/') && !/[\\:\x00-\x1f]/.test(value) &&
    value.split('/').every(part => part && part !== '.' && part !== '..')
}
function assetRel(value) {
  return safeRel(value) && !value.split('/').some(part => part.startsWith('.') || SKIP.has(part)) &&
    ![PROVENANCE_FILE, PROVENANCE_REPORT, 'assets.lock.json'].includes(value)
}
export function isProvenanceMediaPath(path) { return assetRel(path) && MEDIA.has(extname(path).toLowerCase()) }
function safeFile(root, name, missing = false) {
  if (!safeRel(name)) fail('use a project-relative path without traversal')
  let current = root
  for (const part of name.split('/')) {
    current = join(current, part)
    let stat
    try { stat = lstatSync(current) } catch (error) { if (missing && error.code === 'ENOENT') continue; throw error }
    if (stat.isSymbolicLink()) fail('symbolic links are not supported')
  }
  return current
}
function readJson(file, fallback) {
  if (!existsSync(file)) return fallback
  const stat = lstatSync(file)
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size > MAX_JSON) fail('metadata must be a bounded regular JSON file')
  return JSON.parse(readFileSync(file, 'utf8'))
}
function hashFile(file) {
  const stat = lstatSync(file)
  if (!stat.isFile() || stat.isSymbolicLink()) fail('asset must be a regular file')
  const hash = createHash('sha256'), buffer = Buffer.alloc(1024 * 1024), fd = openSync(file, 'r')
  try { for (let length; (length = readSync(fd, buffer, 0, buffer.length, null));) hash.update(buffer.subarray(0, length)) }
  finally { closeSync(fd) }
  return { sha256: 'sha256:' + hash.digest('hex'), size: stat.size }
}
function rootPath(root) {
  const path = resolve(root)
  if (!lstatSync(path).isDirectory() || lstatSync(path).isSymbolicLink()) fail('project directory must not be a symbolic link')
  const absolute = realpathSync(path)
  if (!lstatSync(safeFile(absolute, 'project.godot')).isFile()) fail('run from a Godot game project')
  return absolute
}
export function findGameProject(start, boundary) {
  try {
    if (lstatSync(resolve(start)).isSymbolicLink()) return null
    let directory = realpathSync(resolve(start))
    const lower = boundary ? realpathSync(resolve(boundary)) : null
    const within = lower && relative(lower, directory).split(sep).join('/')
    if (lower && (within === '..' || within.startsWith('../') || within.startsWith('/'))) return null
    for (;;) {
      if (realpathSync(directory) !== directory) return null
      if (existsSync(join(directory, 'project.godot'))) return rootPath(directory)
      if (directory === lower || dirname(directory) === directory) return null
      directory = dirname(directory)
    }
  } catch { return null }
}
function lock(root, work) {
  const directory = safeFile(root, 'dist/.asset-provenance-lock', true)
  mkdirSync(dirname(directory), { recursive: true })
  let acquired = false
  for (let attempt = 0; attempt < 100; attempt++) {
    try { mkdirSync(directory); acquired = true; break }
    catch (error) { if (error.code !== 'EEXIST') throw error; Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 20) }
  }
  if (!acquired) fail('another writer is active; retry, or inspect dist/.asset-provenance-lock after an interrupted writer')
  try { return work() } finally { rmSync(directory, { recursive: true }) }
}
function atomic(root, name, body) {
  const file = safeFile(root, name, true)
  if (existsSync(file) && readFileSync(file, 'utf8') === body) return
  const temporary = safeFile(root, `${name}.tmp-${randomUUID()}`, true)
  try { writeFileSync(temporary, body, { flag: 'wx', mode: 0o600 }); renameSync(temporary, file) }
  finally { rmSync(temporary, { force: true }) }
}
function cleanUrl(value) {
  try {
    const url = new URL(value)
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return undefined
    // Signed query strings and fragments are access material, never attribution.
    url.search = ''; url.hash = ''
    return url.toString()
  } catch { return undefined }
}
function pick(value, keys) {
  const output = {}
  for (const key of keys) {
    const item = key === 'url' ? cleanUrl(value?.[key]) : text(value?.[key])
    if (item) output[key] = item
  }
  return output
}
function source(value) {
  const result = pick(value, ['snapshotId', 'packId', 'catalogPath', 'memberPath', 'metadataPath', 'url', 'author', 'name', 'starterId'])
  for (const key of ['catalogPath', 'memberPath', 'metadataPath']) if (result[key] && !safeRel(result[key])) fail('invalid catalog source path')
  if (sha(value?.metadataSha256)) result.metadataSha256 = sha(value.metadataSha256)
  // Repository attribution is descriptive only; it grants no license rights or
  // receipt authority. Keep exact public identifiers, never credentials or URLs.
  if (typeof value?.repository === 'string' && value.repository === text(value.repository, 255) &&
      /^[A-Za-z0-9][A-Za-z0-9_.-]*\/[A-Za-z0-9][A-Za-z0-9_.-]*$/.test(value.repository)) result.repository = value.repository
  if (typeof value?.commit === 'string' && [40, 64].includes(value.commit.length) && /^[a-f0-9]+$/.test(value.commit)) result.commit = value.commit
  if (value?.sourcePath !== undefined) {
    if (!safeRel(value.sourcePath)) fail('invalid repository source path')
    result.sourcePath = value.sourcePath
  }
  if (typeof value?.license === 'string' && value.license === text(value.license, 128) && /^[A-Za-z0-9][A-Za-z0-9.+-]*$/.test(value.license)) result.license = value.license
  return result
}
function license(value) {
  const result = pick(value, ['id', 'url', 'notice', 'attribution'])
  for (const key of ['attributionRequired', 'copyrightNoticeRequired', 'licenseNoticeRequired', 'modificationNoticeRequired',
    'commercialUseAllowed', 'modificationAllowed', 'redistributionAllowed', 'editableProjectDistributionAllowed', 'reusableTemplateDistributionAllowed']) {
    if (typeof value?.[key] === 'boolean') result[key] = value[key]
  }
  if (result.notice && !assetRel(result.notice)) fail('license notice must be a project-relative file')
  return result
}
function compatibleFacts(left, right, includeLabels = true) {
  if (left.origin && right.origin && left.origin !== 'unknown' && right.origin !== 'unknown' && left.origin !== right.origin) return false
  if (['snapshotId', 'catalogPath', 'memberPath', 'packId', 'url', 'starterId', 'metadataPath', 'metadataSha256', 'repository', 'commit', 'sourcePath', ...(includeLabels ? ['author', 'name', 'license'] : [])].some(key =>
    left.source?.[key] && right.source?.[key] && left.source[key] !== right.source[key])) return false
  if (['provider', 'model', 'requestId'].some(key => left.generator?.[key] && right.generator?.[key] && left.generator[key] !== right.generator[key])) return false
  return true
}
function sameInput(left, right) {
  if (sha(left.sha256) !== sha(right.sha256) || left.path && right.path && left.path !== right.path || !compatibleFacts(left, right)) return false
  const anchors = input => [input.path, input.source?.snapshotId, input.source?.catalogPath, input.source?.memberPath,
    input.source?.packId, input.source?.url, input.source?.starterId, input.source?.repository, input.source?.commit, input.source?.sourcePath, input.generator?.requestId]
  const leftAnchors = anchors(left), rightAnchors = anchors(right)
  return Boolean(left.path && left.path === right.path ||
    ['catalogPath', 'packId', 'url', 'starterId'].some(key => left.source?.[key] && left.source[key] === right.source?.[key]) ||
    ['repository', 'commit', 'sourcePath'].every(key => left.source?.[key] && left.source[key] === right.source?.[key]) ||
    left.generator?.requestId && left.generator.requestId === right.generator?.requestId) ||
    !leftAnchors.some(Boolean) && !rightAnchors.some(Boolean)
}
// Fill missing facts on the same input identity without replacing annotations or
// choosing between distinct catalog snapshots/collections that share bytes.
function mergeInputs(preferred = [], supplemental = []) {
  const result = [...preferred]
  for (const input of supplemental) {
    const identical = result.findIndex(candidate => json(candidate) === json(input))
    if (identical >= 0) continue
    const matches = result.map((candidate, index) => sameInput(candidate, input) ? index : -1).filter(index => index >= 0)
    if (matches.length !== 1) { result.push(input); continue }
    const index = matches[0], previous = result[index]
    result[index] = { ...input, ...previous,
      source: { ...input.source, ...previous.source }, license: { ...input.license, ...previous.license },
      ...(input.generator || previous.generator ? { generator: { ...input.generator, ...previous.generator } } : {}) }
  }
  return result
}
function pathList(value) {
  if (value === undefined) return []
  if (!Array.isArray(value) || value.length > MAX_FILES || value.some(item => !assetRel(item))) fail('usedBy must contain project-relative runtime source paths')
  return [...new Set(value)].sort()
}
function metadata(event) {
  const origin = event.origin ?? 'unknown'
  if (!ORIGINS.has(origin)) fail('unknown origin; use catalog, external, template, procedural, ai, derivative, or unknown')
  for (const field of ['inputs', 'transformations', 'regions']) if (event[field] !== undefined && !Array.isArray(event[field])) fail(`${field} must be an array`)
  const inputs = (event.inputs ?? []).map(input => {
    if (!sha(input.sha256)) fail('each transformation input needs its exact SHA-256')
    if (input.path && !assetRel(input.path)) fail('invalid transformation input path')
    return { ...(input.path ? { path: input.path } : {}), sha256: sha(input.sha256), source: source(input.source), license: license(input.license),
      ...(ORIGINS.has(input.origin) ? { origin: input.origin } : {}), ...(input.generator ? { generator: pick(input.generator, ['provider', 'model', 'requestId']) } : {}) }
  })
  const transformations = (event.transformations ?? []).map(value => {
    const item = pick(value, ['operation', 'tool', 'description'])
    if (!item.operation) fail('transformation operation is required')
    return item
  })
  const regions = (event.regions ?? []).map(value => {
    if (!text(value.id, 256) || !Array.isArray(value.rect) || value.rect.length !== 4 || value.rect.some(n => !Number.isSafeInteger(n) || n < 0) || !value.rect[2] || !value.rect[3]) fail('sprite regions need an id and a pixel rectangle [x,y,width,height]')
    return { id: text(value.id, 256), rect: value.rect, usedBy: pathList(value.usedBy) }
  })
  if (new Set(regions.map(value => value.id)).size !== regions.length) fail('sprite region IDs must be unique per file')
  if (new Set(regions.map(value => value.rect.join(','))).size !== regions.length) fail('sprite rectangles must be unique per file; aliases do not create extra regions')
  if (inputs.length > 256 || transformations.length > 256 || regions.length > 10_000) fail('too many provenance declarations')
  return { origin, source: source(event.source), license: license(event.license), inputs, transformations,
    generator: pick(event.generator, ['provider', 'model', 'requestId']), regions, usedBy: pathList(event.usedBy),
    ...(event.receipt && safeRel(event.receipt.path) && sha(event.receipt.sha256) ? { receipt: { path: event.receipt.path, sha256: sha(event.receipt.sha256) } } : {}) }
}
function blank() { return { version: 1, discoveries: {}, downloads: {}, assets: {}, procedures: {} } }
function coverage(value) {
  return value.visualCoverage ??= { version: 1, attempts: {}, resolutions: {}, overflowEvents: 0 }
}
function boundedString(value, maximum, label, empty = false, multiline = false) {
  if (typeof value !== 'string' || value.length > maximum || (multiline ? /[\x00-\x08\x0b\x0c\x0e-\x1f]/ : /[\x00-\x1f\x7f]/).test(value) || (!empty && !value.trim())) fail(`invalid ${label}`)
  return value
}
function roleId(value) {
  if (typeof value !== 'string' || !/^[a-z0-9][a-z0-9_-]{0,63}$/.test(value)) fail('invalid visual coverage role ID')
  return value
}
function expectedCoverage(input) {
  if (!/^gbp_[a-f0-9]{24,64}$/.test(input?.blueprintId ?? '') || !Number.isSafeInteger(input.approvedRevision) || input.approvedRevision < 1 ||
      !Array.isArray(input.roles) || input.roles.length > 12) fail('invalid approved visual coverage projection')
  const roles = input.roles.map(role => ({ id: roleId(role.id), label: boundedString(role.label, 120, 'role label', false, true),
    description: boundedString(role.description, 400, 'role description', false, true) }))
  if (new Set(roles.map(role => role.id)).size !== roles.length) fail('duplicate visual coverage role IDs')
  const customRequest = input.customRequest === undefined ? undefined : boundedString(input.customRequest, 2000, 'coverage request', false, true)
  const expected = { blueprintId: input.blueprintId, approvedRevision: input.approvedRevision, roles, ...(customRequest ? { customRequest } : {}) }
  if (Buffer.byteLength(JSON.stringify({ roles, ...(customRequest ? { customRequest } : {}) })) > 8192) fail('approved visual coverage exceeds the byte budget')
  const hash = createHash('sha256').update(JSON.stringify(expected)).digest('hex')
  if (input.digest !== undefined && input.digest !== hash) fail('approved visual coverage digest mismatch')
  return { ...expected, digest: hash }
}
function uniqueStrings(value, maximum, validate, label) {
  if (value === undefined) return []
  if (!Array.isArray(value) || value.length > maximum) fail(`invalid ${label}`)
  const result = value.map(validate)
  if (new Set(result).size !== result.length) fail(`duplicate ${label}`)
  return result
}
function evidencePath(value) {
  if (!assetRel(value) || !CODE.has(extname(value).toLowerCase()) && !MEDIA.has(extname(value).toLowerCase())) fail('review inputs must be runtime source or asset paths')
  return value
}
function capturePath(value) {
  if (!safeRel(value) || !/\.(?:png|jpe?g|webp)$/i.test(value) || value.split('/').some(part => part.startsWith('.') || part === 'node_modules')) fail('rendered evidence must be a project-relative image')
  return value
}
function renderedEvidence(root, input, stored = false) {
  if (input === undefined) return undefined
  const paths = uniqueStrings(input.paths, 8, item => stored ? capturePath(item.path) : capturePath(item), 'rendered paths')
  const inputs = uniqueStrings(input.inputs, 64, item => stored ? evidencePath(item.path) : evidencePath(item), 'review inputs')
  if (!paths.length || !inputs.length || !inputs.some(path => CODE.has(extname(path)))) fail('rendered review requires captures and relevant runtime source inputs')
  const facts = (names, rows) => names.map((path, index) => {
    const identity = stored ? rows[index] : hashFile(safeFile(root, path))
    if (!sha(identity.sha256)) fail('invalid rendered evidence hash')
    return { path, sha256: sha(identity.sha256) }
  })
  return { paths: facts(paths, input.paths), inputs: facts(inputs, input.inputs) }
}
function resolution(root, event, stored = false) {
  if (!COVERAGE_DECISIONS.has(event.decision)) fail('invalid visual coverage decision')
  const result = { decision: event.decision,
    assetIds: uniqueStrings(event.assetIds, 64, value => { if (!isProvenanceMediaPath(value)) fail('invalid coverage asset path'); return value }, 'coverage assets'),
    procedureIds: uniqueStrings(event.procedureIds, 32, value => { if (!text(value, 256) || ['__proto__', 'constructor', 'prototype'].includes(value)) fail('invalid coverage procedure'); return value }, 'coverage procedures'),
    attemptIds: uniqueStrings(event.attemptIds, 32, value => { if (!sha(value)) fail('invalid search attempt ID'); return sha(value) }, 'coverage attempts') }
  if (event.residualGap !== undefined) result.residualGap = boundedString(event.residualGap, 2000, 'coverage residual gap')
  if (event.renderedEvidence !== undefined) result.renderedEvidence = renderedEvidence(root, event.renderedEvidence, stored)
  if (stored && /^[a-f0-9]{64}$/.test(event.expectedDigest ?? '')) result.expectedDigest = event.expectedDigest
  return result
}
function searchAttempt(event) {
  const rawQuery = event.query ?? ''
  const query = boundedString(typeof rawQuery === 'string' ? rawQuery.replace(/\s+/g, ' ').trim() : rawQuery, 256, 'search query', true)
  const filters = {}
  for (const key of ['category', 'subcategory', 'sourceId', 'formats', 'tags', 'artStyles']) if (event.filters?.[key] !== undefined) {
    if (!Array.isArray(event.filters[key]) || !event.filters[key].length || event.filters[key].length > 20) fail('invalid search filters')
    filters[key] = [...new Set(event.filters[key].map(item => boundedString(item, 256, 'search filter')))].sort()
  }
  if (event.filters?.maxArchiveBytes !== undefined) {
    if (!Number.isSafeInteger(event.filters.maxArchiveBytes) || event.filters.maxArchiveBytes < 0) fail('invalid search size filter')
    filters.maxArchiveBytes = event.filters.maxArchiveBytes
  }
  if (!Number.isSafeInteger(event.limit) || event.limit < 1 || event.limit > 20 || event.pageHash !== undefined && !sha(event.pageHash)) fail('invalid search page identity')
  const request = { query, filters, limit: event.limit, ...(event.pageHash ? { pageHash: sha(event.pageHash) } : {}),
    ...(event.requestedSnapshotId ? { requestedSnapshotId: boundedString(event.requestedSnapshotId, 256, 'requested snapshot') } : {}) }
  if (!SEARCH_OUTCOMES.has(event.outcome)) fail('invalid search outcome')
  const outcome = { outcome: event.outcome,
    ...(event.snapshotId ? { snapshotId: boundedString(event.snapshotId, 256, 'search snapshot') } : {}),
    packIds: uniqueStrings(event.packIds, 20, item => boundedString(item, 1024, 'search pack ID'), 'search pack IDs') }
  if (['results', 'empty'].includes(event.outcome)) {
    if (event.outcome === 'empty' && outcome.packIds.length || event.outcome === 'results' && !outcome.packIds.length) fail('search outcome must match returned packs')
    if (event.total !== undefined) {
      if (!Number.isSafeInteger(event.total) || event.total < 0) fail('invalid search total')
      outcome.total = event.total
    }
    outcome.hasMore = event.hasMore === true
  }
  return { id: digest(json(request)), request, outcomeId: digest(json(outcome)), outcome }
}
export function catalogSearchAttemptId(event) { return searchAttempt(event).id }
function applySearchAttempt(value, event) {
  const data = coverage(value), attempt = searchAttempt(event)
  if (!data.attempts[attempt.id] && Object.keys(data.attempts).length >= MAX_SEARCH_ATTEMPTS) { data.overflowEvents++; return }
  const record = data.attempts[attempt.id] ??= { ...attempt.request, outcomes: {} }
  if (!record.outcomes[attempt.outcomeId] && Object.keys(record.outcomes).length >= MAX_SEARCH_OUTCOMES) { data.overflowEvents++; return }
  record.outcomes[attempt.outcomeId] = attempt.outcome
}
function loadCoverage(root, value, input) {
  if (input === undefined) return
  if (input?.version !== 1) fail('unsupported visual coverage version')
  const data = coverage(value)
  if (input.expected !== undefined) data.expected = expectedCoverage(input.expected)
  if (entries(input.attempts).length > MAX_SEARCH_ATTEMPTS) fail('too many search attempts')
  for (const [id, attempt] of entries(input.attempts)) {
    if (entries(attempt.outcomes).length > MAX_SEARCH_OUTCOMES) fail('too many search outcomes')
    for (const [outcomeId, outcome] of entries(attempt.outcomes)) {
      const event = { ...attempt, ...outcome }, parsed = searchAttempt(event)
      if (parsed.id !== id || parsed.outcomeId !== outcomeId) fail('stored search identity mismatch')
      applySearchAttempt(value, event)
    }
  }
  if (entries(input.resolutions).length > 64) fail('too many coverage resolutions')
  for (const [id, item] of entries(input.resolutions)) data.resolutions[roleId(id)] = resolution(root, item, true)
  data.overflowEvents = Number.isSafeInteger(input.overflowEvents) && input.overflowEvents >= 0 ? input.overflowEvents : 0
  if (input.scopeChange) data.scopeChange = scopeChange(input.scopeChange)
  if (input.previousResolutions !== undefined) {
    if (entries(input.previousResolutions).length > 64) fail('too many historical coverage resolutions')
    data.previousResolutions = Object.fromEntries(entries(input.previousResolutions).map(([id, item]) => [roleId(id), resolution(root, item, true)]))
  }
  if (input.projectionRepaired === true) data.projectionRepaired = true
}
function scopeChange(event) {
  return { instructionRef: boundedString(event.instructionRef, 500, 'scope instruction reference'),
    reason: boundedString(event.reason, 2000, 'scope change reason'), roleIds: uniqueStrings(event.roleIds, 12, roleId, 'changed role IDs') }
}
function load(root, trustedExpected) {
  const value = readJson(safeFile(root, PROVENANCE_FILE, true), blank())
  if (value.version !== 1 || !value.assets || Array.isArray(value.assets)) fail('unsupported provenance manifest version')
  if (entries(value.assets).length > MAX_FILES) fail('too many asset records')
  const result = blank()
  for (const [path, asset] of entries(value.assets)) {
    if (!assetRel(path)) fail('invalid stored asset path')
    if (!sha(asset.sha256) || !Number.isSafeInteger(asset.size) || asset.size < 0) fail('stored assets require a SHA-256 and byte size')
    const versions = Object.fromEntries(entries(asset.versions).map(([key, entry]) => {
      if (!sha(key) || sha(key) !== sha(entry.sha256)) fail('invalid asset history hash')
      return [sha(key), historical(entry)]
    }))
    result.assets[path] = { ...metadata(asset), sha256: sha(asset.sha256), size: asset.size, ...(Object.keys(versions).length ? { versions } : {}) }
  }
  for (const event of Object.values(value.discoveries ?? {})) applyEvent(root, result, { kind: 'discovery', snapshotId: event.snapshotId, query: event.query, results: [event] })
  for (const event of Object.values(value.downloads ?? {})) applyEvent(root, result, { ...event, kind: 'download' })
  for (const [id, event] of entries(value.procedures)) applyEvent(root, result, { ...event, id, kind: 'procedure' })
  if (trustedExpected && value.visualCoverage?.expected &&
      value.visualCoverage.expected.blueprintId === trustedExpected.blueprintId &&
      value.visualCoverage.expected.approvedRevision === trustedExpected.approvedRevision &&
      json(value.visualCoverage.expected) !== json(trustedExpected)) {
    value.visualCoverage.expected = trustedExpected
    value.visualCoverage.projectionRepaired = true
  }
  loadCoverage(root, result, value.visualCoverage)
  return result
}
function historical(entry) {
  return { ...metadata(entry), sha256: entry.sha256, size: entry.size }
}
function applyEvent(root, value, event) {
  if (!event || typeof event !== 'object') fail('event must be an object')
  if (event.kind === 'visual_coverage_expected') {
    const expected = expectedCoverage(event.expected), data = coverage(value)
    if (data.expected && (data.expected.blueprintId !== expected.blueprintId || data.expected.approvedRevision !== expected.approvedRevision)) fail('cannot replace the approved visual coverage binding')
    if (data.expected && data.expected.digest !== expected.digest) data.projectionRepaired = true
    data.expected = expected
  } else if (event.kind === 'visual_coverage_resolution') {
    const data = coverage(value), id = roleId(event.roleId)
    if (!data.expected?.roles.some(role => role.id === id)) fail('resolution must reference an approved visual role')
    data.resolutions[id] = { ...resolution(root, event), expectedDigest: data.expected.digest }
  } else if (event.kind === 'visual_coverage_scope_changed') {
    const data = coverage(value)
    data.previousResolutions ??= structuredClone(data.resolutions)
    data.scopeChange = scopeChange(event)
  } else if (event.kind === 'catalog_search_attempt') {
    applySearchAttempt(value, event)
  } else if (event.kind === 'discovery') {
    if (!Array.isArray(event.results) || event.results.length > 1000) fail('discovery must contain returned results')
    for (const result of event.results) {
      if (!text(result.id) || !safeRel(result.path)) fail('discovery requires a stable pack id and path')
      const record = { ...pick(result, ['id', 'name']), path: result.path, snapshotId: text(event.snapshotId), query: text(event.query, 256) }
      const key = digest(JSON.stringify([record.snapshotId ?? null, record.id]))
      value.discoveries[key] = record
    }
    if (event.attempt) applySearchAttempt(value, event.attempt)
  } else if (event.kind === 'download') {
    if (!safeRel(event.catalogPath) || !sha(event.sha256) || !Number.isSafeInteger(event.size) || event.size < 0) fail('verified download path, hash, and size are required')
    const record = { ...source(event), sha256: sha(event.sha256), size: event.size }
    value.downloads[digest(JSON.stringify([record.snapshotId ?? null, record.catalogPath, record.sha256]))] = record
  } else if (event.kind === 'asset') {
    if (!assetRel(event.path)) fail('invalid asset path')
    const file = safeFile(root, event.path)
    const identity = hashFile(file)
    if (event.sha256 && identity.sha256 !== sha(event.sha256)) fail('recorded asset differs from its expected hash')
    const previous = value.assets[event.path]
    const versions = { ...(previous?.versions ?? {}) }
    if (previous?.sha256 && previous.sha256 !== identity.sha256) versions[previous.sha256] = historical(previous)
    const unchanged = previous?.sha256 === identity.sha256
    const next = metadata(unchanged && compatibleFacts(previous, event, false) ? { ...previous, ...event,
      source: { ...previous.source, ...event.source }, license: { ...previous.license, ...event.license },
      generator: { ...previous.generator, ...event.generator } } : event)
    // Preserve lineage even after housekeeping removes source files from the active inventory.
    next.inputs = next.inputs.flatMap(input => {
      const parent = input.path && value.assets[input.path]
      return parent?.sha256 === input.sha256 && compatibleFacts(parent, input) ? [{ ...input, origin: parent.origin, generator: parent.generator,
        source: { ...parent.source, ...input.source }, license: { ...parent.license, ...input.license } }, ...(parent.inputs ?? [])] : [input]
    })
    next.inputs = mergeInputs([], next.inputs)
    value.assets[event.path] = { ...next, ...identity, ...(Object.keys(versions).length ? { versions } : {}) }
  } else if (event.kind === 'procedure') {
    const id = text(event.id, 256)
    if (!id || ['__proto__', 'constructor', 'prototype'].includes(id)) fail('a stable procedural system id is required')
    value.procedures[id] = { ...metadata({ ...event, origin: event.origin ?? 'procedural' }), description: text(event.description), usedBy: pathList(event.usedBy) }
  } else fail('unknown event kind')
}

function walk(root, visit, directory = '') {
  const path = directory ? safeFile(root, directory, true) : root
  if (!existsSync(path)) return
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    const rel = directory ? `${directory}/${entry.name}` : entry.name
    if (entry.isDirectory()) { if (!SKIP.has(entry.name) && !entry.name.startsWith('.')) walk(root, visit, rel) }
    else if (entry.isFile()) visit(rel)
  }
}

function starterAttribution(root, manifest) {
  if (manifest === undefined) return readJson(safeFile(root, '.manus-game-tools/starter-preview.json', true), {})
  // Initialization supplies the pinned package manifest before its completion
  // marker exists. A project's mutable storage lock alone is never attribution.
  if (!/^game-[a-z-]+-v[0-9]+$/.test(manifest?.id ?? '')) return {}
  const starter = { id: manifest.id, assets: Object.fromEntries(entries(manifest.files)
    .filter(([path, hash]) => isProvenanceMediaPath(path) && sha(hash)).map(([path, hash]) => [path, { sha256: sha(hash) }])) }
  if (!sha(manifest.files?.['assets.lock.json'])) return starter
  const path = safeFile(root, 'assets.lock.json', true)
  if (!existsSync(path) || !lstatSync(path).isFile() || lstatSync(path).size > MAX_JSON) return starter
  const bytes = readFileSync(path)
  if (digest(bytes) !== sha(manifest.files['assets.lock.json'])) return starter
  return { ...starter, assets: { ...starter.assets, ...(JSON.parse(bytes).assets ?? {}) } }
}

function inventory(root, value, lockManifest, options) {
  const mediaPath = isProvenanceMediaPath
  const names = new Set(Object.keys(lockManifest.assets ?? {}).filter(mediaPath))
  walk(root, rel => { if (mediaPath(rel)) names.add(rel) })
  for (const rel of Object.keys(value.assets)) if (mediaPath(rel) && existsSync(safeFile(root, rel, true))) names.add(rel)
  if (names.size > MAX_FILES) fail('too many game assets')
  const starter = starterAttribution(root, options.starterManifest)
  const fonts = new Map(provenanceFontFiles(root, options).filter(file => file.role === 'font').map(file => [file.sha256, file]))
  const result = {}
  for (const rel of [...names].sort()) {
    const file = safeFile(root, rel, true), previous = value.assets[rel]
    const present = existsSync(file)
    const identity = present ? hashFile(file) : { sha256: sha(lockManifest.assets?.[rel]?.sha256), size: lockManifest.assets?.[rel]?.size }
    let current
    if (previous?.sha256 === identity.sha256) current = { ...previous }
    else if (previous?.versions?.[identity.sha256]) current = { ...previous.versions[identity.sha256], versions: previous.versions }
    else {
      const inherited = Boolean(sha(starter.assets?.[rel]?.sha256)) && sha(starter.assets[rel].sha256) === identity.sha256 &&
        (starter.assets[rel].size === undefined || starter.assets[rel].size === identity.size)
      const font = fonts.get(identity.sha256)
      current = { ...metadata({ origin: inherited || font ? 'template' : 'unknown',
        source: { ...(inherited ? { starterId: starter.id } : {}), ...(font ? { name: font.name } : {}) },
        ...(font ? { license: bundledFontLicense(font) } : {}) }), ...identity }
      if (previous?.sha256) current.versions = { ...previous.versions, [previous.sha256]: historical(previous) }
    }
    result[rel] = { ...current, ...identity, status: present ? 'present' : 'awaiting-restoration', used: false, shipped: null, useEvidence: [] }
  }
  return result
}

// Static reachability is evidence of a reference, not proof that a player exercised every branch.
function usage(root, assets, procedures) {
  const sources = new Map(), classes = new Map(), uids = new Map()
  walk(root, rel => {
    if (!CODE.has(extname(rel)) || [PROVENANCE_FILE, 'assets.lock.json'].includes(rel)) return
    const file = safeFile(root, rel)
    if (lstatSync(file).size > 4 * 1024 * 1024) return
    const raw = readFileSync(file, 'utf8')
    const body = /\.(gd|tscn|tres|godot|cfg)$/.test(rel)
      ? raw.replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[^\n]*)/g, token => token.startsWith('#') ? '' : token) : raw
    sources.set(rel, body)
    const name = body.match(/^class_name\s+(\w+)/m)?.[1]
    if (name) classes.set(name, rel)
    const uid = body.match(/^\[gd_(?:scene|resource)\b[^\n]*\buid="([^"]+)"/m)?.[1]
    if (uid) uids.set(uid, rel)
    if (existsSync(safeFile(root, rel + '.uid', true))) uids.set(readFileSync(safeFile(root, rel + '.uid'), 'utf8').trim(), rel)
  })
  for (const path of Object.keys(assets).filter(isModelResourcePath)) {
    const sidecar = safeFile(root, path + '.import', true)
    if (!existsSync(sidecar) || lstatSync(sidecar).size > 64 * 1024) continue
    const uid = readFileSync(sidecar, 'utf8').match(/^uid="(uid:\/\/[^"\r\n]+)"/m)?.[1]
    if (uid) uids.set(uid, path)
  }
  const reached = new Set(), pending = ['project.godot', 'web/loading.html', 'index.html', 'game-sharing.json']
  while (pending.length) {
    const rel = pending.pop()
    if (reached.has(rel) || !sources.has(rel)) continue
    reached.add(rel)
    const body = sources.get(rel)
    const references = [...body.matchAll(/["']\*?(res:\/\/[^"'\n\r]+|uid:\/\/[^"'\n\r]+)["']/g)].map(match => match[1])
    for (const reference of references) {
      const target = reference.startsWith('uid://') ? uids.get(reference) : reference.slice(6).split('::')[0]
      if (!target || !assetRel(target)) continue
      if (assets[target]) assets[target].useEvidence.push(rel)
      if (sources.has(target)) pending.push(target)
    }
    const code = body.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, '')
    for (const [name, target] of classes) if (new RegExp(`\\b${name}\\b`).test(code)) pending.push(target)
    // Relative imports and web media remain local; never fetch a URL to establish use.
    for (const match of body.matchAll(/["']((?:\.\.?\/|assets\/|art\/|scripts\/)[^"'\n\r?#]+)["']/g)) {
      const candidates = [relative(root, resolve(root, dirname(rel), match[1])).split(sep).join('/'), match[1].replace(/^\.\//, '')]
      for (const target of candidates) {
        if (!assetRel(target)) continue
        if (assets[target]) assets[target].useEvidence.push(rel)
        if (sources.has(target)) pending.push(target)
      }
    }
  }
  // Inspect reachable models whether already registered in assets.lock.json or
  // still awaiting synchronization as project source;
  // do not mark every adjacent texture or every downloaded archive member used.
  for (const [path, asset] of Object.entries(assets)) {
    if (!isModelResourcePath(path) || asset.status !== 'present' ||
        !asset.useEvidence.length && !(asset.usedBy ?? []).some(source => reached.has(source))) continue
    try {
      for (const dependency of modelResourceDependencies(root, path)) {
        if (assets[dependency]) assets[dependency].useEvidence.push(path)
      }
    } catch { /* An unreadable dependency graph establishes no additional usage. */ }
  }
  // Sharing URLs are content-addressed host paths. Bind declared identities to
  // current source bytes; neither a URL nor a similar filename is use evidence.
  let sharing = {}
  try { sharing = readJson(safeFile(root, 'game-sharing.json', true), {}) } catch { /* Invalid optional sharing declarations do not establish use. */ }
  if (sharing.schemaVersion === 1) for (const item of Object.values(sharing.assets ?? {})) {
    if (!sha(item?.digest) || !Number.isSafeInteger(item.sizeBytes) || !/^share\/[a-f0-9]{64}\.png$/.test(item.path ?? '')) continue
    if (item.path !== `share/${sha(item.digest).slice(7)}.png`) continue
    for (const asset of Object.values(assets)) if (asset.sha256 === sha(item.digest) && asset.size === item.sizeBytes) asset.useEvidence.push('game-sharing.json')
  }
  for (const asset of Object.values(assets)) {
    asset.regions = (asset.regions ?? []).map(region => ({ ...region, used: region.usedBy.some(path => reached.has(path)), shipped: null }))
    const declared = [...new Set([...(asset.usedBy ?? []), ...asset.regions.flatMap(region => region.usedBy)].filter(path => reached.has(path)))].sort()
    asset.referenceEvidence = [...new Set(asset.useEvidence)].sort()
    asset.declaredUseEvidence = declared
    asset.useEvidence = [...new Set([...asset.referenceEvidence, ...declared])].sort()
    asset.used = asset.useEvidence.length > 0
  }
  for (const [id, procedure] of Object.entries(procedures)) {
    procedure.useEvidence = (procedure.usedBy ?? []).filter(path => reached.has(path))
    procedure.used = procedure.useEvidence.length > 0
    // Removed implementations leave neither phantom systems nor phantom file counts.
    if (!procedure.usedBy?.some(path => sources.has(path))) delete procedures[id]
  }
  return reached
}

function packKey(value, discoveries = []) {
  if (value?.packId) return value.packId
  if (value?.catalogPath) {
    const path = value.catalogPath.replace(/\/(?:assets\.zip|metadata\.json|[^/]+\.(?:zip|7z|rar|tar(?:\.gz)?))$/, '')
    const observed = discoveries.filter(item => item.path === path && (!value.snapshotId || item.snapshotId === value.snapshotId))
    if (new Set(observed.map(item => item.id)).size === 1) return observed[0].id
    return path
  }
  return null
}
function summary(value) {
  const assets = Object.values(value.assets), discoveries = Object.values(value.discoveries), downloads = Object.values(value.downloads)
  const pack = source => packKey(source, discoveries)
  const packs = stage => new Set(assets.filter(asset => asset[stage] === true).flatMap(asset => [pack(asset.source), ...asset.inputs.map(input => pack(input.source))]).filter(Boolean)).size
  const unit = values => ({ downloaded: count(values, item => item.origin === 'catalog'), used: count(values, item => item.used), shipped: value.export?.coverage === 'verified' ? count(values, item => item.shipped) : null })
  const regions = assets.flatMap(asset => asset.regions)
  return {
    packs: { discovered: new Set(discoveries.map(item => item.id)).size, downloaded: new Set(downloads.filter(item => /\/(?:assets\.zip|[^/]+\.(?:zip|7z|rar|tar(?:\.gz)?))$/.test(item.catalogPath ?? '')).map(pack).filter(Boolean)).size, used: packs('used'), shipped: value.export?.coverage === 'verified' ? packs('shipped') : null },
    files: { ...unit(assets), retained: assets.length },
    spriteRegions: { retained: regions.length, used: count(regions, item => item.used), shipped: value.export?.coverage === 'verified' ? count(regions, item => item.shipped) : null },
    derivatives: { retained: count(assets, item => item.origin === 'derivative'), used: count(assets, item => item.origin === 'derivative' && item.used), shipped: value.export?.coverage === 'verified' ? count(assets, item => item.origin === 'derivative' && item.shipped) : null },
    origins: Object.fromEntries([...ORIGINS].map(origin => [origin, { retained: count(assets, item => item.origin === origin), used: count(assets, item => item.origin === origin && item.used), shipped: value.export?.coverage === 'verified' ? count(assets, item => item.origin === origin && item.shipped) : null }])),
    ancestry: Object.fromEntries(['catalog', 'ai', 'procedural'].map(origin => {
      const includes = asset => asset.origin === origin || asset.inputs.some(input => input.origin === origin || (origin === 'catalog' && pack(input.source)))
      return [origin, { retained: count(assets, includes), used: count(assets, item => includes(item) && item.used), shipped: value.export?.coverage === 'verified' ? count(assets, item => includes(item) && item.shipped) : null }]
    })),
    proceduralSystems: { retained: Object.keys(value.procedures).length, used: count(Object.values(value.procedures), item => item.used) },
    exportedHostMedia: value.export?.coverage === 'verified' ? {
      paths: value.export.hostMedia.length, uniqueHashes: new Set(value.export.hostMedia.map(item => item.sha256)).size,
      unmatchedSourcePaths: value.export.hostMedia.filter(item => !item.sourcePaths.length).length,
    } : null,
  }
}
function reconcile(root, value, options = {}) {
  for (const event of [...provenanceReceiptEvents(root), ...shareReceiptEvents(root, options)]) {
    if (event.kind === 'warning') continue
    if (event.kind !== 'asset') { applyEvent(root, value, event); continue }
    const previous = value.assets[event.path]
    // Automatic receipts supplement same-byte human annotations without replacing them.
    const same = previous?.sha256 === sha(event.sha256) && previous.origin !== 'unknown'
    const compatible = same && compatibleFacts(previous, event)
    const supplemental = same ? { ...event, ...previous, kind: 'asset', path: event.path,
      source: compatible ? { ...event.source, ...previous.source } : previous.source,
      license: compatible ? { ...event.license, ...previous.license } : previous.license,
      inputs: mergeInputs(previous.inputs, event.inputs),
      transformations: compatible && !previous.transformations.length ? event.transformations : previous.transformations,
      receipt: compatible ? event.receipt ?? previous.receipt : previous.receipt } : event
    applyEvent(root, value, supplemental)
  }
  const lockManifest = options.manifest ?? readJson(safeFile(root, 'assets.lock.json', true), { assets: {} })
  value.assets = inventory(root, value, lockManifest, options)
  usage(root, value.assets, value.procedures)
  const matchingSources = (paths, item) => [...new Set((Array.isArray(paths) ? paths : []).filter(path =>
    isProvenanceMediaPath(path) && value.assets[path]?.sha256 === sha(item.sha256) && value.assets[path]?.size === item.size))].sort()
  if (options.exportInfo) value.export = { ...pick(options.exportInfo, ['profile', 'pckSha256', 'coverage']), ...(text(options.exportInfo.reason) ? { reason: text(options.exportInfo.reason) } : {}),
    ...(sha(options.exportInfo.sourceFingerprint) ? { sourceFingerprint: sha(options.exportInfo.sourceFingerprint) } : {}),
    hostMedia: (Array.isArray(options.exportInfo.hostMedia) ? options.exportInfo.hostMedia : []).filter(item => isProvenanceMediaPath(item?.path) && sha(item.sha256) && Number.isSafeInteger(item.size) && item.size >= 0).map(item => ({ path: item.path, sha256: sha(item.sha256), size: item.size,
      sourcePaths: matchingSources(item.sourcePaths, item), contentMatches: matchingSources(item.contentMatches, item).filter(path => !matchingSources(item.sourcePaths, item).includes(path)) })) }
  const verified = options.exportInfo?.coverage === 'verified' && options.shippedPaths != null
  if (value.export && !verified) value.export.coverage = 'unknown'
  const shipped = new Set(options.shippedPaths ?? [])
  for (const asset of Object.values(value.assets)) asset.shipped = null
  if (verified) for (const [path, asset] of Object.entries(value.assets)) asset.shipped = shipped.has(path)
  // A subsequent source sync invalidates shipment claims until the next export inspection.
  if (!options.exportInfo) delete value.export
  for (const asset of Object.values(value.assets)) for (const region of asset.regions) region.shipped = asset.shipped
  value.summary = summary(value)
  if (value.visualCoverage) value.summary.visualCoverage = coverageSummary(root, value, options)
  atomic(root, PROVENANCE_FILE, json(value))
  return value
}

export function reconcileProvenance(root, options = {}) {
  root = rootPath(root)
  return lock(root, () => reconcile(root, load(root), options))
}
export function recordProvenance(root, events) {
  root = rootPath(root)
  return lock(root, () => {
    const batch = Array.isArray(events) ? events : [events]
    if (batch.length > MAX_FILES) fail('too many recording events')
    const projections = batch.filter(event => event?.kind === 'visual_coverage_expected')
    if (projections.length > 1) fail('record one approved coverage projection per batch')
    const value = load(root, projections.length ? expectedCoverage(projections[0].expected) : undefined)
    for (const event of batch) applyEvent(root, value, event)
    return reconcile(root, value)
  })
}
/** Caller supplies an authenticated approved Blueprint projection, never model prose. */
export function seedVisualCoverage(root, expected) {
  return recordProvenance(root, { kind: 'visual_coverage_expected', expected })
}

function coverageSummary(root, value, { renderedCaptureRoot = root } = {}) {
  const data = value.visualCoverage
  const attempts = Object.values(data?.attempts ?? {})
  const searchCoverage = new Set(attempts.flatMap(attempt => Object.values(attempt.outcomes)
    .filter(outcome => ['results', 'empty'].includes(outcome.outcome))
    .map(outcome => digest(json([attempt.query, attempt.filters, attempt.limit, attempt.pageHash, outcome.snapshotId])))))
  const search = { requests: attempts.length, checkedPages: searchCoverage.size,
    outcomes: attempts.reduce((total, attempt) => total + Object.keys(attempt.outcomes).length, 0), overflowEvents: data?.overflowEvents ?? 0 }
  if (!data?.expected) return { status: 'unknown', reason: 'no_approved_visual_coverage', search }
  const expected = data.expected, roles = [], unresolved = [], unusedAssets = [], staleEvidence = [], unexplainedFallbacks = []
  for (const role of expected.roles) {
    const item = Object.hasOwn(data.resolutions, role.id) ? data.resolutions[role.id] : undefined, reasons = []
    if (!item || item.decision === 'unresolved') reasons.push('unresolved')
    if (item) {
      if (item.expectedDigest !== expected.digest) reasons.push('scope_evidence_mismatch')
      if (!item.assetIds.length && !item.procedureIds.length) reasons.push('missing_integration')
      for (const id of item.assetIds) {
        const asset = value.assets[id]
        if (!asset || asset.status !== 'present') reasons.push('missing_asset')
        else if (!asset.used) { reasons.push('selected_but_unused'); unusedAssets.push(id) }
      }
      for (const id of item.procedureIds) if (!value.procedures[id]?.used) reasons.push('unused_procedure')
      if (item.attemptIds.some(id => !data.attempts[id])) reasons.push('missing_search_evidence')
      if (item.decision === 'procedural_gap' && (!item.residualGap || !item.attemptIds.length)) {
        reasons.push('unexplained_fallback'); unexplainedFallbacks.push(role.id)
      }
      if (item.decision === 'procedural_gap' && item.attemptIds.length && !item.attemptIds.some(id =>
        Object.values(data.attempts[id]?.outcomes ?? {}).some(outcome => ['results', 'empty'].includes(outcome.outcome)))) reasons.push('availability_is_not_a_catalog_gap')
      if (['catalog_direct', 'catalog_adapted'].includes(item.decision) && !item.assetIds.some(id => {
        const asset = value.assets[id]
        return asset?.origin === 'catalog' || asset?.inputs.some(input => input.origin === 'catalog' || input.source?.catalogPath)
      })) reasons.push('missing_catalog_lineage')
      const review = item.renderedEvidence
      if (!review) reasons.push('missing_rendered_evidence')
      else {
        const inputs = new Set(review.inputs.map(input => input.path))
        const required = [...item.assetIds, ...item.assetIds.flatMap(id => value.assets[id]?.useEvidence ?? []),
          ...item.procedureIds.flatMap(id => value.procedures[id]?.usedBy ?? [])]
        if (required.some(path => !inputs.has(path))) reasons.push('incomplete_review_inputs')
        // Captures stay outside frozen build inputs; reviewed source still belongs
        // to the frozen candidate, even when the live workspace has moved on.
        const staleAt = (evidenceRoot, items) => items.some(item => {
          try { return hashFile(safeFile(evidenceRoot, item.path)).sha256 !== item.sha256 } catch { return true }
        })
        const stale = staleAt(renderedCaptureRoot, review.paths) || staleAt(root, review.inputs)
        if (stale) { reasons.push('stale_rendered_evidence'); staleEvidence.push(role.id) }
      }
    }
    const issues = [...new Set(reasons)]
    roles.push({ id: role.id, status: issues.length ? 'unresolved' : 'evidence_recorded', reasons: issues })
    if (issues.length) unresolved.push(role.id)
  }
  const status = data.scopeChange ? 'unverified' : unresolved.length ? 'incomplete' : 'evidence_recorded'
  return { status, ...(data.scopeChange ? { reason: 'scope_changed', scopeChange: data.scopeChange } : {}),
    blueprintId: expected.blueprintId, approvedRevision: expected.approvedRevision, expectedDigest: expected.digest,
    committedRoles: expected.roles.length, fulfilledRoles: expected.roles.length - unresolved.length, unresolvedRoles: unresolved,
    selectedButUnusedAssets: [...new Set(unusedAssets)], staleRenderedEvidence: staleEvidence, unexplainedFallbacks,
    roles, search, ...(expected.customRequest ? { customRequest: expected.customRequest, customRequestReview: 'requires_agent_review' } : {}),
    visualQuality: 'requires_agent_review' }
}
/** Read-only consistency check: records never certify aesthetics or change project availability. */
export function visualCoverageSummary(root) {
  try {
    root = rootPath(root)
    const value = load(root)
    if (!value.visualCoverage?.expected) return coverageSummary(root, value)
    value.assets = inventory(root, value, readJson(safeFile(root, 'assets.lock.json', true), { assets: {} }), {})
    usage(root, value.assets, value.procedures)
    return coverageSummary(root, value)
  } catch { return { status: 'unverified', reason: 'coverage_evidence_unavailable' } }
}
// Optional recovery aid: validate the same event semantics without acquiring a
// writer lock, reconciling every asset, or creating a manifest.
export function validateProvenanceEvents(root, events) {
  root = rootPath(root)
  const value = load(root), batch = Array.isArray(events) ? events : [events]
  if (batch.length > MAX_FILES) fail('too many recording events')
  for (const event of batch) applyEvent(root, value, event)
  return batch.length
}
export function deleteAssetProvenance(root, path) {
  root = rootPath(root)
  if (!assetRel(path)) fail('invalid deleted asset path')
  return lock(root, () => {
    const value = load(root)
    delete value.assets[path]
    return reconcile(root, value)
  })
}
export function isProvenanceGeneratedPath(path) { return path === PROVENANCE_REPORT }
export function provenanceSourceBytes(bytes) {
  const value = JSON.parse(bytes.toString())
  const project = Object.fromEntries(entries(value).filter(([key]) => !GENERATED.has(key)))
  for (const group of ['assets', 'procedures']) project[group] = Object.fromEntries(entries(project[group]).map(([path, asset]) => [path,
    Object.fromEntries(entries(asset).filter(([key]) => !COMPUTED_ASSET.has(key)).map(([key, item]) => [key, key === 'regions'
      ? item.map(region => Object.fromEntries(entries(region).filter(([field]) => !['used', 'shipped'].includes(field)))) : item]))]))
  return Buffer.from(json(project))
}

export function runCLI(argv = process.argv.slice(2)) {
  try {
    if (argv.includes('--help') || argv.includes('-h')) {
      console.log('Usage: asset-provenance.mjs report|record|check [--project directory] [--event-file metadata.json]\n' +
        'report reconciles asset-provenance.json; record imports events; check validates events without writing.\n' +
        'record and check require --event-file. Extraction/adaptation receipts are imported automatically during normal asset synchronization.\n' +
        'Asset example: {"kind":"asset","path":"assets/item.glb","origin":"catalog","source":{"catalogPath":"3d-models/props/pack/assets.zip","memberPath":"item.glb"}}\n' +
        'Role evidence: {"kind":"visual_coverage_resolution","roleId":"scenery","decision":"catalog_direct","assetIds":["assets/tree.glb"],"renderedEvidence":{"paths":["captures/world.png"],"inputs":["main.gd","assets/tree.glb"]}}\n' +
        'Approved expected roles are seeded by init/attach. Later scope changes use visual_coverage_scope_changed with instructionRef, reason and optional roleIds; they retain the original baseline.\n' +
        'Transformation inputs use an exact sha256 plus a retained project-relative path, or source metadata when the input is no longer retained.')
      return
    }
    const args = [...argv], operation = args.shift() ?? 'report'
    let root = process.cwd(), eventFile
    while (args.length) {
      const name = args.shift(), value = args.shift()
      if (!value || !['--project', '--event-file'].includes(name)) fail('usage: asset-provenance.mjs report|record|check [--project directory] [--event-file metadata.json]')
      if (name === '--project') root = value
      else eventFile = value
    }
    if (!['report', 'record', 'check'].includes(operation) || (operation !== 'report' && !eventFile)) fail('record and check require --event-file; use report to reconcile current files')
    let events = eventFile ? readJson(resolve(eventFile)) : undefined
    if (events?.server === 'webdev-mcp' && events?.tool === 'webdev.search_game_assets' && ['discovery', 'catalog_search_attempt'].includes(events.result?.kind)) events = events.result
    if (operation === 'check') {
      console.log(JSON.stringify({ ok: true, events: validateProvenanceEvents(root, events), written: false }))
      return
    }
    const result = operation === 'record' ? recordProvenance(root, events) : reconcileProvenance(root)
    console.log(JSON.stringify({ ok: true, manifest: PROVENANCE_FILE, summary: result.summary }))
  } catch (error) { console.error(JSON.stringify({ ok: false, code: 'asset_provenance_failed', message: error.message })); process.exitCode = 1 }
}
// Bundlers relocate import.meta.url to the importing MCP entry point.
if (process.argv[1] && basename(process.argv[1]) === 'asset-provenance.mjs' && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) runCLI()
