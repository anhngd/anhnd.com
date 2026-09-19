// Standard 5-field cron: parser, plain-English description and next-run calculation.

export interface CronField {
  name: string
  raw: string
  values: number[]
  /** Starts with "*" (or is "?"), which changes how day-of-month and day-of-week combine. */
  star: boolean
}

export interface CronSpec {
  expression: string
  minute: CronField
  hour: CronField
  dayOfMonth: CronField
  month: CronField
  dayOfWeek: CronField
}

export type CronParse = { ok: true; spec: CronSpec } | { ok: false; error: string }

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

interface FieldDef {
  name: string
  min: number
  max: number
  names?: string[]
  /** Value of the first name (months start at 1, weekdays at 0). */
  nameOffset?: number
}

const DEFS: FieldDef[] = [
  { name: 'minute', min: 0, max: 59 },
  { name: 'hour', min: 0, max: 23 },
  { name: 'day of month', min: 1, max: 31 },
  { name: 'month', min: 1, max: 12, names: MONTHS, nameOffset: 1 },
  { name: 'day of week', min: 0, max: 6, names: DAYS, nameOffset: 0 },
]

const MACROS: Record<string, string> = {
  '@yearly': '0 0 1 1 *',
  '@annually': '0 0 1 1 *',
  '@monthly': '0 0 1 * *',
  '@weekly': '0 0 * * 0',
  '@daily': '0 0 * * *',
  '@midnight': '0 0 * * *',
  '@hourly': '0 * * * *',
}

function parseValue(token: string, def: FieldDef): number {
  const upper = token.toUpperCase()
  if (def.names) {
    const index = def.names.indexOf(upper)
    if (index !== -1) return index + (def.nameOffset ?? 0)
  }
  if (!/^\d+$/.test(token)) throw new Error(`Invalid ${def.name}: "${token}"`)

  const value = Number(token)
  // Day of week accepts 7 as another way to write Sunday.
  const max = def.name === 'day of week' ? 7 : def.max
  if (value < def.min || value > max) {
    throw new Error(`The ${def.name} must be between ${def.min} and ${max} (got ${value})`)
  }
  return def.name === 'day of week' && value === 7 ? 0 : value
}

function parseField(raw: string, def: FieldDef): CronField {
  if (/[LW#]/i.test(raw) && !def.names?.some((name) => raw.toUpperCase().includes(name))) {
    throw new Error(`Quartz-only syntax (L, W, #) in the ${def.name} isn't supported by standard cron`)
  }

  const values = new Set<number>()

  for (const part of raw.split(',')) {
    const match = part.match(/^(\*|\?|[^/\-*?]+)(?:-([^/\-*?]+))?(?:\/(\d+))?$/)
    if (!match) throw new Error(`Invalid ${def.name}: "${part}"`)

    const [, base, rangeEnd, stepText] = match
    const step = stepText === undefined ? 1 : Number(stepText)
    if (step < 1) throw new Error(`The step in the ${def.name} must be at least 1`)

    let start: number
    let end: number
    if (base === '*' || base === '?') {
      if (rangeEnd !== undefined) throw new Error(`Invalid ${def.name}: "${part}"`)
      start = def.min
      end = def.max
    } else {
      start = parseValue(base, def)
      // "a/n" means "from a to the end, every n".
      end = rangeEnd !== undefined ? parseValue(rangeEnd, def) : stepText !== undefined ? def.max : start
      if (def.name === 'day of week' && rangeEnd === '7') end = 6
      if (start > end) throw new Error(`The range ${base}-${rangeEnd} in the ${def.name} runs backwards`)
    }

    for (let value = start; value <= end; value += step) values.add(value)
  }

  return { name: def.name, raw, values: [...values].sort((a, b) => a - b), star: raw.startsWith('*') || raw === '?' }
}

export function parseCron(input: string): CronParse {
  const trimmed = input.trim().replace(/\s+/g, ' ')
  if (!trimmed) return { ok: false, error: 'Enter a cron expression.' }

  if (trimmed.toLowerCase() === '@reboot') {
    return { ok: false, error: '@reboot runs at startup, so it has no schedule to explain.' }
  }

  const expression = MACROS[trimmed.toLowerCase()] ?? trimmed
  const parts = expression.split(' ')
  if (parts.length !== 5) {
    return {
      ok: false,
      error:
        parts.length === 6 || parts.length === 7
          ? `This has ${parts.length} fields. Standard cron has 5 (minute hour day-of-month month day-of-week); a leading seconds field is a Quartz/Spring extension.`
          : `Expected 5 fields (minute hour day-of-month month day-of-week), got ${parts.length}.`,
    }
  }

  try {
    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts.map((part, index) => parseField(part, DEFS[index]))
    return { ok: true, spec: { expression, minute, hour, dayOfMonth, month, dayOfWeek } }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Invalid cron expression.' }
  }
}

// ---------------------------------------------------------------------------
// Description
// ---------------------------------------------------------------------------

const pad = (value: number) => String(value).padStart(2, '0')

function ordinal(n: number): string {
  const suffix = n % 100 >= 11 && n % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th'
  return `${n}${suffix}`
}

function joinList(items: string[]): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

type Shape =
  | { kind: 'all' }
  | { kind: 'single'; value: number }
  | { kind: 'step'; step: number }
  | { kind: 'range'; from: number; to: number }
  | { kind: 'list'; values: number[] }

function shapeOf(field: CronField, def: FieldDef): Shape {
  const { values } = field
  if (values.length === def.max - def.min + 1) return { kind: 'all' }
  if (values.length === 1) return { kind: 'single', value: values[0] }

  const step = values[1] - values[0]
  const evenlySpaced = values.every((value, index) => index === 0 || value - values[index - 1] === step)
  if (evenlySpaced && step === 1) return { kind: 'range', from: values[0], to: values[values.length - 1] }
  // "*/n" always reads as a step; otherwise only call three or more evenly spaced values a step.
  const starStep = /^\*\/\d+$/.test(field.raw)
  if (
    evenlySpaced &&
    step > 1 &&
    values[0] === def.min &&
    values[values.length - 1] + step > def.max &&
    (starStep || values.length >= 3)
  ) {
    return { kind: 'step', step }
  }
  return { kind: 'list', values }
}

function timePhrase(minute: Shape, hour: Shape, spec: CronSpec): string {
  const hours = spec.hour.values

  const hourClause = (): string => {
    if (hour.kind === 'single') return `during hour ${hour.value}`
    if (hour.kind === 'range') return `from ${pad(hour.from)}:00 through ${pad(hour.to)}:59`
    if (hour.kind === 'step') return `every ${ordinal(hour.step)} hour`
    return `during hours ${joinList(hours.map(String))}`
  }

  if (minute.kind === 'all') {
    return hour.kind === 'all' ? 'Every minute' : `Every minute ${hourClause()}`
  }

  if (minute.kind === 'step') {
    return hour.kind === 'all' ? `Every ${minute.step} minutes` : `Every ${minute.step} minutes ${hourClause()}`
  }

  if (minute.kind === 'single') {
    const m = minute.value
    if (hour.kind === 'all') return m === 0 ? 'Every hour, on the hour' : `At minute ${m} past every hour`
    if (hour.kind === 'single') return `At ${pad(hour.value)}:${pad(m)}`
    if (hour.kind === 'step') return m === 0 ? `Every ${hour.step} hours` : `At minute ${m} past every ${ordinal(hour.step)} hour`
    if (hour.kind === 'list' && hours.length <= 8) return `At ${joinList(hours.map((h) => `${pad(h)}:${pad(m)}`))}`
    return `At minute ${m} past every hour ${hourClause()}`
  }

  const minuteText =
    minute.kind === 'range' ? `every minute from ${minute.from} through ${minute.to}` : `minutes ${joinList(spec.minute.values.map(String))}`
  const lead = minute.kind === 'range' ? minuteText.replace(/^./, (c) => c.toUpperCase()) : `At ${minuteText}`
  return hour.kind === 'all' ? `${lead} past every hour` : `${lead} ${hourClause()}`
}

function dayPhrase(spec: CronSpec, dom: Shape, dow: Shape): string {
  const domText = (): string => {
    if (dom.kind === 'single') return `on day ${dom.value} of the month`
    if (dom.kind === 'range') return `on days ${dom.from} through ${dom.to} of the month`
    if (dom.kind === 'step') return `on every ${ordinal(dom.step)} day of the month`
    return `on days ${joinList(spec.dayOfMonth.values.map(String))} of the month`
  }
  const dowText = (): string => {
    if (dow.kind === 'single') return `on ${DAY_NAMES[dow.value]}`
    if (dow.kind === 'range') return `on ${DAY_NAMES[dow.from]} through ${DAY_NAMES[dow.to]}`
    return `on ${joinList(spec.dayOfWeek.values.map((value) => DAY_NAMES[value]))}`
  }

  if (dom.kind === 'all' && dow.kind === 'all') return 'every day'
  if (dow.kind === 'all') return domText()
  if (dom.kind === 'all') return dowText()

  // Both restricted: classic cron runs when EITHER matches, unless one of them starts with "*".
  return spec.dayOfMonth.star || spec.dayOfWeek.star
    ? `${domText()}, only if it falls ${dowText()}`
    : `${domText()} and ${dowText()}`
}

function monthPhrase(spec: CronSpec, month: Shape): string {
  const names = spec.month.values.map((value) => MONTH_NAMES[value - 1])
  if (month.kind === 'all') return ''
  if (month.kind === 'range') return `from ${MONTH_NAMES[month.from - 1]} through ${MONTH_NAMES[month.to - 1]}`
  if (month.kind === 'step') return `in every ${ordinal(month.step)} month`
  return `in ${joinList(names)}`
}

export function describeCron(spec: CronSpec): string {
  const minute = shapeOf(spec.minute, DEFS[0])
  const hour = shapeOf(spec.hour, DEFS[1])
  const dom = shapeOf(spec.dayOfMonth, DEFS[2])
  const month = shapeOf(spec.month, DEFS[3])
  const dow = shapeOf(spec.dayOfWeek, DEFS[4])

  const time = timePhrase(minute, hour, spec)
  const day = dayPhrase(spec, dom, dow)
  const months = monthPhrase(spec, month)

  const parts = [time]
  // A bare clock time reads better with its day ("At 09:00, every day"); other phrases already imply it.
  if (day !== 'every day' || /^At \d\d:\d\d/.test(time)) parts.push(day)
  if (months) parts.push(months)
  return parts.join(', ')
}

// ---------------------------------------------------------------------------
// Next runs
// ---------------------------------------------------------------------------

function dayMatches(spec: CronSpec, dayOfMonth: number, dayOfWeek: number): boolean {
  const domOk = spec.dayOfMonth.values.includes(dayOfMonth)
  const dowOk = spec.dayOfWeek.values.includes(dayOfWeek)
  const domAll = spec.dayOfMonth.star
  const dowAll = spec.dayOfWeek.star
  return domAll || dowAll ? domOk && dowOk : domOk || dowOk
}

/** The next `count` run times after `from`, in UTC or the browser's local time. Searches up to 8 years ahead. */
export function nextRuns(spec: CronSpec, from: Date, count: number, utc: boolean): Date[] {
  const runs: Date[] = []
  const y0 = utc ? from.getUTCFullYear() : from.getFullYear()
  const m0 = utc ? from.getUTCMonth() : from.getMonth()
  const d0 = utc ? from.getUTCDate() : from.getDate()
  const startMs = from.getTime()

  for (let offset = 0; offset < 366 * 8 && runs.length < count; offset++) {
    const day = utc ? new Date(Date.UTC(y0, m0, d0 + offset)) : new Date(y0, m0, d0 + offset)
    const year = utc ? day.getUTCFullYear() : day.getFullYear()
    const month = utc ? day.getUTCMonth() : day.getMonth()
    const date = utc ? day.getUTCDate() : day.getDate()
    const weekday = utc ? day.getUTCDay() : day.getDay()

    if (!spec.month.values.includes(month + 1) || !dayMatches(spec, date, weekday)) continue

    for (const hour of spec.hour.values) {
      for (const minute of spec.minute.values) {
        const candidate = utc ? new Date(Date.UTC(year, month, date, hour, minute)) : new Date(year, month, date, hour, minute)
        // Local times skipped by a DST jump come back shifted; they never actually happen.
        if (!utc && (candidate.getHours() !== hour || candidate.getMinutes() !== minute)) continue
        if (candidate.getTime() > startMs) {
          runs.push(candidate)
          if (runs.length === count) return runs
        }
      }
    }
  }

  return runs
}
