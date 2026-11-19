import { prepareGameToolchain, preparationMessages, provisionToolsDirectory } from './scripts/prepare-toolchain.mjs'
import { checkGameEnvironment } from './doctor.mjs'

const controller = new AbortController()
const cancel = () => controller.abort()
process.on('SIGINT', cancel)
process.on('SIGTERM', cancel)
// Attaching an existing project only provisions the tools directory; it
// neither verifies nor changes the selected toolchain, and copies instead of
// downloading, within the shorter budget of opening a project.
const toolsDirectory = process.argv.includes('--tools-directory')
const signal = AbortSignal.any([controller.signal, AbortSignal.timeout((toolsDirectory ? 3 : 15) * 60_000)])
try {
  if (toolsDirectory) {
    console.log(JSON.stringify({ ok: true, installed: await provisionToolsDirectory(process.cwd(), { signal }) }))
  } else {
    await prepareGameToolchain(process.cwd(), { signal })
    const result = checkGameEnvironment()
    console.log(JSON.stringify(result))
    if (!result.ok) process.exitCode = 1
  }
} catch (error) {
  const code = Object.hasOwn(preparationMessages, error.code) ? error.code : 'godot_install_failed'
  console.log(JSON.stringify({ ok: false, code, message: preparationMessages[code] }))
  process.exitCode = 1
} finally {
  process.removeListener('SIGINT', cancel)
  process.removeListener('SIGTERM', cancel)
}
