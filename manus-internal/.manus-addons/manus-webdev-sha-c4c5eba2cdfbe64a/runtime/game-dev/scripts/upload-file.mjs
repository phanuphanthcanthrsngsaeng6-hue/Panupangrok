import { StorageError, uploadGameFile } from './storage.mjs'

try {
  if (process.argv.length !== 3) throw new Error('Usage: upload-file.mjs <file>')
  console.log(JSON.stringify(await uploadGameFile(process.argv[2])))
} catch (error) {
  // No raw network errors, response bodies, or signed URLs may escape the process.
  if (error instanceof StorageError) console.error(JSON.stringify({ code: error.code, httpStatus: error.httpStatus }))
  else console.error('Storage file could not be uploaded')
  process.exitCode = 1
}
