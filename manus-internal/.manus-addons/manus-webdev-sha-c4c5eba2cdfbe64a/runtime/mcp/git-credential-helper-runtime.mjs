#!/usr/bin/env node
// 终端侧 git credential helper（mono#982）：沙箱内模型直接跑 `git push` 时由
// 项目 .git/config 的 credential.helper 调起。凭据按需经 sandbox loopback
// （POST /v1/addon-runtime/credentials）现取，缓存与 single-flight 只由 Addon Server 负责。
// 与旧 git-credential-helper.mjs（匿名 FD 单次喂凭据，供 lease executor /
// addon-server transport 内部使用）是两个独立协议，互不替代。
//
// argv: node git-credential-helper-runtime.mjs <configPath> <get|store|erase>
// config JSON: { runtime_api, addon_id, provider_id, resource_id, application_kind? }
import fs from 'node:fs'

const RUNTIME_GIT_CREDENTIAL_SCHEMA = 'manus.webdev.runtime_git_credential/v1'
const FETCH_TIMEOUT_MS = 20 * 1000
const GAME_FETCH_BUDGET_MS = 35 * 1000
const GAME_RETRY_DELAYS_MS = [250, 750]
const MAX_INPUT_BYTES = 16 * 1024

const configPath = process.argv[2]
const operation = process.argv[3]
if (process.argv.length !== 4 || !configPath) {
  process.exit(1)
}

const config = readConfig(configPath)
if (!config) {
  process.exit(1)
}

if (operation === 'store' || operation === 'erase') {
  // 本 helper 不持久化凭据；Git 的 approve/reject 通知无需本地状态。
  process.exit(0)
} else if (operation !== 'get') {
  process.exit(1)
}

const request = readCredentialRequest()
if (!request) {
  reportGameFailure(config, 'invalid_request')
  process.exit(1)
}

if (config.operation_id && !transferRequestMatches(config, request)) {
  reportGameFailure(config, 'target_mismatch')
  process.exit(1)
}
const credential = await mintCredential(config, request)
if (!credential) process.exit(1)
if (!credentialMatchesRequest(credential, request)) {
  reportGameFailure(config, Date.parse(credential.expiresAt) <= Date.now()
    ? 'credential_expired' : 'target_mismatch')
  process.exit(1)
}
emit(credential)
process.exit(0)

function emit(credential) {
  process.stdout.write(
    `username=${credential.username}\npassword=${credential.password}\n`,
  )
}

function readConfig(target) {
  let value
  try {
    value = JSON.parse(fs.readFileSync(target, 'utf8'))
  } catch {
    return undefined
  }
  if (
    !value ||
    typeof value !== 'object' ||
    typeof value.runtime_api !== 'string' ||
    !/^https?:\/\//u.test(value.runtime_api) ||
    typeof value.addon_id !== 'string' ||
    !value.addon_id ||
    typeof value.provider_id !== 'string' ||
    !value.provider_id ||
    typeof value.resource_id !== 'string' ||
    !value.resource_id ||
    value.resource_id.length > 128
  ) {
    return undefined
  }
  if (value.operation_id !== undefined && (
    typeof value.operation_id !== 'string' || !/^[A-Za-z0-9_-]{1,128}$/u.test(value.operation_id) ||
    typeof value.remote_url !== 'string'
  )) return undefined
  return value
}

function readCredentialRequest() {
  let raw
  try {
    raw = readBounded(0, MAX_INPUT_BYTES)
  } catch {
    return undefined
  }
  const request = {}
  for (const line of raw.split(/\r?\n/u)) {
    if (!line) continue
    const separator = line.indexOf('=')
    if (separator < 1) return undefined
    const key = line.slice(0, separator)
    const value = line.slice(separator + 1)
    if (key === 'protocol' || key === 'host' || key === 'path' || key === 'username') {
      if (key in request) return undefined
      request[key] = value
    } else if (key !== 'capability[]' && key !== 'wwwauth[]') {
      return undefined
    }
  }
  if (request.protocol !== 'https' || !request.host) {
    return undefined
  }
  return request
}

function isRuntimeGitCredential(value) {
  if (
    !value ||
    typeof value !== 'object' ||
    value.schema !== RUNTIME_GIT_CREDENTIAL_SCHEMA ||
    typeof value.remoteUrl !== 'string' ||
    typeof value.username !== 'string' ||
    !value.username ||
    typeof value.password !== 'string' ||
    !value.password ||
    typeof value.expiresAt !== 'string'
  ) {
    return false
  }
  if (/[\r\n\0]/u.test(value.username) || /[\r\n\0]/u.test(value.password)) {
    return false
  }
  let remote
  try {
    remote = new URL(value.remoteUrl)
  } catch {
    return false
  }
  if (remote.protocol !== 'https:' || remote.username || remote.password) {
    return false
  }
  const expiresAtMs = Date.parse(value.expiresAt)
  return Number.isFinite(expiresAtMs)
}

function credentialMatchesRequest(credential, request) {
  if (Date.parse(credential.expiresAt) <= Date.now()) return false
  let remote
  try {
    remote = new URL(credential.remoteUrl)
  } catch {
    return false
  }
  if (request.host !== remote.host) return false
  if (request.username !== undefined && request.username !== credential.username) {
    return false
  }
  // credential.useHttpPath=true：git 会带 path；只把凭据交给 canonical 仓本身。
  const requestPath = (request.path ?? '').replace(/^\/+/u, '')
  const remotePath = remote.pathname.replace(/^\/+/u, '')
  return requestPath === remotePath
}

function transferRequestMatches(config, request) {
  try {
    const remote = new URL(config.remote_url)
    return remote.protocol === 'https:' && !remote.username && !remote.password &&
      !remote.search && !remote.hash && request.host === remote.host &&
      request.path === remote.pathname.replace(/^\//u, '')
  } catch { return false }
}

async function mintCredential(target, request) {
  if (target.application_kind !== 'game') {
    return (await mintCredentialAttempt(target, request, FETCH_TIMEOUT_MS, false)).credential
  }
  // The provider may spend 30s minting a token. Bound the entire game lookup,
  // including response bodies and retry delays, without changing legacy callers.
  const deadline = Date.now() + GAME_FETCH_BUDGET_MS
  let failure = 'request_timeout'
  for (let attempt = 0; attempt <= GAME_RETRY_DELAYS_MS.length; attempt += 1) {
    const remaining = deadline - Date.now()
    if (remaining <= 0) break
    const result = await mintCredentialAttempt(target, request, remaining, true)
    if (result.credential) return result.credential
    failure = result.failure
    const delay = GAME_RETRY_DELAYS_MS[attempt]
    if (!result.retryable || delay === undefined || deadline - Date.now() <= delay) break
    await new Promise(resolve => setTimeout(resolve, delay))
  }
  reportGameFailure(target, failure)
  return undefined
}

async function mintCredentialAttempt(target, request, timeoutMs, game) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(
      `${target.runtime_api.replace(/\/+$/u, '')}/v1/addon-runtime/credentials`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          addon_id: target.addon_id,
          provider_id: target.provider_id,
          resource_id: target.resource_id,
          kind: 'git',
          context: {
            ...(target.operation_id ? { operationId: target.operation_id } : {}),
            protocol: request.protocol,
            host: request.host,
            path: request.path ?? '',
          },
        }),
        signal: controller.signal,
      },
    )
    // Preserve the legacy header-only deadline outside GameDev.
    if (!game) clearTimeout(timer)
    if (!response.ok) {
      if (game) controller.abort()
      return httpFailure(response.status)
    }
    const body = await response.json()
    return isRuntimeGitCredential(body)
      ? { credential: body }
      : { failure: 'invalid_response', retryable: false }
  } catch (error) {
    if (controller.signal.aborted) return { failure: 'request_timeout', retryable: true }
    if (error instanceof SyntaxError) return { failure: 'invalid_response', retryable: false }
    return { failure: 'transport_unavailable', retryable: true }
  } finally {
    clearTimeout(timer)
  }
}

function httpFailure(status) {
  if (status === 401) return { failure: 'runtime_auth_unavailable', retryable: false }
  if (status === 403) return { failure: 'permission_denied', retryable: false }
  if (status === 408) return { failure: 'request_timeout', retryable: true }
  if (status === 429) return { failure: 'rate_limited', retryable: true }
  if (status === 502 || status === 503 || status === 504) {
    return { failure: 'service_unavailable', retryable: true }
  }
  return { failure: 'request_rejected', retryable: false }
}

function reportGameFailure(target, failure) {
  if (target.application_kind !== 'game') return
  // Only fixed categories and instructions; never print response bodies, URLs,
  // credentials, request input, or exceptions from the runtime/provider.
  const messages = {
    invalid_request: 'Git credential request is invalid.',
    invalid_response: 'Runtime returned an invalid Git credential response.',
    target_mismatch: 'Git credential target does not match the authorized repository.',
    credential_expired: 'Runtime returned an expired Git credential.',
    runtime_auth_unavailable: 'Runtime authentication is unavailable.',
    permission_denied: 'Runtime permission was denied.',
    request_timeout: 'Git credential lookup timed out.',
    rate_limited: 'Git credential service is rate limited.',
    service_unavailable: 'Git credential service is temporarily unavailable.',
    transport_unavailable: 'Git credential service could not be reached.',
    request_rejected: 'Git credential request was rejected.',
  }
  const message = messages[failure] ?? messages.invalid_response
  const action = failure === 'runtime_auth_unavailable' || failure === 'credential_expired'
    ? 'Resume this task to refresh runtime access, then retry Git; if it persists, check GameDev access.'
    : failure === 'target_mismatch' || failure === 'invalid_request'
      ? 'Check this task\'s authorized project and Git credential configuration before retrying.'
      : 'Retry Git in this task; if it persists, check GameDev access.'
  process.stderr.write(`[manus-game-git] ${message} ${action}\n`)
}

function readBounded(readFD, limit) {
  const chunks = []
  let total = 0
  while (true) {
    const chunk = Buffer.allocUnsafe(Math.min(4096, limit + 1 - total))
    const read = fs.readSync(readFD, chunk, 0, chunk.length, null)
    if (read === 0) break
    total += read
    if (total > limit) throw new Error('input too large')
    chunks.push(chunk.subarray(0, read))
  }
  return Buffer.concat(chunks).toString('utf8')
}
