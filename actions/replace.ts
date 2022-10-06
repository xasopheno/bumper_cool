const RE = /([0-9]+)|([a-zA-Z]+)/g

function parse(ver: string): ReadonlyArray<string | number> {
  const parts = []
  for (const m of ver.matchAll(RE)) {
    parts.push(m[1] ? parseInt(m[1]) : m[2])
  }
  if (parts[0] == 'v') parts.shift()
  return parts
}

export function compare(v1: string, v2: string): -1 | 0 | 1 {
  const p1 = parse(v1)
  const p2 = parse(v2)
  const len = Math.min(p1.length, p2.length)
  for (let i = 0; i <= len; i++) {
    const n1 = p1[i] || 0
    const n2 = p2[i] || 0
    if (typeof n1 == typeof n2) {
      if (n1 < n2) return -1
      if (n1 > n2) return 1
    } else {
      return typeof n1 == 'string' ? -1 : 1
    }
  }
  return 0
}

export class UpgradeError extends Error {}

function assertNewer(v1: string, v2: string): void {
  const c = compare(v1, v2)
  if (c == 0) {
    throw new UpgradeError(`the formula is already at version '${v1}'`)
  } else if (c == -1) {
    throw new UpgradeError(`the formula version '${v2}' is newer than '${v1}'`)
  }
}

function escape(value: string, char: string): string {
  return value.replace(new RegExp(`\\${char}`, 'g'), `\\${char}`)
}

export function replaceFields(
  oldContent: string,
  replacements: Map<string, string>
): string {
  let newContent = oldContent
  for (const [field, value] of replacements) {
    newContent = newContent.replace(
      new RegExp(`^(\\s*)${field}((?::| *=>)? *)v([^'"]+)([^'"]+)\\3\n`, 'm'),
      (
        _: string,
        indent: string,
        sep: string,
        // q: string,
        old: string
      ): string => {
        if (field == 'pkgver=') assertNewer(value, old)
        // else if (field == 'url' && !value.endsWith('.git'))
        // assertNewer(fromUrl(value), fromUrl(old))
        return `${indent}${field}${value}\n`
      }
    )
  }
  return newContent
}

export function removeRevisionLine(oldContent: string): string {
  return oldContent.replace(/^[ \t]*revision \d+ *\r?\n/m, '')
}
