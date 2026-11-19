#!/usr/bin/env node
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { inspectTextureBudgets } from './scripts/texture-budget.mjs'

const args = process.argv.slice(2)
if (args.some(arg => arg !== '--strict') || !existsSync(join(process.cwd(), 'project.godot'))) {
  console.error('Run from the game project root: node "$GAME_RUNTIME/check-textures.mjs" [--strict]')
  process.exitCode = 2
} else {
  const report = inspectTextureBudgets(process.cwd())
  console.log(JSON.stringify(report, null, 2))
  if (args.includes('--strict') && !report.ok) process.exitCode = 1
}
