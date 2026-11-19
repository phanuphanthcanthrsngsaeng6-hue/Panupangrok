#!/usr/bin/env node
import fs from 'node:fs'
import { createConnection } from 'node:net'

const source = process.argv[2]
const fd = Number(source)
const socketSource = source?.startsWith('\\\\.\\pipe\\manus-webdev-git-') || process.platform !== 'win32' && /\/wdgit-[a-f0-9-]+\.sock$/.test(source ?? '')
if (
  process.argv.length !== 4 ||
  process.argv[3] !== 'get' ||
  (!socketSource && (!Number.isSafeInteger(fd) || fd < 3))
) {
  process.exit(1)
}


let request
let rawRequest
try {
  rawRequest = readBounded(0, 16 * 1024)
  const entries = rawRequest
    .split(/\r?\n/u)
    .filter(Boolean)
    .map(line => {
      const separator = line.indexOf('=')
      if (separator < 1) throw new Error('invalid credential protocol')
      return [line.slice(0, separator), line.slice(separator + 1)]
    })
  const singleValueKeys = new Set(['protocol', 'host', 'path', 'username'])
  const singleValueEntries = entries.filter(([key]) => singleValueKeys.has(key))
  const capabilities = entries
    .filter(([key]) => key === 'capability[]')
    .map(([, value]) => value)
  const wwwAuth = entries
    .filter(([key]) => key === 'wwwauth[]')
    .map(([, value]) => value)
  if (
    new Set(singleValueEntries.map(([key]) => key)).size !==
      singleValueEntries.length ||
    entries.some(
      ([key]) =>
        !singleValueKeys.has(key) &&
        key !== 'capability[]' &&
        key !== 'wwwauth[]',
    ) ||
    new Set(capabilities).size !== capabilities.length ||
    capabilities.some(
      capability => capability !== 'authtype' && capability !== 'state',
    ) ||
    wwwAuth.some(
      challenge =>
        !challenge ||
        challenge !== challenge.trim() ||
        /[\r\n\0]/u.test(challenge),
    )
  ) {
    throw new Error('invalid credential protocol')
  }
  request = Object.fromEntries(singleValueEntries)
} catch {
  process.exit(1)
}

let authority
try {
  authority = JSON.parse(socketSource ? await readSocket(source, rawRequest) : readBounded(fd, 16 * 1024))
} catch {
  process.exit(1)
}

let remote
try {
  remote = new URL(authority.remoteUrl)
} catch {
  process.exit(1)
}
if (
  !authority ||
  typeof authority !== 'object' ||
  Object.keys(authority).sort().join(',') !== 'password,remoteUrl,username' ||
  remote.protocol !== 'https:' ||
  remote.username ||
  remote.password ||
  remote.search ||
  remote.hash ||
  typeof authority.username !== 'string' ||
  !authority.username ||
  Buffer.byteLength(authority.username, 'utf8') > 8 * 1024 ||
  authority.username !== authority.username.trim() ||
  /[\r\n\0]/u.test(authority.username) ||
  typeof authority.password !== 'string' ||
  !authority.password ||
  Buffer.byteLength(authority.password, 'utf8') > 8 * 1024 ||
  authority.password !== authority.password.trim() ||
  /[\r\n\0]/u.test(authority.password) ||
  request.protocol !== 'https' ||
  request.host !== remote.host ||
  (request.username !== undefined && request.username !== authority.username) ||
  (request.path ?? '').replace(/^\/+/u, '') !== remote.pathname.replace(/^\/+/u, '')
) {
  process.exit(1)
}

process.stdout.write(`username=${authority.username}\npassword=${authority.password}\n`)

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

function readSocket(endpoint, request) {
  return new Promise((resolve, reject) => {
    const socket = createConnection(endpoint)
    let payload = ''
    socket.setTimeout(5000, () => socket.destroy(new Error('credential timeout')))
    socket.on('connect', () => socket.write(request.trimEnd() + '\n\n'))
    socket.on('data', chunk => {
      payload += chunk.toString('utf8')
      if (Buffer.byteLength(payload) > 16 * 1024) socket.destroy(new Error('input too large'))
    })
    socket.on('error', reject)
    socket.on('end', () => resolve(payload))
  })
}
