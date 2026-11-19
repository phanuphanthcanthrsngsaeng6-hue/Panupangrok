#!/usr/bin/env node
import { readFileSync, statSync } from 'node:fs'
import { prepareAssetEdit, applyAssetEdit, restoreAssetVersion } from './scripts/asset-edit.mjs'
try {
  const [mode, value, ...extra] = process.argv.slice(2)
  if (extra.length || !value || !['--prepare', '--apply', '--recover', '--restore'].includes(mode)) throw new Error('Usage: asset-edit.mjs --prepare request.json | --apply ID | --recover ID | --restore request.json')
  if (['--prepare', '--restore'].includes(mode) && (!statSync(value).isFile() || statSync(value).size > 64 * 1024)) throw new Error('Asset edit request is too large or invalid')
  const result = await (['--prepare', '--restore'].includes(mode) ? (mode === '--restore' ? restoreAssetVersion : prepareAssetEdit)(process.cwd(), JSON.parse(readFileSync(value, 'utf8'))) : applyAssetEdit(process.cwd(), value, mode === '--recover'))
  console.log(JSON.stringify(result))
  if (!['prepared', 'complete', 'restored'].includes(result.phase)) process.exitCode = 1
} catch (error) {
  console.error(JSON.stringify({ error: error.message, recovery: error.recovery }))
  process.exitCode = 1
}
