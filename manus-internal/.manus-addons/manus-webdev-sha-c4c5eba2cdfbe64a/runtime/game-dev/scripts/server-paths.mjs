import { isAbsolute, relative, resolve, sep } from 'node:path'

export function decodeUrlPath(rawUrl) {
  try {
    return decodeURIComponent((rawUrl || '/').split('?')[0])
  } catch {
    return null
  }
}

export function resolveDistFile(root, urlPath) {
  const target = resolve(root, urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, ''))
  const rel = relative(resolve(root), target)
  if (rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) return null
  return target
}
