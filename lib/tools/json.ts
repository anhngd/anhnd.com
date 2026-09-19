// JSON parsing with friendly error locations, formatting, and a structural diff.

export interface JsonError {
  message: string
  /** 1-based, or 0 when the JS engine did not report a location. */
  line: number
  column: number
}

export type ParseResult = { ok: true; value: unknown } | { ok: false; error: JsonError }

const NUMBER = /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/y

/**
 * Offset of the first character that makes `text` invalid JSON (text.length when it ends too early),
 * or -1 if the text is valid. Engines disagree about reporting error positions, so we find our own.
 */
function findErrorOffset(text: string): number {
  let i = 0

  const skipSpace = () => {
    while (i < text.length && ' \t\n\r'.includes(text[i])) i++
  }
  const fail = (): never => {
    throw i
  }

  const string = () => {
    i++ // opening quote
    while (i < text.length) {
      const char = text[i]
      if (char === '"') return void i++
      if (char < ' ') fail()
      if (char !== '\\') {
        i++
      } else if (text[i + 1] === 'u') {
        if (!/^[0-9a-fA-F]{4}$/.test(text.slice(i + 2, i + 6))) {
          i += 2
          fail()
        }
        i += 6
      } else if (i + 1 < text.length && '"\\/bfnrt'.includes(text[i + 1])) {
        i += 2
      } else {
        i++
        fail()
      }
    }
    fail()
  }

  const value = (): void => {
    skipSpace()
    const char = text[i]
    if (char === '{') return object()
    if (char === '[') return array()
    if (char === '"') return string()
    if (char === '-' || (char >= '0' && char <= '9')) {
      NUMBER.lastIndex = i
      const match = NUMBER.exec(text)
      if (!match) {
        i++
        fail()
      }
      i += match![0].length
      return
    }
    for (const literal of ['true', 'false', 'null']) {
      if (text.startsWith(literal, i)) return void (i += literal.length)
    }
    fail()
  }

  const object = () => {
    i++
    skipSpace()
    if (text[i] === '}') return void i++
    for (;;) {
      skipSpace()
      if (text[i] !== '"') fail()
      string()
      skipSpace()
      if (text[i] !== ':') fail()
      i++
      value()
      skipSpace()
      if (text[i] === ',') {
        i++
        continue
      }
      if (text[i] === '}') return void i++
      fail()
    }
  }

  const array = () => {
    i++
    skipSpace()
    if (text[i] === ']') return void i++
    for (;;) {
      value()
      skipSpace()
      if (text[i] === ',') {
        i++
        continue
      }
      if (text[i] === ']') return void i++
      fail()
    }
  }

  try {
    value()
    skipSpace()
    return i < text.length ? i : -1
  } catch (offset) {
    return typeof offset === 'number' ? offset : -1
  }
}

export function parseJson(text: string): ParseResult {
  try {
    return { ok: true, value: JSON.parse(text) }
  } catch (error) {
    const offset = findErrorOffset(text)
    if (offset === -1) {
      return { ok: false, error: { message: error instanceof Error ? error.message : 'Invalid JSON', line: 0, column: 0 } }
    }

    const lines = text.slice(0, offset).split('\n')
    const found = text[offset]
    return {
      ok: false,
      error: {
        message: found === undefined ? 'Unexpected end of JSON' : `Unexpected character ${JSON.stringify(found)}`,
        line: lines.length,
        column: lines[lines.length - 1].length + 1,
      },
    }
  }
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys)
  if (value && typeof value === 'object') {
    const source = value as Record<string, unknown>
    return Object.fromEntries(Object.keys(source).sort().map((key) => [key, sortKeys(source[key])]))
  }
  return value
}

export interface FormatOptions {
  /** Number of spaces, or 'tab'. 0 minifies. */
  indent: 0 | 2 | 4 | 'tab'
  sortKeys: boolean
}

export function formatJson(value: unknown, options: FormatOptions): string {
  const input = options.sortKeys ? sortKeys(value) : value
  const space = options.indent === 'tab' ? '\t' : options.indent
  return JSON.stringify(input, null, space) ?? ''
}

/** JSON.parse turns integers beyond 2^53 into the nearest double, silently changing them. */
export function hasPrecisionRisk(text: string): boolean {
  return /(?<![\w.])-?\d{16,}(?![\w.])/.test(text.replace(/"(?:[^"\\]|\\.)*"/g, '""'))
}

// ---------------------------------------------------------------------------
// Diff
// ---------------------------------------------------------------------------

export type DiffKind = 'added' | 'removed' | 'changed'

export interface DiffEntry {
  path: string
  kind: DiffKind
  before?: unknown
  after?: unknown
}

function childPath(path: string, key: string | number): string {
  if (typeof key === 'number') return `${path}[${key}]`
  return /^[A-Za-z_$][\w$]*$/.test(key) ? `${path}.${key}` : `${path}[${JSON.stringify(key)}]`
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/** Compares two parsed JSON values. Arrays are compared index by index. */
export function diffJson(before: unknown, after: unknown, path = '$'): DiffEntry[] {
  if (Array.isArray(before) && Array.isArray(after)) {
    const entries: DiffEntry[] = []
    const length = Math.max(before.length, after.length)
    for (let index = 0; index < length; index++) {
      const at = childPath(path, index)
      if (index >= before.length) entries.push({ path: at, kind: 'added', after: after[index] })
      else if (index >= after.length) entries.push({ path: at, kind: 'removed', before: before[index] })
      else entries.push(...diffJson(before[index], after[index], at))
    }
    return entries
  }

  if (isObject(before) && isObject(after)) {
    const entries: DiffEntry[] = []
    const keys = [...Object.keys(before), ...Object.keys(after).filter((key) => !(key in before))]
    for (const key of keys) {
      const at = childPath(path, key)
      if (!(key in after)) entries.push({ path: at, kind: 'removed', before: before[key] })
      else if (!(key in before)) entries.push({ path: at, kind: 'added', after: after[key] })
      else entries.push(...diffJson(before[key], after[key], at))
    }
    return entries
  }

  return Object.is(before, after) ? [] : [{ path, kind: 'changed', before, after }]
}
