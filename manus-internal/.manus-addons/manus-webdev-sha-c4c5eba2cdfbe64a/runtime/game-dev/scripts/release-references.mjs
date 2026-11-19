/** Preserve the existing conservative substring/ASCII word checks without
 * rescanning each player source once per excluded file and class. */
export function excludedReferenceMatcher(paths, classes) {
  const root = { next: new Map(), terminal: false }
  for (const path of paths) {
    let node = root
    // Index UTF-16 code units, just like String.includes used by the old check.
    for (let i = 0; i < path.length; i++) {
      const char = path[i]
      if (!node.next.has(char)) node.next.set(char, { next: new Map(), terminal: false })
      node = node.next.get(char)
    }
    node.terminal = true
  }
  const names = new Set(classes)
  return source => {
    if (root.next.size || root.terminal) {
      for (let start = source.indexOf('res://'); start !== -1; start = source.indexOf('res://', start + 6)) {
        let node = root
        if (node.terminal) return true
        for (let i = start + 6; i < source.length; i++) {
          node = node.next.get(source[i])
          if (!node) break
          // No trailing delimiter required: the previous includes check also
          // rejected res://tests/a.gd.import when tests/a.gd was excluded.
          if (node.terminal) return true
        }
      }
    }
    if (names.size) for (const match of source.matchAll(/\w+/g)) {
      if (names.has(match[0])) return true
    }
    return false
  }
}
