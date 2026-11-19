#!/usr/bin/env node
import { buildStandalone } from './scripts/build-standalone.mjs'
try {
  if (process.argv.length !== 2) throw new Error('Usage: npm run build')
  const result = buildStandalone(process.cwd())
  console.log(JSON.stringify(result))
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
