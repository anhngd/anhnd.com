'use client'

import { useState } from 'react'
import { CopyButton, Notice, Segmented } from '@/app/components/tools/ui'
import { useNow } from '@/app/components/tools/useNow'
import { card, chip, field, label } from '@/app/components/tools/toolStyles'
import { DAY_NAMES, MONTH_NAMES, describeCron, nextRuns, parseCron, type CronField } from '@/lib/tools/cron'
import { LOCAL_ZONE, formatInZone, localZoneName, relativeTime } from '@/lib/tools/time'

const PRESETS: { label: string; expression: string }[] = [
  { label: 'Every minute', expression: '* * * * *' },
  { label: 'Every 15 minutes', expression: '*/15 * * * *' },
  { label: 'Hourly', expression: '0 * * * *' },
  { label: 'Daily at 09:00', expression: '0 9 * * *' },
  { label: 'Weekdays at 09:30', expression: '30 9 * * 1-5' },
  { label: 'Weekly (Mon 08:00)', expression: '0 8 * * 1' },
  { label: 'Monthly (1st)', expression: '0 0 1 * *' },
  { label: 'Yearly', expression: '@yearly' },
]

const COLUMNS: { key: 'minute' | 'hour' | 'dayOfMonth' | 'month' | 'dayOfWeek'; title: string; hint: string }[] = [
  { key: 'minute', title: 'Minute', hint: '0–59' },
  { key: 'hour', title: 'Hour', hint: '0–23' },
  { key: 'dayOfMonth', title: 'Day of month', hint: '1–31' },
  { key: 'month', title: 'Month', hint: '1–12' },
  { key: 'dayOfWeek', title: 'Day of week', hint: '0–6, Sun = 0' },
]

function expand(field: CronField, key: string): string {
  const all = { minute: 60, hour: 24, dayOfMonth: 31, month: 12, dayOfWeek: 7 }[key] ?? 0
  if (field.values.length === all) return 'every value'

  const name = (value: number) => (key === 'month' ? MONTH_NAMES[value - 1].slice(0, 3) : key === 'dayOfWeek' ? DAY_NAMES[value].slice(0, 3) : String(value))
  return field.values.length > 10 ? `${field.values.slice(0, 10).map(name).join(', ')}, … (${field.values.length})` : field.values.map(name).join(', ')
}

export default function CronTool() {
  const [expression, setExpression] = useState('30 9 * * 1-5')
  const [zone, setZone] = useState<'local' | 'utc'>('local')
  const now = useNow(30_000)

  const parsed = parseCron(expression)
  const description = parsed.ok ? describeCron(parsed.spec) : ''
  const runs = parsed.ok && now !== null ? nextRuns(parsed.spec, new Date(now), 6, zone === 'utc') : null

  return (
    <div className="space-y-5">
      <section className={`${card} p-5 sm:p-6`}>
        <label htmlFor="cron-input" className={`${label} block mb-2`} style={{ fontWeight: 500 }}>Cron expression</label>
        <input
          id="cron-input"
          value={expression}
          onChange={(event) => setExpression(event.target.value)}
          spellCheck={false}
          autoComplete="off"
          placeholder="*/5 * * * *"
          className={`${field} text-lg sm:text-xl tracking-wide py-3.5`}
          aria-invalid={!parsed.ok && expression.trim() !== ''}
          aria-describedby="cron-result"
        />
        <div className="flex flex-wrap gap-2 mt-3">
          {PRESETS.map((preset) => (
            <button key={preset.expression} type="button" className={chip} onClick={() => setExpression(preset.expression)}>
              {preset.label}
            </button>
          ))}
        </div>

        <div id="cron-result" className="mt-5" aria-live="polite">
          {parsed.ok ? (
            <div className="flex items-start justify-between gap-3">
              <p className="text-xl sm:text-2xl text-[#1A1A1A] leading-snug" style={{ fontWeight: 300, letterSpacing: '-0.01em' }}>
                {description}
              </p>
              <CopyButton text={description} variant="ghost" />
            </div>
          ) : (
            expression.trim() !== '' && <Notice tone="error">{parsed.error}</Notice>
          )}
        </div>
      </section>

      {parsed.ok && (
        <>
          <section className={`${card} p-5 sm:p-6`} aria-labelledby="cron-fields">
            <h2 id="cron-fields" className="text-xs uppercase tracking-wider text-[#8A8886] mb-4" style={{ fontWeight: 500 }}>Fields</h2>
            <dl className="grid grid-cols-2 sm:grid-cols-5 gap-x-4 gap-y-5">
              {COLUMNS.map((column) => (
                <div key={column.key}>
                  <dt className="text-xs text-[#8A8886]">{column.title} <span className="text-[#B4B2AF]">({column.hint})</span></dt>
                  <dd className="mt-1.5 font-mono text-base text-[#1A1A1A]">{parsed.spec[column.key].raw}</dd>
                  <dd className="mt-1 text-xs text-[#605E5C] leading-relaxed break-words" style={{ fontWeight: 300 }}>{expand(parsed.spec[column.key], column.key)}</dd>
                </div>
              ))}
            </dl>
            {parsed.spec.dayOfMonth.raw !== '*' && parsed.spec.dayOfWeek.raw !== '*' && !parsed.spec.dayOfMonth.star && !parsed.spec.dayOfWeek.star && (
              <p className="mt-5 text-xs text-[#8A8886] leading-relaxed" style={{ fontWeight: 300 }}>
                When both day-of-month and day-of-week are set, standard cron runs when <em>either</em> matches, not both.
              </p>
            )}
          </section>

          <section className={`${card} p-5 sm:p-6`} aria-labelledby="cron-runs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 id="cron-runs" className="text-xs uppercase tracking-wider text-[#8A8886]" style={{ fontWeight: 500 }}>Next runs</h2>
              <Segmented
                name="cron-zone"
                legend="Time zone"
                value={zone}
                onChange={setZone}
                options={[
                  { value: 'local', label: now === null ? 'Local' : `Local (${localZoneName()})` },
                  { value: 'utc', label: 'UTC' },
                ]}
              />
            </div>

            {runs === null ? (
              <p className="text-sm text-[#8A8886]">Calculating…</p>
            ) : runs.length === 0 ? (
              <Notice tone="warning">This schedule never runs in the next 8 years (for example, February 31st).</Notice>
            ) : (
              <ol className="divide-y divide-[#F0EEEC]">
                {runs.map((run, index) => (
                  <li key={run.getTime()} className="py-2.5 flex items-baseline justify-between gap-3">
                    <span className="flex items-baseline gap-3">
                      <span className="text-xs text-[#B4B2AF] tabular-nums w-4">{index + 1}</span>
                      <span className="font-mono text-[13px] text-[#1A1A1A]">{formatInZone(run, zone === 'utc' ? 'UTC' : LOCAL_ZONE).replace(/:\d\d (UTC)/, ' $1')}</span>
                    </span>
                    <span className="text-xs text-[#8A8886]">{now === null ? '' : relativeTime(run, now)}</span>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </>
      )}

      <p className="text-xs text-[#8A8886] leading-relaxed" style={{ fontWeight: 300 }}>
        Supports standard 5-field cron: minute, hour, day of month, month, day of week. Ranges (1-5), lists (1,15),
        steps (*/10), names (MON, JAN) and macros like @daily all work. Quartz-only features such as a seconds field,
        L, W and # are not part of standard cron. Cloud schedulers often run in UTC, so check which time zone yours uses.
      </p>
    </div>
  )
}
