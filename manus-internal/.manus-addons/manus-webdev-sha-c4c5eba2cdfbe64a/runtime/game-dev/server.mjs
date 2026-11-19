import { startGamePreview } from './preview-server.mjs'
import { handleStorageProxy } from './scripts/platform-preview.mjs'
import { fileURLToPath } from 'node:url'

await startGamePreview({
  storageProxy: handleStorageProxy,
  hydrateScript: fileURLToPath(new URL('./scripts/hydrate-assets.mjs', import.meta.url)),
})
