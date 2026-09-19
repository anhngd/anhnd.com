'use client'

import { useState } from 'react'
import { CopyButton, Notice } from '@/app/components/tools/ui'
import { useNow } from '@/app/components/tools/useNow'
import { card, chip, field, label } from '@/app/components/tools/toolStyles'
import {
  LOCAL_ZONE,
  ZONES,
  formatInZone,
  formatWallTime,
  localZoneName,
  parseInstant,
  parseWallTime,
  relativeTime,
  wallTimeToDate,
} from '@/lib/tools/time'

function Row({ name, value }: { name: string; value: string }) {
  return (
    <div className="py-2.5 flex items-center justify-between gap-3">
      <dt className="text-xs text-ink-3 shrink-0 w-28">{name}</dt>
      <dd className="font-mono text-[13px] text-ink break-all flex-1">{value}</dd>
      <CopyButton text={value} variant="ghost" label="Copy" />
    </div>
  )
}

export default function TimestampTool() {
  const now = useNow(1000)
  const [zone, setZone] = useState(LOCAL_ZONE)
  const [input, setInput] = useState('')
  const [wall, setWall] = useState('')

  const parsed = input.trim() ? parseInstant(input) : null
  const wallParts = wall ? parseWallTime(wall) : null
  const fromWall = wallParts ? wallTimeToDate(wallParts, zone) : null

  const zoneLabel = (id: string, fallback: string) => (id === LOCAL_ZONE && now !== null ? `${fallback} (${localZoneName()})` : fallback)

  return (
    <div className="space-y-5">
      <section className={`${card} p-5 sm:p-6`} aria-labelledby="ts-now">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h2 id="ts-now" className="text-xs uppercase tracking-wider text-ink-3" style={{ fontWeight: 600 }}>Now</h2>
          <div>
            <label htmlFor="ts-zone" className="sr-only">Time zone</label>
            <select
              id="ts-zone"
              value={zone}
              onChange={(event) => setZone(event.target.value)}
              className="text-sm text-ink-2 bg-card border border-line-strong rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              {ZONES.map((option) => (
                <option key={option.id} value={option.id}>{zoneLabel(option.id, option.label)}</option>
              ))}
            </select>
          </div>
        </div>
        <dl className="divide-y divide-line">
          <Row name="Seconds" value={now === null ? '—' : String(Math.floor(now / 1000))} />
          <Row name="Milliseconds" value={now === null ? '—' : String(now)} />
          <Row name="Date" value={now === null ? '—' : formatInZone(new Date(now), zone)} />
        </dl>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className={`${card} p-5 sm:p-6`} aria-labelledby="ts-to-date">
          <h2 id="ts-to-date" className="text-xs uppercase tracking-wider text-ink-3 mb-4" style={{ fontWeight: 600 }}>
            Timestamp or date → readable
          </h2>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="ts-input" className={label}>Unix timestamp, or a date like 2024-05-06T09:30:00Z</label>
          </div>
          <div className="flex gap-2">
            <input
              id="ts-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              spellCheck={false}
              placeholder="1700000000"
              className={field}
              aria-invalid={input.trim() !== '' && !parsed}
            />
            <button type="button" className={chip} onClick={() => setInput(String(Math.floor(Date.now() / 1000)))}>Now</button>
          </div>

          <div className="mt-4">
            {input.trim() !== '' && !parsed && <Notice tone="error">Couldn’t read that as a timestamp or a date.</Notice>}
            {parsed && (
              <>
                {parsed.unit && (
                  <p className="text-xs text-ink-3 mb-2" style={{ fontWeight: 400 }}>Read as {parsed.unit}.</p>
                )}
                <dl className="divide-y divide-line">
                  <Row name="Selected zone" value={formatInZone(parsed.date, zone)} />
                  <Row name="UTC" value={formatInZone(parsed.date, 'UTC')} />
                  <Row name="ISO 8601" value={parsed.date.toISOString()} />
                  <Row name="Relative" value={now === null ? '—' : relativeTime(parsed.date, now)} />
                  <Row name="Seconds" value={String(Math.floor(parsed.date.getTime() / 1000))} />
                  <Row name="Milliseconds" value={String(parsed.date.getTime())} />
                </dl>
              </>
            )}
            {!input.trim() && (
              <p className="text-xs text-ink-3 leading-relaxed" style={{ fontWeight: 400 }}>
                Seconds, milliseconds, microseconds and nanoseconds are told apart by length. Dates without a zone are
                read in your browser’s local time.
              </p>
            )}
          </div>
        </section>

        <section className={`${card} p-5 sm:p-6`} aria-labelledby="ts-to-stamp">
          <h2 id="ts-to-stamp" className="text-xs uppercase tracking-wider text-ink-3 mb-4" style={{ fontWeight: 600 }}>
            Date → timestamp
          </h2>
          <label htmlFor="ts-wall" className={`${label} block mb-2`}>Date and time in the selected zone</label>
          <div className="flex gap-2">
            <input
              id="ts-wall"
              type="datetime-local"
              step={1}
              value={wall}
              onChange={(event) => setWall(event.target.value)}
              className={`${field} font-sans`}
            />
            <button
              type="button"
              className={chip}
              onClick={() => setWall(formatWallTime(new Date(), zone))}
            >
              Now
            </button>
          </div>

          <div className="mt-4">
            {fromWall ? (
              <dl className="divide-y divide-line">
                <Row name="Seconds" value={String(Math.floor(fromWall.getTime() / 1000))} />
                <Row name="Milliseconds" value={String(fromWall.getTime())} />
                <Row name="UTC" value={formatInZone(fromWall, 'UTC')} />
                <Row name="ISO 8601" value={fromWall.toISOString()} />
              </dl>
            ) : (
              <p className="text-xs text-ink-3 leading-relaxed" style={{ fontWeight: 400 }}>
                Pick a date and time to get its Unix timestamp. Changing the zone above changes which instant it means.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
