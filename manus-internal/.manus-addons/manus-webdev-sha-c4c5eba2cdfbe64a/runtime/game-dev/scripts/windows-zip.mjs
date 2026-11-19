import { execFile } from 'node:child_process'
import { join } from 'node:path'
import { promisify } from 'node:util'

const run = promisify(execFile)

// Windows includes .NET ZIP support. Select only pinned distribution members;
// archive names never become output paths or executable PowerShell source.
export async function windowsZip(archive, output, members, { signal, env = process.env } = {}) {
  const payload = Buffer.from(JSON.stringify({ archive, output, members }), 'utf8').toString('base64')
  const script = `
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$inputData = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${payload}')) | ConvertFrom-Json
$zip = [IO.Compression.ZipFile]::OpenRead($inputData.archive)
try {
  if ($inputData.output) {
    foreach ($name in $inputData.members) {
      $matches = @($zip.Entries | Where-Object { $_.FullName -ceq $name })
      if ($matches.Count -ne 1) { throw 'Missing or duplicate ZIP member' }
      $target = [IO.Path]::Combine($inputData.output, $name.Replace('/', [IO.Path]::DirectorySeparatorChar))
      [IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($target)) | Out-Null
      [IO.Compression.ZipFileExtensions]::ExtractToFile($matches[0], $target, $false)
    }
  } else {
    if ($zip.Entries.Count -eq 0) { throw 'Empty template ZIP' }
    foreach ($entry in $zip.Entries) {
      $stream = $entry.Open()
      try { $stream.CopyTo([IO.Stream]::Null) } finally { $stream.Dispose() }
    }
  }
} finally { $zip.Dispose() }
`
  if (members.some(name => !name || /[\\:\x00-\x1f]/.test(name) || name.split('/').some(part => !part || part === '.' || part === '..'))) {
    throw new Error('Invalid distribution member')
  }
  const powershell = join(env.SystemRoot || env.SYSTEMROOT || 'C:\\Windows', 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe')
  await run(powershell, ['-NoLogo', '-NoProfile', '-NonInteractive', '-EncodedCommand', Buffer.from(script, 'utf16le').toString('base64')],
    { signal, timeout: 120_000, maxBuffer: 16_384, windowsHide: true })
}
