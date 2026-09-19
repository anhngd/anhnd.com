// Unix timestamp <-> date helpers built on Intl, so time zones need no library.

export type TimestampUnit = 'seconds' | 'milliseconds' | 'microseconds' | 'nanoseconds'

export interface ParsedInstant {
  date: Date
  /** Set when the input was a number, telling which unit we assumed. */
  unit?: TimestampUnit
}

/**
 * Accepts a Unix timestamp (unit guessed from its digit count) or any date string the JS engine
 * understands. Strings without a zone, like "2024-05-06 09:30", are read in the browser's local time.
 */
export function parseInstant(input: string): ParsedInstant | null {
  const text = input.trim()
  if (!text) return null

  if (/^-?\d+(\.\d+)?$/.test(text)) {
    const digits = text.replace(/^-/, '').split('.')[0].length
    const value = Number(text)
    const unit: TimestampUnit =
      digits <= 11 ? 'seconds' : digits <= 13 ? 'milliseconds' : digits <= 16 ? 'microseconds' : 'nanoseconds'
    const divisor = { seconds: 1e-3, milliseconds: 1, microseconds: 1e3, nanoseconds: 1e6 }[unit]
    const date = new Date(value / divisor)
    return Number.isNaN(date.getTime()) ? null : { date, unit }
  }

  const date = new Date(text)
  return Number.isNaN(date.getTime()) ? null : { date }
}

export const LOCAL_ZONE = 'local'

export interface ZoneOption {
  id: string
  label: string
}

export const ZONES: ZoneOption[] = [
  { id: LOCAL_ZONE, label: 'Browser local time' },
  { id: 'UTC', label: 'UTC' },
  { id: 'Asia/Ho_Chi_Minh', label: 'Vietnam (Ho Chi Minh)' },
  { id: 'Asia/Singapore', label: 'Singapore' },
  { id: 'Asia/Tokyo', label: 'Tokyo' },
  { id: 'Australia/Sydney', label: 'Sydney' },
  { id: 'Europe/London', label: 'London' },
  { id: 'Europe/Berlin', label: 'Berlin' },
  { id: 'America/New_York', label: 'New York' },
  { id: 'America/Los_Angeles', label: 'Los Angeles' },
]

function timeZoneOption(zone: string): { timeZone?: string } {
  return zone === LOCAL_ZONE ? {} : { timeZone: zone }
}

export function localZoneName(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

function partsIn(date: Date, zone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    ...timeZoneOption(zone),
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    timeZoneName: 'longOffset',
  }).formatToParts(date)

  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? ''
  return {
    weekday: get('weekday'),
    year: get('year'),
    month: get('month'),
    day: get('day'),
    hour: get('hour'),
    minute: get('minute'),
    second: get('second'),
    offset: get('timeZoneName').replace('GMT', 'UTC') || 'UTC',
  }
}

/** e.g. "Mon, 2024-05-06 09:30:00 UTC+07:00" */
export function formatInZone(date: Date, zone: string): string {
  const p = partsIn(date, zone)
  const offset = p.offset === 'UTC' ? 'UTC+00:00' : p.offset
  return `${p.weekday}, ${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second} ${offset}`
}

/** "YYYY-MM-DDTHH:mm:ss" in the zone: the value format of an <input type="datetime-local">. */
export function formatWallTime(date: Date, zone: string): string {
  const p = partsIn(date, zone)
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}`
}

export function relativeTime(date: Date, nowMs: number): string {
  const seconds = Math.round((date.getTime() - nowMs) / 1000)
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  if (Math.abs(seconds) < 5) return 'just now'
  if (Math.abs(seconds) < 60) return formatter.format(seconds, 'second')

  // Round first, then pick the unit, so 59m50s reads "1 hour" rather than "60 minutes".
  const units: [Intl.RelativeTimeFormatUnit, number, number][] = [
    ['minute', 60, 60],
    ['hour', 3600, 24],
    ['day', 86400, 30],
    ['month', 86400 * 30, 12],
  ]
  for (const [unit, size, limit] of units) {
    const amount = Math.round(seconds / size)
    if (Math.abs(amount) < limit) return formatter.format(amount, unit)
  }
  return formatter.format(Math.round(seconds / (86400 * 365)), 'year')
}

export interface WallTime {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

/** Parses "YYYY-MM-DD HH:mm[:ss]" (a space or "T" between date and time). */
export function parseWallTime(text: string): WallTime | null {
  const match = text.trim().match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/)
  if (!match) return null

  const [year, month, day, hour, minute, second] = match.slice(1).map((value) => Number(value ?? 0))
  const wall = { year, month, day, hour, minute, second }

  // Reject impossible dates such as 2024-02-31 instead of letting Date roll them over.
  const check = new Date(Date.UTC(year, month - 1, day, hour, minute, second))
  const valid =
    check.getUTCFullYear() === year &&
    check.getUTCMonth() === month - 1 &&
    check.getUTCDate() === day &&
    hour < 24 &&
    minute < 60 &&
    second < 60
  return valid ? wall : null
}

/** Converts a wall-clock time in a zone to the instant it denotes. */
export function wallTimeToDate(wall: WallTime, zone: string): Date {
  if (zone === LOCAL_ZONE) {
    return new Date(wall.year, wall.month - 1, wall.day, wall.hour, wall.minute, wall.second)
  }

  const asUtc = Date.UTC(wall.year, wall.month - 1, wall.day, wall.hour, wall.minute, wall.second)
  const offsetAt = (instant: number) => {
    const p = partsIn(new Date(instant), zone)
    const shown = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), Number(p.hour), Number(p.minute), Number(p.second))
    return shown - Math.floor(instant / 1000) * 1000
  }

  // Two passes settle the offset even when it changes (DST) between the guess and the answer.
  let instant = asUtc - offsetAt(asUtc)
  instant = asUtc - offsetAt(instant)
  return new Date(instant)
}
