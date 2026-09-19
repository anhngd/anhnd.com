'use client'

import { useEffect, useRef, useState } from 'react'
import { CopyButton, Notice } from '@/app/components/tools/ui'
import { card, chip, field, label, readonlyField, toggleChip } from '@/app/components/tools/toolStyles'
import { MAX_MATCHES, buildSegments, createRegexRunner, type RegexResponse, type RegexRunner } from '@/lib/tools/regex'

const FLAGS = [
  { flag: 'g', name: 'global', hint: 'Find all matches, not just the first' },
  { flag: 'i', name: 'ignore case', hint: 'Case-insensitive' },
  { flag: 'm', name: 'multiline', hint: '^ and $ match at every line' },
  { flag: 's', name: 'dotAll', hint: '. also matches newlines' },
  { flag: 'u', name: 'unicode', hint: 'Unicode mode, enables \\p{…} classes' },
  { flag: 'y', name: 'sticky', hint: 'Match only at lastIndex' },
] as const

const SAMPLE = {
  pattern: '(?<user>[\\w.]+)@(?<domain>[\\w-]+\\.[a-z]{2,})',
  flags: 'gi',
  text: 'Contact me@anhnd.com or Support@Example.org.\nNot an email: user@localhost',
}

const CHEAT_SHEET: [string, string][] = [
  ['.', 'Any character (except newline)'],
  ['\\d  \\w  \\s', 'Digit, word character, whitespace (capitalise to negate)'],
  ['[abc]  [^abc]  [a-z]', 'Any of, none of, a range'],
  ['^  $  \\b', 'Start, end, word boundary'],
  ['*  +  ?  {2,4}', 'Zero or more, one or more, optional, between 2 and 4'],
  ['*?  +?', 'Lazy versions: as few as possible'],
  ['(abc)  (?:abc)', 'Capture group, non-capturing group'],
  ['(?<name>abc)  \\k<name>', 'Named group, and a back-reference to it'],
  ['a|b', 'Either a or b'],
  ['(?=a)  (?!a)  (?<=a)  (?<!a)', 'Lookahead / lookbehind, positive and negative'],
  ['\\p{L}  \\p{Lu}', 'Unicode letters / uppercase letters (needs the u flag)'],
]

/** The pattern box sits between the "/" and "/flags" labels, so it needs square ends and no side borders. */
const patternField = field.replace('rounded-xl', 'rounded-none').replace('border border-', 'border-y border-')

const HIGHLIGHT = ['bg-mark-1', 'bg-mark-2']

export default function RegexTool() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [text, setText] = useState('')
  const [replaceOn, setReplaceOn] = useState(false)
  const [replacement, setReplacement] = useState('')
  const [response, setResponse] = useState<RegexResponse | null>(null)
  const runner = useRef<RegexRunner | null>(null)

  useEffect(() => () => runner.current?.dispose(), [])

  // Run the (possibly slow) regex off the main thread, after a short pause in typing.
  useEffect(() => {
    if (!pattern) return
    let cancelled = false
    const timer = window.setTimeout(async () => {
      runner.current ??= createRegexRunner()
      const result = await runner.current.run({ pattern, flags, text, replacement: replaceOn ? replacement : null })
      if (!cancelled) setResponse(result)
    }, 150)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [pattern, flags, text, replaceOn, replacement])

  const toggleFlag = (flag: string, on: boolean) =>
    setFlags(FLAGS.map((item) => item.flag).filter((item) => (item === flag ? on : flags.includes(item))).join(''))

  const shown = pattern ? response : null
  const matches = shown?.ok ? shown.matches : []
  const segments = shown?.ok ? buildSegments(text, matches) : []

  return (
    <div className="space-y-5">
      <section className={`${card} p-5 sm:p-6 space-y-5`}>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="rx-pattern" className={label} style={{ fontWeight: 500 }}>Pattern</label>
            <button
              type="button"
              className={chip}
              onClick={() => { setPattern(SAMPLE.pattern); setFlags(SAMPLE.flags); setText(SAMPLE.text) }}
            >
              Sample
            </button>
          </div>
          <div className="flex items-stretch">
            <span className="flex items-center px-3 font-mono text-sm text-ink-3 bg-sunken border border-r-0 border-line-strong rounded-l-xl" aria-hidden="true">/</span>
            <input
              id="rx-pattern"
              value={pattern}
              onChange={(event) => setPattern(event.target.value)}
              spellCheck={false}
              autoComplete="off"
              placeholder="(\d+)-(?<word>[a-z]+)"
              className={patternField}
              aria-invalid={shown?.ok === false}
            />
            <span className="flex items-center px-3 font-mono text-sm text-ink-3 bg-sunken border border-l-0 border-line-strong rounded-r-xl" aria-hidden="true">
              /{flags}
            </span>
          </div>
        </div>

        <fieldset>
          <legend className="sr-only">Flags</legend>
          <div className="flex flex-wrap gap-2">
            {FLAGS.map((item) => (
              <div key={item.flag}>
                <input
                  type="checkbox"
                  id={`rx-flag-${item.flag}`}
                  checked={flags.includes(item.flag)}
                  onChange={(event) => toggleFlag(item.flag, event.target.checked)}
                  className="peer sr-only"
                />
                <label htmlFor={`rx-flag-${item.flag}`} className={toggleChip} title={item.hint}>
                  <span className="dot w-1.5 h-1.5 rounded-full bg-ink-4" aria-hidden="true" />
                  <span className="font-mono">{item.flag}</span> {item.name}
                </label>
              </div>
            ))}
            <div>
              <input type="checkbox" id="rx-replace" checked={replaceOn} onChange={(event) => setReplaceOn(event.target.checked)} className="peer sr-only" />
              <label htmlFor="rx-replace" className={toggleChip}>
                <span className="dot w-1.5 h-1.5 rounded-full bg-ink-4" aria-hidden="true" />
                Replace
              </label>
            </div>
          </div>
        </fieldset>

        {shown && !shown.ok && <Notice tone={shown.timedOut ? 'warning' : 'error'}>{shown.error}</Notice>}

        <div>
          <label htmlFor="rx-text" className={`${label} block mb-2`} style={{ fontWeight: 500 }}>Test string</label>
          <textarea
            id="rx-text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            spellCheck={false}
            maxLength={200_000}
            placeholder="Paste the text to search"
            className={`${field} min-h-[10rem] resize-y`}
          />
        </div>

        {replaceOn && (
          <div>
            <label htmlFor="rx-replacement" className={`${label} block mb-2`} style={{ fontWeight: 500 }}>
              Replacement <span className="text-ink-4" style={{ fontWeight: 400 }}>· $1, $&lt;name&gt;, $&amp; are supported</span>
            </label>
            <input
              id="rx-replacement"
              value={replacement}
              onChange={(event) => setReplacement(event.target.value)}
              spellCheck={false}
              placeholder="$<user> at $<domain>"
              className={field}
            />
          </div>
        )}
      </section>

      {shown?.ok && (
        <>
          <section className={`${card} p-5 sm:p-6`} aria-labelledby="rx-result" aria-live="polite">
            <h2 id="rx-result" className="text-sm text-ink-2 mb-4" style={{ fontWeight: 600 }}>
              {matches.length === 0
                ? 'No matches'
                : `${matches.length}${shown.truncated ? '+' : ''} ${matches.length === 1 ? 'match' : 'matches'}`}
              {shown.truncated && (
                <span className="text-ink-3" style={{ fontWeight: 400 }}> · showing the first {MAX_MATCHES}</span>
              )}
            </h2>
            {text && (
              <pre className="font-mono text-[13px] leading-relaxed text-ink whitespace-pre-wrap break-words">
                {segments.map((segment, index) =>
                  segment.match === null ? (
                    <span key={index}>{segment.text}</span>
                  ) : (
                    <mark key={index} className={`${HIGHLIGHT[segment.match % 2]} text-inherit rounded-sm`}>{segment.text}</mark>
                  )
                )}
              </pre>
            )}
          </section>

          {replaceOn && shown.replaced !== null && (
            <section className={`${card} p-5 sm:p-6`}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs uppercase tracking-wider text-ink-3" style={{ fontWeight: 600 }}>Replace result</h2>
                <CopyButton text={shown.replaced} variant="ghost" />
              </div>
              <textarea value={shown.replaced} readOnly aria-label="Replace result" className={`${readonlyField} min-h-[6rem] resize-y`} />
            </section>
          )}

          {matches.length > 0 && (
            <section className={`${card} p-5 sm:p-6`} aria-labelledby="rx-details">
              <h2 id="rx-details" className="text-xs uppercase tracking-wider text-ink-3 mb-3" style={{ fontWeight: 600 }}>Match details</h2>
              <ol className="divide-y divide-line">
                {matches.slice(0, 50).map((match, index) => (
                  <li key={index} className="py-3">
                    <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
                      <span className="text-ink-3 text-xs tabular-nums w-6">#{index + 1}</span>
                      <code className="font-mono text-[13px] text-ink break-all">{match.text === '' ? '(empty match)' : JSON.stringify(match.text)}</code>
                      <span className="text-xs text-ink-3">at index {match.index}</span>
                    </p>
                    {match.groups.length > 0 && (
                      <dl className="mt-2 ml-9 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
                        {match.groups.map((group, groupIndex) => {
                          const name = Object.keys(match.named).find((key) => match.named[key] === group && group !== null)
                          return (
                            <div key={groupIndex} className="contents">
                              <dt className="text-ink-3">
                                Group {groupIndex + 1}
                                {name && <span className="font-mono"> ({name})</span>}
                              </dt>
                              <dd className="font-mono text-ink-2 break-all">{group === null ? <span className="text-ink-4">undefined</span> : JSON.stringify(group)}</dd>
                            </div>
                          )
                        })}
                      </dl>
                    )}
                  </li>
                ))}
              </ol>
              {matches.length > 50 && (
                <p className="mt-3 text-xs text-ink-3" style={{ fontWeight: 400 }}>Showing the first 50 matches in this list.</p>
              )}
            </section>
          )}
        </>
      )}

      <details className="group bg-card border border-line rounded-2xl">
        <summary className="cursor-pointer list-none px-5 sm:px-6 py-4 text-sm text-ink-2 flex items-center justify-between rounded-2xl focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none">
          Syntax cheat sheet
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-ink-3 transition-transform group-open:rotate-180" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </summary>
        <dl className="px-5 sm:px-6 pb-6 grid grid-cols-1 sm:grid-cols-[14rem_1fr] gap-x-6 gap-y-2.5">
          {CHEAT_SHEET.map(([token, meaning]) => (
            <div key={token} className="contents">
              <dt className="font-mono text-[13px] text-ink">{token}</dt>
              <dd className="text-sm text-ink-2 mb-2 sm:mb-0" style={{ fontWeight: 400 }}>{meaning}</dd>
            </div>
          ))}
        </dl>
      </details>

      <p className="text-xs text-ink-3 leading-relaxed" style={{ fontWeight: 400 }}>
        Uses your browser’s JavaScript regex engine (ECMAScript), so results match what your JS code will do. Other
        languages differ in small ways, especially lookbehind, named groups and flags. Patterns run in a background
        worker and are stopped after 1.5 seconds, which protects the page from catastrophic backtracking.
      </p>
    </div>
  )
}
