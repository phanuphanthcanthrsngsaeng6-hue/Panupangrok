import { createHash } from 'node:crypto'
import { closeSync, existsSync, lstatSync, openSync, readFileSync, readdirSync, readSync, realpathSync } from 'node:fs'
import { dirname, extname, join, resolve } from 'node:path'

const MEDIA = new Set('.png .jpg .jpeg .webp .gif .svg .avif .bmp .tga .exr .hdr .wav .ogg .mp3 .flac .m4a .aac .mp4 .webm .ttf .otf .woff .woff2 .glb .gltf .obj .mtl .fbx .blend .dae .bin'.split(' '))
const MAX_JSON = 8 * 1024 * 1024
const hash = value => typeof value === 'string' && /^(?:sha256:)?[a-f0-9]{64}$/.test(value) ? value.replace(/^sha256:/, '') : null
const text = value => typeof value === 'string' && value.length > 0 && value.length <= 1024 && !/[\x00-\x1f\x7f]/.test(value) ? value : undefined
const safeRel = value => typeof value === 'string' && value.length > 0 && value.length <= 2048 && !/^[\/]|[\\\x00-\x1f]/.test(value) && value.split('/').every(part => part && part !== '.' && part !== '..')
const snapshot = value => typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(value) ? value : undefined
const object = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {}
const clean = value => Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined && item !== null))
const boolean = value => typeof value === 'boolean' ? value : undefined
const RIGHTS = {
  attributionRequired: ['attribution_required'], copyrightNoticeRequired: ['copyright_notice_required'],
  licenseNoticeRequired: ['license_notice_required'], modificationNoticeRequired: ['modification_notice_required'],
  commercialUseAllowed: ['commercial_use_allowed', 'free_commercial_use'], modificationAllowed: ['modification_allowed'],
  redistributionAllowed: ['redistribution_allowed'], editableProjectDistributionAllowed: ['editable_project_distribution_allowed'],
  reusableTemplateDistributionAllowed: ['reusable_template_distribution_allowed'],
}

function publicUrl(value) {
  try {
    if (!text(value)) return undefined
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password && !url.search && !url.hash ? value : undefined
  } catch { return undefined }
}
function source(value) {
  value = object(value)
  return clean({ snapshotId: snapshot(value.snapshotId), catalogPath: safeRel(value.catalogPath) ? value.catalogPath : undefined,
    packId: text(value.packId), name: text(value.name), author: text(value.author), url: publicUrl(value.url),
    memberPath: safeRel(value.memberPath) ? value.memberPath : undefined,
    metadataPath: safeRel(value.metadataPath) ? value.metadataPath : undefined,
    metadataSha256: hash(value.metadataSha256) ? `sha256:${hash(value.metadataSha256)}` : undefined })
}
function license(value) {
  value = object(value)
  return clean({ id: text(value.id), url: publicUrl(value.url), attribution: text(value.attribution),
    notice: safeRel(value.notice) ? value.notice : undefined,
    ...Object.fromEntries(Object.keys(RIGHTS).map(key => [key, boolean(value[key])])) })
}
function publishedMetadata(value) {
  value = object(value)
  const nested = object(value.license)
  return {
    source: clean({ packId: text(value.id), name: text(value.name), author: text(value.creator) ?? text(value.author),
      url: publicUrl(value.canonical_url) ?? publicUrl(value.source_url) }),
    license: clean({ id: text(value.selected_license) ?? text(value.license_id) ?? text(nested.selected_license) ?? text(nested.license_id) ?? text(value.license),
      url: publicUrl(value.license_url) ?? publicUrl(nested.license_url), attribution: text(value.attribution_text) ?? text(nested.attribution_text),
      ...Object.fromEntries(Object.entries(RIGHTS).map(([key, fields]) => [key,
        [value, nested].flatMap(item => [...fields, key].map(field => boolean(item[field]))).find(item => item !== undefined)])) }),
  }
}
function file(root, name) {
  if (!safeRel(name)) return null
  let current = root
  try {
    for (const part of name.split('/')) {
      current = join(current, part)
      if (lstatSync(current).isSymbolicLink()) return null
    }
    return lstatSync(current).isFile() ? current : null
  } catch { return null }
}
function read(root, name) {
  const path = file(root, name)
  if (!path || lstatSync(path).size > MAX_JSON) return null
  try { return JSON.parse(readFileSync(path, 'utf8')) } catch { return null }
}
function currentFile(root, path, expected, size, checks) {
  const name = file(root, path), expectedHash = hash(expected)
  if (!name || !expectedHash) return false
  const stat = lstatSync(name)
  if (size !== undefined && (!Number.isSafeInteger(size) || size < 0 || stat.size !== size)) return false
  if (!checks.has(path)) {
    const checksum = createHash('sha256'), buffer = Buffer.alloc(1024 * 1024), fd = openSync(name, 'r')
    try { for (let length; (length = readSync(fd, buffer, 0, buffer.length, null));) checksum.update(buffer.subarray(0, length)) }
    finally { closeSync(fd) }
    checks.set(path, checksum.digest('hex'))
  }
  return checks.get(path) === expectedHash
}
function locateReceipts(root) {
  const result = []
  let visited = 0
  function visit(directory, depth = 0) {
    if (depth > 64 || visited > 20_000 || !existsSync(join(root, directory))) return
    for (const entry of readdirSync(join(root, directory), { withFileTypes: true })) {
      if (++visited > 20_000) break
      if (entry.isSymbolicLink()) continue
      const rel = `${directory}/${entry.name}`
      if (entry.isDirectory() && !entry.name.startsWith('.') && !['node_modules', 'dist', 'site', 'test', 'tests'].includes(entry.name)) visit(rel, depth + 1)
      else if (entry.isFile() && /^\.catalog-(?:retrieval|adaptation)-[a-f0-9]+(?:-v[0-9]+)?\.json$/.test(entry.name)) result.push(rel)
    }
  }
  for (const directory of ['assets', 'art']) {
    const path = join(root, directory)
    if (existsSync(path) && lstatSync(path).isDirectory() && !lstatSync(path).isSymbolicLink()) visit(directory)
  }
  return result.sort()
}
function member(value) {
  if (safeRel(value)) return { path: value }
  value = object(value)
  if (!safeRel(value.member) || !Array.isArray(value.containers) || value.containers.length < 1 || value.containers.length > 4 || value.containers[0] !== 'assets.zip' || !value.containers.every(safeRel)) return null
  return { path: value.member, containers: value.containers }
}

function receiptMetadata(value, bound, archiveSha256) {
  const selected = object(value), declaredSource = object(selected.source)
  if (!bound.snapshotId || !bound.catalogPath || selected.snapshotId !== bound.snapshotId || selected.catalogPath !== bound.catalogPath ||
    !hash(selected.metadataSha256) || (selected.archiveSha256 !== undefined && hash(selected.archiveSha256) !== hash(archiveSha256))) return null
  const metadataPath = `${dirname(bound.catalogPath)}/metadata.json`
  if ((selected.metadataPath !== undefined && selected.metadataPath !== metadataPath) ||
    (declaredSource.snapshotId !== undefined && declaredSource.snapshotId !== bound.snapshotId) ||
    (declaredSource.catalogPath !== undefined && declaredSource.catalogPath !== bound.catalogPath) ||
    (declaredSource.metadataPath !== undefined && declaredSource.metadataPath !== metadataPath) ||
    (declaredSource.metadataSha256 !== undefined && hash(declaredSource.metadataSha256) !== hash(selected.metadataSha256))) return null
  const facts = source(declaredSource)
  delete facts.memberPath
  return { source: { ...facts, metadataPath, metadataSha256: `sha256:${hash(selected.metadataSha256)}` }, license: license(selected.license) }
}

function retrievalEvents(root, receiptPath, receipt, checks) {
  if (![1, 2].includes(receipt.version) || !hash(receipt.archiveSha256) || !Array.isArray(receipt.members) || receipt.members.length > 10_000) return []
  const directory = dirname(receiptPath).replaceAll('\\', '/')
  const sources = []
  for (const candidate of (Array.isArray(receipt.catalogSources) ? receipt.catalogSources : []).slice(0, 64)) {
    const selected = clean({ snapshotId: snapshot(candidate?.snapshotId), catalogPath: safeRel(candidate?.catalogPath) ? candidate.catalogPath : undefined })
    if (selected.snapshotId && selected.catalogPath && !sources.some(item => item.snapshotId === selected.snapshotId && item.catalogPath === selected.catalogPath)) sources.push(selected)
  }
  const collectionPaths = [...new Set(sources.map(item => item.catalogPath))]
  const ambiguous = collectionPaths.length > 1
  const bound = sources.length === 1 ? sources[0] : collectionPaths.length === 1 ? { catalogPath: collectionPaths[0] } : {}
  let facts = { source: {}, license: {} }
  const metadata = (Array.isArray(receipt.catalogMetadata) ? receipt.catalogMetadata : [])
    .map(item => receiptMetadata(item, bound, receipt.archiveSha256)).filter(Boolean)
  if (metadata.length === 1) facts = metadata[0]
  const members = receipt.members.flatMap(row => {
    if (!row || typeof row !== 'object') return []
    const locator = member(row.member), output = row.outputPath ?? (typeof row.member === 'string' ? row.member : null)
    if (!locator || !safeRel(output)) return []
    const path = `${directory}/${output}`
    return currentFile(root, path, row.sha256, row.sizeBytes, checks) ? [{ row, locator, path }] : []
  })
  // Legacy in-archive metadata can supply fallback facts, but its digest does not
  // identify the separately published catalog metadata companion.
  for (const item of metadata.length === 1 ? [] : members.filter(item => item.locator.path === 'metadata.json' && !item.locator.containers)) {
    const value = read(root, item.path)
    if (value && !ambiguous && (!value.archive_sha256 || hash(value.archive_sha256) === hash(receipt.archiveSha256))) {
      const selected = publishedMetadata(value)
      facts = {
        source: { ...facts.source, ...selected.source },
        license: { ...facts.license, ...selected.license },
      }
    }
  }
  const notices = members.filter(item => /(?:^|\/)(?:licen[sc]e|copying|copyright|notice)(?:[._-][^/]*)?$/i.test(item.locator.path))
  const events = []
  if (bound.catalogPath && Number.isSafeInteger(receipt.archiveSizeBytes) && receipt.archiveSizeBytes >= 0) {
    events.push({ kind: 'download', ...bound, sha256: hash(receipt.archiveSha256), size: receipt.archiveSizeBytes })
  }
  if (ambiguous && members.some(item => MEDIA.has(extname(item.path).toLowerCase()))) {
    events.push({ kind: 'warning', code: 'catalog-source-ambiguous', path: receiptPath,
      message: 'Cached archive matches multiple catalog collections; this receipt cannot identify a selected source or a downloaded pack.' })
  }
  for (const { row, locator, path } of members) {
    if (!MEDIA.has(extname(path).toLowerCase())) continue
    const selectedSource = { ...bound, ...facts.source, memberPath: locator.path }
    const notice = notices.length === 1 ? { notice: notices[0].path } : {}
    const inputs = [{ sha256: hash(receipt.archiveSha256), source: { ...bound, ...facts.source }, license: { ...facts.license, ...notice } }]
    events.push({ kind: 'asset', path, sha256: hash(row.sha256), origin: 'catalog', source: selectedSource,
      license: { ...facts.license, ...notice }, inputs,
      ...(locator.containers ? { transformations: [{ operation: 'extract', tool: 'catalog-retrieve', description: `Nested containers: ${JSON.stringify(locator.containers)}` }] } : {}),
    })
  }
  return events
}

function adaptationEvents(root, receiptPath, receipt, knownAssets, checks) {
  const recipe = object(receipt.recipe), original = object(recipe.source)
  if (![1, 2].includes(receipt.schemaVersion) || receipt.tool !== 'catalog-adapt' || !['slice', 'palette'].includes(recipe.operation) ||
    !safeRel(original.collection) || !safeRel(original.member) || !hash(original.sha256) || !hash(original.archiveSha256) ||
    !Array.isArray(receipt.outputs) || receipt.outputs.length > 64) return []
  const expectedSource = { catalogPath: `${original.collection}/assets.zip`, memberPath: original.member }
  const candidates = knownAssets.filter(event => hash(event.sha256) === hash(original.sha256) && event.source.catalogPath === expectedSource.catalogPath &&
    event.source.memberPath === expectedSource.memberPath && event.inputs.some(input => hash(input.sha256) === hash(original.archiveSha256) && input.source.catalogPath === expectedSource.catalogPath))
  const parent = candidates.length === 1 ? candidates[0] : undefined
  const input = { ...(parent ? { path: parent.path } : {}), sha256: hash(original.sha256), source: { ...parent?.source, ...expectedSource }, license: parent?.license ?? {} }
  const archiveInput = parent?.inputs.find(candidate => hash(candidate.sha256) === hash(original.archiveSha256) && candidate.source.catalogPath === expectedSource.catalogPath)
  const directory = dirname(receiptPath).replaceAll('\\', '/')
  return receipt.outputs.flatMap(output => {
    if (!safeRel(output?.path) || !MEDIA.has(extname(output.path).toLowerCase())) return []
    const path = `${directory}/${output.path}`
    if (!currentFile(root, path, output.sha256, output.sizeBytes, checks)) return []
    const rectangle = Array.isArray(output.sourceRect) && output.sourceRect.length === 4 && output.sourceRect.every(Number.isSafeInteger) ? `; source rectangle ${JSON.stringify(output.sourceRect)}` : ''
    return [{ kind: 'asset', path, sha256: hash(output.sha256), origin: 'derivative', source: input.source, license: input.license,
      inputs: [input, { sha256: hash(original.archiveSha256), source: { ...archiveInput?.source, catalogPath: expectedSource.catalogPath }, license: archiveInput?.license ?? {} }],
      transformations: [{ operation: recipe.operation, tool: 'catalog-adapt', description: `Recipe ${hash(receipt.recipeSha256) ?? 'unknown'}; Pillow ${text(receipt.pillowVersion) ?? 'unknown'}${rectangle}; receipt ${receiptPath}` }],
    }]
  })
}

function assetIdentity(event) {
  const identity = value => [value.path ?? null, hash(value.sha256), value.source?.snapshotId ?? null,
    value.source?.catalogPath ?? null, value.source?.memberPath ?? null]
  return JSON.stringify([identity(event), (event.inputs ?? []).map(identity)])
}
function mergeFacts(left, right) {
  const merged = { ...left }
  for (const [key, value] of Object.entries(right)) {
    if (Object.hasOwn(merged, key) && merged[key] !== value) return null
    merged[key] = value
  }
  return merged
}
function mergeAsset(left, right) {
  const mergedSource = mergeFacts(left.source, right.source), mergedLicense = mergeFacts(left.license, right.license)
  if (!mergedSource || !mergedLicense || JSON.stringify(left.transformations ?? []) !== JSON.stringify(right.transformations ?? [])) return null
  const inputs = left.inputs.map((input, index) => {
    const mergedInputSource = mergeFacts(input.source, right.inputs[index].source)
    const mergedInputLicense = mergeFacts(input.license, right.inputs[index].license)
    return mergedInputSource && mergedInputLicense ? { ...input, source: mergedInputSource, license: mergedInputLicense } : null
  })
  return inputs.every(Boolean) ? { ...left, source: mergedSource, license: mergedLicense, inputs } : null
}
function coalesceRetrievalAssets(events) {
  const groups = new Map()
  for (const event of events.filter(event => event.kind === 'asset')) {
    const key = assetIdentity(event)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(event)
  }
  const assets = [...groups.values()].flatMap(group => {
    const distinct = [...new Map(group.map(event => [JSON.stringify(event), event])).values()]
    let merged = distinct[0]
    for (const event of distinct.slice(1)) {
      merged = mergeAsset(merged, event)
      if (!merged) return distinct
    }
    return [merged]
  })
  return [...events.filter(event => event.kind !== 'asset'), ...assets]
}

/** Existing immutable helper receipts recover provenance when an older game lacked the recorder. */
export function provenanceReceiptEvents(root) {
  root = resolve(root)
  if (realpathSync(root) !== root) return []
  const receipts = locateReceipts(root).map(path => ({ path, value: read(root, path) })).filter(item => item.value)
  let events = []
  const checks = new Map()
  for (const receipt of receipts.filter(item => item.path.includes('/.catalog-retrieval-'))) {
    try { events.push(...retrievalEvents(root, receipt.path, receipt.value, checks)) } catch { /* A malformed optional receipt does not affect game availability. */ }
  }
  // An enriched immutable receipt may coexist with its older archive-only receipt.
  // Combine only compatible facts for the same verified output and catalog identity.
  events = coalesceRetrievalAssets(events)
  const assets = events.filter(event => event.kind === 'asset')
  for (const receipt of receipts.filter(item => item.path.includes('/.catalog-adaptation-'))) {
    try { events.push(...adaptationEvents(root, receipt.path, receipt.value, assets, checks)) } catch { /* Preserve unrelated valid receipts. */ }
  }
  return [...new Map(events.map(event => [JSON.stringify(event), event])).values()]
}
