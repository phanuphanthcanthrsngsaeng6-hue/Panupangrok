#!/usr/bin/env node

import { deleteAsset } from './artifacts-lib.mjs'

const rel = process.argv[2]
if (!rel || process.argv.length !== 3) {
  throw new Error('usage: node scripts/delete-asset.mjs <asset-path>')
}

deleteAsset(process.cwd(), rel)
console.log(`[assets] deleted ${rel}`)
