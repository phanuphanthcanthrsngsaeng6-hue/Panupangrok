#!/usr/bin/env node
import { inspectTextFile } from './scripts/inspect-text-file.mjs'
try {
  const [, , file, flag, range] = process.argv
  if (process.argv.length !== 3 && (process.argv.length !== 5 || flag !== '--lines' || !/^\d+:\d+$/.test(range))) {
    throw new Error('Usage: inspect-file.mjs <project-relative-text-file> [--lines START:END]')
  }
  const [startLine, endLine] = range ? range.split(':').map(Number) : []
  console.log(inspectTextFile(process.cwd(), file, { startLine, endLine }))
} catch (error) { console.error(error.message); process.exitCode = 1 }
