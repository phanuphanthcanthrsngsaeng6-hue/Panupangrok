#!/usr/bin/env node
import { verifyGame } from './scripts/verify-game.mjs'
try {
  const args = process.argv.slice(2)
  if (args.some(arg => arg !== '--pack') || args.length > 1) throw new Error('Usage: npm run check [-- --pack]')
  console.log(JSON.stringify(verifyGame(process.cwd(), { pack: args.includes('--pack') })))
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
