#!/usr/bin/env node
import fs from 'node:fs/promises'
import { writeFileSync, renameSync, existsSync } from 'node:fs'
import path from 'node:path'
import net from 'node:net'
import os from 'node:os'
import { spawn, execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import crypto from 'node:crypto'
const directory = path.dirname(fileURLToPath(import.meta.url))
const args = process.argv.slice(2),
  verb = args.shift()
function option(name, fallback) {
  const i = args.indexOf(`--${name}`)
  return i < 0 ? fallback : args[i + 1]
}
async function preset(name) {
  if (!/^[a-z]+$/.test(name ?? '')) throw Error('Select a preset with list')
  const p = JSON.parse(await fs.readFile(path.join(directory, 'presets', `${name}.json`), 'utf8'))
  for (const plugin of p.configuration.initializationOptions.plugins ?? [])
    plugin.location = path.resolve(process.execPath, '../../lib/node_modules', plugin.name)
  return p
}
const helpText = `manus-webdev-lsp
  list
  describe --preset NAME
  stop --state FILE
  start (--preset NAME | --command PATH [--args JSON_ARRAY]) [--project DIR] [--settings FILE] [--id NAME] [--state FILE] [--port N]
Presets automatically register with the current Webdev MCP and initialize its built-in LSP client.
Custom commands only start a server and return a registration template; fill files and register with webdev.config PUT runtime/post-edit.
Run start as a resident service (Cascade exec service:true). The project defaults to cwd; TCP port defaults to 0 (allocate).
Post-edit config controls connections and file routing. --settings references editable native LSP initializationOptions/settings, not routing.
Use stop --state with the current launch_state_file (or DELETE runtime/post-edit) for an intentional stop; platform termination signals are treated as recoverable disconnects.
There is no separate HTTP adapter or serve process.`

async function register(body, root) {
  const requestDir = await fs.mkdtemp(path.join(os.tmpdir(), 'webdev-lsp-register-'))
  try {
    const input = path.join(requestDir, 'request.json')
    await fs.writeFile(input, JSON.stringify({ method: 'PUT', path: 'runtime/post-edit', body }), { mode: 0o600 })
    const env = { ...process.env, NO_COLOR: '1' }
    // 内层调用需读取真正的 MCP 返回，不能让外层 terminal capture 把它变为占位回执。
    delete env.MANUS_MCP_RESULT_FILEPATH
    delete env.MANUS_MCP_RESULT_PATH
    const { stdout } = await promisify(execFile)('manus-mcp-cli', ['--server', 'webdev-mcp', 'tool', 'call', 'webdev.config', '--input-file', input],
      { cwd: root, env, timeout: 90000, maxBuffer: 4 * 1024 * 1024 })
    const output = stdout.replace(/\u001b\[[0-9;]*m/g, '')
    const saved = output.match(/Tool execution result saved to: ([^\r\n]+)/)
    const envelope = JSON.parse(saved ? await fs.readFile(saved[1].trim(), 'utf8') : output.split('Tool execution result:\n').at(-1))
    if (envelope.isError || envelope.executionMode === 'node_builtin_facade') throw Error('MCP registration was not executed successfully')
    const result = envelope.structuredContent ?? (envelope.content
      ? JSON.parse(envelope.content.find(item => item.type === 'text')?.text ?? '{}') : envelope)
    if (!result.ok || result.server_id !== body.server_id || result.registered !== true || result.connection_status !== 'ready')
      throw Error(`LSP registration did not become ready: ${JSON.stringify(result)}`)
    return result
  } finally { await fs.rm(requestDir, { recursive: true, force: true }) }
}
if (verb === '--help' || verb === 'help' || args.includes('--help') || args.includes('-h')) {
  console.log(helpText)
} else if (verb === 'list') {
  console.log(
    JSON.stringify({
      presets: (await fs.readdir(path.join(directory, 'presets'))).map((n) => n.replace('.json', '')),
    }),
  )
} else if (verb === 'describe') {
  console.log(JSON.stringify(await preset(option('preset')), null, 2))
} else if (verb === 'stop') {
  const selected = option('state')
  if (!selected) throw Error('stop requires --state FILE from the current LSP registration')
  const state = path.resolve(selected)
  const receipt = JSON.parse(await fs.readFile(state, 'utf8'))
  if (receipt.cli !== 'manus-webdev-lsp') throw Error('Invalid LSP launch receipt')
  if (receipt.replacement_state_file) throw Error('This launch receipt was replaced; use the current launch_state_file from GET runtime/post-edit')
  if (receipt.lifecycle_status !== 'running') throw Error('This launcher is not running; use the current registration or DELETE runtime/post-edit to keep it stopped')
  // Signal intent through the unique receipt, not a potentially reused OS PID.
  await fs.writeFile(state + '.stop', 'stop requested\n', { mode: 0o600 })
  console.log(JSON.stringify({ stop_requested: true, state_file: state }))
} else if (verb === 'start') {
  if (args.includes('--preset') && (args.includes('--command') || args.includes('--args')))
    throw Error('Do not combine --preset with --command/--args. Use describe for preset settings, then start --command for a different executable and fill its registration and native settings.')
  const p = option('preset')
    ? await preset(option('preset'))
    : {
        command: option('command'),
        args: JSON.parse(option('args', '[]')),
        files: {},
        configuration: { initializationOptions: {}, settings: {} },
      }
  if (!p.command) throw Error('Use --preset NAME or --command PATH --args JSON_ARRAY')
  if (!Array.isArray(p.args) || p.args.some(arg => typeof arg !== 'string')) throw Error('--args must be a JSON string array')
  const serverId = option('id', p.name ?? path.basename(p.command).replace(/[^a-zA-Z0-9_-]/g, '_'))
  if (!/^[a-zA-Z0-9_-]{1,80}$/.test(serverId)) throw Error('--id must be an identifier')
  const port = Number(option('port', '0'))
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw Error('--port must be 0..65535')
  const root = path.resolve(option('project', process.cwd()))
  await fs.access(root)
  const state = path.resolve(option('state', path.join(os.tmpdir(), 'manus-webdev', 'lsp', `lsp-${crypto.randomUUID()}.json`)))
  await fs.mkdir(path.dirname(state), { recursive: true })
  await fs.rm(state + '.stop', { force: true })
  const child = spawn(p.command, p.args, { cwd: root, stdio: ['pipe', 'pipe', 'inherit'] })
  let receipt, stopTimer
  let client,
    closing = false
  const pending = []
  let pendingBytes = 0
  child.stdout.on('data', (chunk) => {
    if (client) client.write(chunk)
    else {
      pendingBytes += chunk.length
      if (pendingBytes > 1048576) finish(1)
      else pending.push(chunk)
    }
  })
  const server = net.createServer((socket) => {
    if (client) {
      socket.destroy()
      return
    }
    client = socket
    for (const chunk of pending) socket.write(chunk)
    pending.length = 0
    socket.pipe(child.stdin)
    socket.on('error', () => finish(1, 'disconnected'))
    socket.on('close', () => finish(0, 'disconnected'))
  })
  function finish(code, status = 'failed') {
    if (closing) return
    closing = true
    clearInterval(stopTimer)
    if (existsSync(state + '.stop')) status = 'stopped'
    if (receipt) {
      try {
        receipt.lifecycle_status = status
        writeFileSync(state + '.tmp', JSON.stringify(receipt, null, 2), { mode: 0o600 })
        renameSync(state + '.tmp', state)
      } catch { /* Preserve process cleanup even if the receipt cannot be updated. */ }
    }
    client?.destroy()
    server.close()
    child.kill('SIGTERM')
    setTimeout(() => {
      child.kill('SIGKILL')
      process.exit(code)
    }, 500).unref()
  }
  child.on('error', (e) => {
    console.error(e.message)
    finish(1)
  })
  child.on('exit', (code, signal) => finish(code ?? 1, signal ? 'disconnected' : 'failed'))
  child.stdin.on('error', () => finish(1, 'disconnected'))
  process.on('SIGTERM', () => finish(0, 'disconnected'))
  process.on('SIGINT', () => finish(0, 'disconnected'))
  try {
  await new Promise((resolve, reject) => {
    child.once('spawn', resolve)
    child.once('error', reject)
  })
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(port, '127.0.0.1', resolve)
  })
  const connection = { transport: 'tcp', host: '127.0.0.1', port: server.address().port }
  const settingsFile = option('settings')
    ? path.resolve(option('settings'))
    : option('preset') ? path.join(root, '.manus', 'lsp', `${serverId}.settings.json`) : undefined
  if (settingsFile && !option('settings')) {
    await fs.mkdir(path.dirname(settingsFile), { recursive: true })
    try {
      await fs.writeFile(settingsFile, JSON.stringify({ initializationOptions: p.configuration.initializationOptions ?? {},
        settings: p.configuration.settings ?? {} }, null, 2), { mode: 0o600, flag: 'wx' })
    } catch (error) { if (error.code !== 'EEXIST') { finish(1); throw error } }
  }
  const registration = { server_id: serverId, connection: { host: connection.host, port: connection.port },
    files: p.files, launch_state_file: state, ...(settingsFile ? { settings_file: settingsFile } : {}) }
  // Write before preset PUT so registration can bind the exact launch receipt.
  receipt = { cli: 'manus-webdev-lsp', pid: process.pid, lsp_pid: child.pid,
    native_server: { command: p.command, args: p.args, preset_tested_version: p.testedVersion },
    project_dir: root, connection, server_id: serverId, registration, settings_file: settingsFile,
    lifecycle_status: 'running', state_file: state }
  await fs.writeFile(state, JSON.stringify(receipt, null, 2), { mode: 0o600 })
  stopTimer = setInterval(() => { if (existsSync(state + '.stop')) finish(0, 'stopped') }, 100)
  stopTimer.unref()
  let registered
  if (option('preset')) {
    try { registered = await register(registration, root) }
    catch (error) { finish(1); throw error }
  }
  const result = {
    lifecycle_status: 'running',
    cli: 'manus-webdev-lsp',
    pid: process.pid, lsp_pid: child.pid,
    native_server: { command: p.command, args: p.args, preset_tested_version: p.testedVersion },
    project_dir: root, connection, server_id: serverId,
    registered: registered?.registered ?? false,
    connection_status: registered?.connection_status ?? 'not_registered',
    registration,
    settings_file: settingsFile,
    description: p.description,
    configuration_contract: {
      post_edit: 'Connection and file routing are stored by Manus. Presets register automatically; custom servers use webdev.config PUT runtime/post-edit. files maps names/extensions to LSP language IDs, not checking rules.',
      settings_file: 'Agent-editable JSON with initializationOptions and settings payloads. Native server defines their meaning. Preset values only seed a new file; restart never overwrites edits.',
      reload: 'settings hot-load and use standard LSP configuration notifications/queries. Notification sent does not prove the server applied it. initializationOptions changes require restarting the server and registering its new address.',
    },
    launch_instructions: 'Use exec with service:true and the explicit project cwd. The client is built into MCP; do not start a separate client or HTTP adapter.',
    lifecycle: 'One MCP connection owns this stdio LSP session. Disconnect stops this broker and its native child. After MCP replacement Webdev restores registered sessions from this launch receipt. Use stop --state with the current receipt to suppress automatic restart; platform signals remain recoverable.',
    state_file: state,
    next: option('preset') ? 'Registered and initialized. Inspect GET runtime/post-edit for routing and configuration status. Verify a real source diagnostic and correction.'
      : 'Fill registration.files, optionally add settings_file, and register with webdev.config PUT runtime/post-edit. Custom startup does not register or infer native settings.',
  }
  if (closing) throw Error('LSP launcher disconnected during registration')
  receipt = result
  await fs.writeFile(state, JSON.stringify(result, null, 2), { mode: 0o600 })
  console.log(JSON.stringify(result, null, 2))
  } catch (error) { finish(1); throw error }
} else {
  console.log(helpText)
  if (verb) process.exitCode = 1
}
