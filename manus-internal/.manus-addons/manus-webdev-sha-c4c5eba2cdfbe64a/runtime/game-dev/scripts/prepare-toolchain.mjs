import { windowsZip } from './windows-zip.mjs'
import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { constants, createReadStream, createWriteStream } from 'node:fs'
import fs from 'node:fs/promises'
import { join } from 'node:path'
import { pipeline } from 'node:stream/promises'
import { Readable, Transform } from 'node:stream'
import { setTimeout as delay } from 'node:timers/promises'
import { promisify } from 'node:util'
import { inspectGameToolchain, gameExportTemplatesDirectory, resolveBuildExecutable } from './game-toolchain.mjs'
import { legacyManagedGodotDirectory, managedExportTemplatesDirectory, managedGodotDirectory, linuxGodotExecutableName, needsToolsEngineCopy, windowsGodotExecutableName } from './managed-godot.mjs'

const run = promisify(execFile)
const distribution = JSON.parse(await fs.readFile(new URL('../godot-distribution.json', import.meta.url), 'utf8'))
const webTemplates = ['web_debug.zip', 'web_release.zip', 'web_nothreads_debug.zip', 'web_nothreads_release.zip']
const fail = (code, message) => Object.assign(new Error(message), { code })

export const preparationMessages = {
  godot_unavailable: 'Godot 4.7.2 stable could not start. Check the existing installation or GODOT_BIN, then retry.',
  godot_version_unsupported: 'Godot 4.7.2 stable is required. The selected existing engine has a different version; set GODOT_BIN to a matching engine and retry.',
  godot_custom_unavailable: 'The configured GODOT_BIN is unavailable. Correct that path and retry; the custom selection was preserved.',
  godot_preparation_unsupported: 'Automatic Godot preparation currently supports macOS, Windows x64/arm64 and Linux x64/arm64. Install Godot 4.7.2 stable and matching Web templates on this computer, then retry.',
  godot_extractor_unavailable: 'Automatic Godot preparation on Linux requires /usr/bin/unzip. Install the unzip package, then retry the same initialization.',
  godot_runtime_unavailable: 'The downloaded Godot engine could not start on Linux. Check that this is a Linux x64/arm64 glibc device with the required Godot system libraries, then retry.',
  godot_download_failed: 'Godot dependency download failed or timed out. Check network access to GitHub releases and retry the same initialization.',
  godot_integrity_failed: 'Godot dependency integrity verification failed. Retry to download a fresh copy from the pinned official release.',
  godot_install_failed: 'Godot dependency installation failed. Check available disk space and write access to your user application data directory, then retry.',
  web_export_templates_unavailable: 'Godot Web templates remain unavailable. Check existing templates and custom export presets; existing files were preserved.',
}

// Each download is private to an attempt. The reviewed official URL, size and
// digest are pinned in the package; redirects never carry credentials.
export async function downloadDistribution(asset, destination, { fetchImpl = fetch, signal } = {}) {
  let url = new URL(asset.browser_download_url)
  const hash = createHash('sha256')
  let size = 0
  try {
    let response
    for (let redirects = 0; redirects < 5; redirects++) {
      if (url.protocol !== 'https:' || url.username || url.password || url.port ||
          !['github.com', 'release-assets.githubusercontent.com', 'objects.githubusercontent.com'].includes(url.hostname)) {
        throw fail('godot_integrity_failed')
      }
      response = await fetchImpl(url, { redirect: 'manual', signal })
      if (![301, 302, 303, 307, 308].includes(response.status)) break
      await response.body?.cancel()
      url = new URL(response.headers.get('location'), url)
    }
    if (!response?.ok || !response.body) throw fail('godot_download_failed')
    const verify = new Transform({ transform(chunk, _encoding, callback) {
      size += chunk.length
      if (size > asset.size) return callback(fail('godot_integrity_failed'))
      hash.update(chunk)
      callback(null, chunk)
    } })
    await pipeline(Readable.fromWeb(response.body), verify, createWriteStream(destination, { flags: 'wx', mode: 0o600 }), { signal })
    if (size !== asset.size || 'sha256:' + hash.digest('hex') !== asset.digest) throw fail('godot_integrity_failed')
  } catch (error) {
    await fs.rm(destination, { force: true })
    throw fail(error.code === 'godot_integrity_failed' ? error.code : 'godot_download_failed')
  }
}

async function digest(file) {
  const hash = createHash('sha256')
  for await (const chunk of createReadStream(file)) hash.update(chunk)
  return hash.digest('hex')
}

async function checkedFile(file) {
  const stat = await fs.lstat(file)
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size === 0) throw fail('godot_install_failed')
}

export async function cleanupStalePreparations(cache, now = Date.now()) {
  const entries = await fs.readdir(cache, { withFileTypes: true }).catch(error => {
    if (error.code === 'ENOENT') return []
    throw error
  })
  for (const entry of entries) {
    if (!entry.name.startsWith('.prepare-') || !entry.isDirectory() || entry.isSymbolicLink()) continue
    const directory = join(cache, entry.name)
    try {
      const stat = await fs.lstat(directory)
      if (!stat.isDirectory() || stat.isSymbolicLink() || now - stat.mtimeMs < 24 * 60 * 60_000) continue
      const owner = Number(await fs.readFile(join(directory, 'owner.pid'), 'utf8').catch(() => ''))
      if (Number.isInteger(owner) && owner > 0) {
        try { process.kill(owner, 0); continue } catch (error) { if (error.code !== 'ESRCH') continue }
      }
      await fs.rm(directory, { recursive: true, force: true })
    } catch (error) { if (error.code !== 'ENOENT') throw error }
  }
}

function installableTemplates(error) {
  return error.code === 'web_export_templates_unavailable' && error.missing?.length > 0 && error.canInstallDefaultTemplates === true
}

// Staging, the Addon tools directory and the user's Godot directory live on
// the same volume. Hard-link publication is atomic and exclusive, including
// between processes; an existing verified template is never replaced.
async function publishTemplates(source, target, signal) {
  await fs.mkdir(target, { recursive: true })
  for (const name of webTemplates) {
    signal.throwIfAborted()
    try { await fs.link(join(source, name), join(target, name)) } catch (error) {
      if (error.code !== 'EEXIST') throw error
      await checkedFile(join(target, name))
    }
  }
}

async function completeTemplates(directory) {
  try {
    for (const name of webTemplates) await checkedFile(join(directory, name))
    return true
  } catch { return false }
}

// Godot reads templates only from the running account, so a separate account
// restores them from the tools copy. Seed that copy from templates this account
// already uses instead of downloading the 1.2 GB archive again. Copies are
// written inside the tools tree, inherit its read access there, and are
// published exclusively. Seeding is best effort: this account's toolchain
// stays usable, and the next preparation retries.
async function seedToolsTemplates(env, platform, cache) {
  const tools = managedExportTemplatesDirectory(env)
  if (!tools || await completeTemplates(tools)) return
  const user = gameExportTemplatesDirectory(env, platform)
  let temporary
  try {
    await fs.mkdir(cache, { recursive: true, mode: 0o700 })
    temporary = await fs.mkdtemp(join(cache, '.prepare-'))
    await fs.writeFile(join(temporary, 'owner.pid'), String(process.pid), { flag: 'wx', mode: 0o600 })
    await fs.mkdir(tools, { recursive: true })
    for (const name of webTemplates) {
      try { await checkedFile(join(tools, name)); continue } catch {}
      try { await checkedFile(join(user, name)) } catch { continue }
      await fs.copyFile(join(user, name), join(temporary, name))
      try { await fs.link(join(temporary, name), join(tools, name)) } catch (error) {
        if (error.code !== 'EEXIST') throw error
      }
    }
  } catch {} finally {
    if (temporary) await fs.rm(temporary, { recursive: true, force: true }).catch(() => {})
  }
}

async function extractedAsset(asset, cache, select, signal, download, platform, env) {
  if (platform === 'linux') {
    try { await fs.access('/usr/bin/unzip', constants.X_OK) }
    catch { throw fail('godot_extractor_unavailable') }
  }
  // No global lock or in-progress marker to strand after SIGKILL. Concurrent
  // attempts can stage independently; only complete verified bytes are published.
  const temporary = await fs.mkdtemp(join(cache, '.prepare-'))
  try {
    await fs.writeFile(join(temporary, 'owner.pid'), String(process.pid), { flag: 'wx', mode: 0o600 })
    const archive = join(temporary, 'download.zip')
    await download(asset, archive, { signal })
    const output = join(temporary, 'unpacked')
    await fs.mkdir(output)
    // This archive's bytes have already matched the package's pinned digest.
    // Extract only the expected application or four Web templates, never the
    // other (large, unrelated) platform templates from the official TPZ.
    if (platform === 'win32') await windowsZip(archive, output, select, { signal, env })
    else await run('/usr/bin/unzip', ['-q', archive, ...select, '-d', output], { signal, timeout: 120_000, maxBuffer: 16_384 })
    return { temporary, output }
  } catch (error) {
    await fs.rm(temporary, { recursive: true, force: true })
    throw error
  }
}

// Windows can keep a just-run executable open for a few hundred milliseconds
// after its process exits, so publishing its directory fails with a transient
// EPERM/EACCES/EBUSY. Only those codes are retried, and only on Windows.
// Windows reports an existing target with the same codes, because it cannot
// replace a directory. That target is a concurrent installer's result, so it
// is reported as EEXIST at once for the caller to compare.
const transientRenameCodes = new Set(['EPERM', 'EACCES', 'EBUSY'])
const renameRetryDelays = [50, 100, 200, 400, 800, 1000, 1000, 1000, 1000]
export async function renameWithRetry(from, to, { platform = process.platform, signal, rename = fs.rename, lstat = fs.lstat, delays = renameRetryDelays } = {}) {
  for (let attempt = 0; ; attempt++) {
    try { return await rename(from, to) } catch (error) {
      if (platform !== 'win32' || !transientRenameCodes.has(error.code)) throw error
      if (await lstat(to).then(() => true, () => false)) throw Object.assign(new Error('Rename target already exists'), { code: 'EEXIST', cause: error })
      if (attempt >= delays.length) throw error
      await delay(delays[attempt], undefined, { signal })
    }
  }
}

// A staged engine must start and report the pinned version before it is
// published. Publication is exclusive: a concurrent verified result is kept.
async function publishEngine(cache, stage, { platform, signal, env, enginePath }) {
  const linux = platform === 'linux'
  try {
    const binary = join(stage.output, enginePath)
    await checkedFile(binary)
    if (linux) await fs.chmod(binary, 0o755)
    const { stdout } = await run(binary, ['--headless', '--version'], { env, signal, timeout: 20_000 }).catch(error => {
      if (linux) throw fail('godot_runtime_unavailable')
      throw error
    })
    if (!/^4\.7\.2\.stable(?:[.-]|$)/.test(stdout.trim())) throw fail('godot_integrity_failed')
    signal.throwIfAborted()
    try { await renameWithRetry(stage.output, join(cache, 'engine'), { platform, signal }) } catch (error) {
      if (!['EEXIST', 'ENOTEMPTY'].includes(error.code)) throw error
      // A concurrent verified installer won. Never replace its installation.
      const actual = await digest(join(cache, 'engine', enginePath))
      if (actual !== await digest(binary)) throw fail('godot_install_failed')
    }
  } finally { await fs.rm(stage.temporary, { recursive: true, force: true }) }
}

async function installManagedEngine(cache, { platform, arch, signal, download, env }) {
  const windows = platform === 'win32'
  const linux = platform === 'linux'
  const linuxBinary = linux ? linuxGodotExecutableName(arch) : undefined
  const windowsBinary = windows ? windowsGodotExecutableName(arch) : undefined
  const asset = distribution.assets.find(asset => linux ? asset.name === linuxBinary + '.zip' : windows ? asset.name === windowsBinary + '.zip' : asset.name.endsWith('_macos.universal.zip'))
  const enginePath = windows ? windowsGodotExecutableName(arch, true) : linux ? linuxBinary : join('Godot.app', 'Contents', 'MacOS', 'Godot')
  const members = windows ? [windowsBinary, enginePath] : linux ? [enginePath] : ['Godot.app/*']
  const stage = await extractedAsset(asset, cache, members, signal, download, platform, env)
  await publishEngine(cache, stage, { platform, signal, env, enginePath })
}

// The official bytes of the two files in the Windows engine archive.
const windowsEngineFiles = arch => distribution.assets.find(asset => asset.name === windowsGodotExecutableName(arch) + '.zip').members

// Copy an engine installed before the Addon tools directory existed into it,
// instead of downloading the same engine again. Only its two files are copied,
// as new files inside the tools tree, so they inherit its read access there;
// a move or link would keep the old location's ACL. Each copy, not its source,
// must match the official size and digest pinned in the package, so a modified
// or replaced source is never published.
async function copyLegacyEngine(cache, { arch, signal, env, files = windowsEngineFiles(arch) }) {
  const source = join(legacyManagedGodotDirectory(env, 'win32', arch), 'engine')
  const temporary = await fs.mkdtemp(join(cache, '.prepare-'))
  const output = join(temporary, 'unpacked')
  try {
    await fs.writeFile(join(temporary, 'owner.pid'), String(process.pid), { flag: 'wx', mode: 0o600 })
    await fs.mkdir(output)
    for (const file of files) {
      signal.throwIfAborted()
      await checkedFile(join(source, file.name))
      const copy = join(output, file.name)
      await fs.copyFile(join(source, file.name), copy, constants.COPYFILE_EXCL)
      if ((await fs.lstat(copy)).size !== file.size || 'sha256:' + await digest(copy) !== file.digest) throw fail('godot_integrity_failed')
    }
  } catch (error) {
    await fs.rm(temporary, { recursive: true, force: true })
    throw error
  }
  await publishEngine(cache, { temporary, output }, { platform: 'win32', signal, env, enginePath: windowsGodotExecutableName(arch, true) })
}

// The tools directory receives its own engine, copied from the earlier
// installation. A preparation downloads it when that copy is unavailable;
// opening an existing project, which passes no download, does not.
async function installToolsEngine(cache, { arch, signal, env, download, warn, files }) {
  await fs.mkdir(cache, { recursive: true, mode: 0o700 })
  try { return await copyLegacyEngine(cache, { arch, signal, env, files }) } catch (error) {
    if (!download || signal.aborted) throw error
    warn('[game-toolchain] copying the existing engine failed; downloading it', { error_code: String(error?.code ?? 'unknown').slice(0, 64) })
  }
  await installManagedEngine(cache, { platform: 'win32', arch, signal, download, env })
}

// The warning carries only the error code because the message can contain
// local paths.
const toolsEngineFailure = (warn, error) => warn('[game-toolchain] tools engine installation failed; kept the existing engine', { error_code: String(error?.code ?? 'unknown').slice(0, 64) })

export async function prepareGameToolchain(root, {
  env = process.env, platform = process.platform, arch = process.arch,
  signal = AbortSignal.timeout(15 * 60_000), download = downloadDistribution, macosLocations,
  warn = console.warn, windowsEngineFiles: files,
} = {}) {
  const cache = managedGodotDirectory(env, platform, arch)
  await cleanupStalePreparations(cache)
  const inspect = () => inspectGameToolchain(root, { env, platform, macosLocations, arch })
  // Every successful return also completes the tools copy of the templates.
  const finish = async () => {
    const toolchain = inspect()
    await seedToolsTemplates(env, platform, cache)
    return toolchain
  }
  // An older managed engine serves this account but not a Windows safe-mode
  // account, so the tools directory receives its own engine once. This is best
  // effort: the working toolchain is kept when that installation fails, and
  // the next preparation retries.
  const completed = async () => {
    const toolchain = await finish()
    if (!needsToolsEngineCopy(toolchain.executable, env, platform, arch)) return toolchain
    try {
      await installToolsEngine(cache, { arch, signal, env, download, warn, files })
      return await finish()
    } catch (error) {
      toolsEngineFailure(warn, error)
      return toolchain
    }
  }
  let reason
  try { return await completed() } catch (error) {
    if (error.code === 'web_export_templates_unavailable' && !installableTemplates(error)) throw error
    reason = error.code
  }
  if (reason === 'godot_version_unsupported') throw fail(reason)
  if (reason === 'godot_unavailable' && env.GODOT_BIN) throw fail('godot_custom_unavailable')
  if (!['godot_unavailable', 'web_export_templates_unavailable'].includes(reason)) throw fail('godot_install_failed')
  if (!['darwin', 'win32', 'linux'].includes(platform) || ['win32', 'linux'].includes(platform) && !['x64', 'arm64'].includes(arch)) throw fail('godot_preparation_unsupported')

  await fs.mkdir(cache, { recursive: true, mode: 0o700 })
  try {
    if (reason === 'godot_unavailable') {
      // An executable that exists but cannot start is a user installation to
      // repair, not permission to replace it with a managed installation.
      let selected
      try { selected = resolveBuildExecutable(root, undefined, env, platform, macosLocations, arch) } catch {}
      if (selected) {
        // A concurrent attempt may have published between the first inspection
        // and this lookup. Reuse it only if it can actually run.
        try { return await completed() } catch (error) {
          if (!installableTemplates(error)) throw error
        }
      } else await installManagedEngine(cache, { platform, arch, signal, download, env })
    }
    try { return await completed() } catch (error) {
      if (!installableTemplates(error)) throw error
    }
    // A complete tools copy, verified on download or seeded from this
    // account's own Godot directory, is reused instead of downloaded again.
    const tools = managedExportTemplatesDirectory(env)
    let stage
    if (!tools || !await completeTemplates(tools)) {
      const asset = distribution.assets.find(asset => asset.name.endsWith('_export_templates.tpz'))
      stage = await extractedAsset(asset, cache, webTemplates.map(name => 'templates/' + name), signal, download, platform, env)
    }
    try {
      if (stage) {
        for (const name of webTemplates) {
          const source = join(stage.output, 'templates', name)
          await checkedFile(source)
          if (platform === 'win32') await windowsZip(source, null, [], { signal, env })
          else await run('/usr/bin/unzip', ['-tq', source], { signal, timeout: 60_000, maxBuffer: 16_384 })
        }
        if (tools) await publishTemplates(join(stage.output, 'templates'), tools, signal)
      }
      await publishTemplates(tools ?? join(stage.output, 'templates'), gameExportTemplatesDirectory(env, platform), signal)
      return await completed()
    } finally { if (stage) await fs.rm(stage.temporary, { recursive: true, force: true }) }
  } catch (error) {
    throw fail(Object.hasOwn(preparationMessages, error.code) ? error.code : 'godot_install_failed')
  }
}

// Opening an existing project only inspects its toolchain, so on Windows an
// older managed engine would stay the only one. Before the agent runs the
// project's commands, give the tools directory a copy of that engine and this
// account's templates. Nothing is downloaded: opening a project has a short
// time budget, and the next preparation downloads when the copy is
// unavailable. Best effort; returns whether the tools directory received an
// engine.
export async function provisionToolsDirectory(root, {
  env = process.env, platform = process.platform, arch = process.arch,
  signal = AbortSignal.timeout(3 * 60_000), macosLocations,
  warn = console.warn, windowsEngineFiles: files,
} = {}) {
  let executable
  try { executable = resolveBuildExecutable(root, undefined, env, platform, macosLocations, arch) } catch { return false }
  if (!needsToolsEngineCopy(executable, env, platform, arch)) return false
  const cache = managedGodotDirectory(env, platform, arch)
  try {
    await cleanupStalePreparations(cache)
    await seedToolsTemplates(env, platform, cache)
    await installToolsEngine(cache, { arch, signal, env, warn, files })
    return true
  } catch (error) {
    toolsEngineFailure(warn, error)
    return false
  }
}
