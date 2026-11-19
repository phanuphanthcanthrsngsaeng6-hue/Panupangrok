import { lstatSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { BACKEND_CONTRACT, backendBindingMismatch, parseBackendContract, readBackendContract } from '../leaderboard-reference/server/backend-contract.mjs'

// Payment-only backends share the existing auth release binding. Leaderboard
// declarations remain authoritative and must never lose their boards/rules.
export function prepareBackendContract(root, { dockerfilePath, healthPath, routes }) {
  root = resolve(root)
  if (!lstatSync(join(root, 'project.godot'), { throwIfNoEntry: false })?.isFile()) throw new Error('A Godot project is required')
  let candidate
  try {
    candidate = parseBackendContract({
      schema: 'manus.game.auth-backend-contract/v1',
      deploy: { mode: 'hybrid', dockerfilePath, healthPath },
      routes, api: { protocolVersion: 1 }, database: { schemaVersion: 1 },
    })
  } catch (error) {
    const failed = error?.field ? `${error.field} ${error.rule}. ` : ''
    throw new Error(`Current Webdev config is incompatible with the Godot backend declaration: ${failed}Requirements: deploy.healthPath must be an /api/... path without wildcards; deploy.dockerfilePath must be project-relative; routes must include /api/* server routing with cache omitted, "no-cache" or 0, and end with a /* static fallback. Reconcile the config and actual backend before retrying; no declaration was written.`)
  }
  // Validate before writing and refuse symlinks in the Dockerfile path.
  let current = root
  for (const part of dockerfilePath.split('/')) {
    current = join(current, part)
    const stat = lstatSync(current, { throwIfNoEntry: false })
    if (!stat || stat.isSymbolicLink()) throw new Error('The declared Dockerfile must exist in the project without symlinks')
  }
  if (!lstatSync(current).isFile()) throw new Error('The declared Dockerfile must be a regular file')
  const existing = readBackendContract(root)
  if (existing) {
    const mismatch = backendBindingMismatch(existing.value, candidate)
    if (mismatch) throw new Error(`Existing backend declaration preserved: ${mismatch} differs; reconcile the config and declaration explicitly`)
    return { created: false, path: BACKEND_CONTRACT }
  }
  const content = JSON.stringify(candidate, null, 2) + '\n'
  if (Buffer.byteLength(content) > 16 * 1024) throw new Error('Backend declaration exceeds the release reader size limit')
  writeFileSync(join(root, BACKEND_CONTRACT), content, { flag: 'wx' })
  return { created: true, path: BACKEND_CONTRACT }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2)
  if (args.length !== 6 || args[0] !== '--dockerfile' || args[2] !== '--health-path' || args[4] !== '--routes') {
    throw new Error('Usage: prepare-backend-contract.mjs --dockerfile <config deploy.dockerfilePath> --health-path <config deploy.healthPath> --routes <config routes JSON>')
  }
  console.log(JSON.stringify(prepareBackendContract(process.cwd(), { dockerfilePath: args[1], healthPath: args[3], routes: JSON.parse(args[5]) })))
}
