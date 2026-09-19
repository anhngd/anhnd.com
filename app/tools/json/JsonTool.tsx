'use client'

import { useState } from 'react'
import { CopyButton, Notice, Segmented } from '@/app/components/tools/ui'
import { card, chip, field, label, readonlyField, secondaryButton, toggleChip } from '@/app/components/tools/toolStyles'
import { diffJson, formatJson, hasPrecisionRisk, parseJson, type DiffEntry, type JsonError } from '@/lib/tools/json'

type Mode = 'format' | 'diff'
type Indent = '2' | '4' | 'tab' | 'min'

const SAMPLE = '{"name":"Anh Nguyen","roles":["manager","founder"],"active":true,"score":9.5,"address":null,"links":{"site":"https://anhnd.com"}}'
const SAMPLE_A = '{"name":"Anh","roles":["manager"],"score":9,"active":true}'
const SAMPLE_B = '{"name":"Anh","roles":["manager","founder"],"score":9.5,"city":"Hanoi"}'

/** Shows the offending line with a caret under the error column. */
function ErrorFrame({ text, error }: { text: string; error: JsonError }) {
  const lineText = error.line > 0 ? (text.split('\n')[error.line - 1] ?? '') : ''
  const start = Math.max(0, error.column - 30)
  const shown = lineText.slice(start, start + 70)

  return (
    <Notice tone="error">
      <p style={{ fontWeight: 500 }}>
        {error.message}
        {error.line > 0 && ` — line ${error.line}, column ${error.column}`}
      </p>
      {error.line > 0 && (
        <pre className="mt-2 overflow-x-auto font-mono text-xs leading-relaxed text-ink">
          {shown}
          {'\n'}
          {' '.repeat(Math.max(0, error.column - 1 - start))}
          <span className="text-danger-ink">^</span>
        </pre>
      )}
    </Notice>
  )
}

function preview(value: unknown): string {
  const text = JSON.stringify(value) ?? 'undefined'
  return text.length > 90 ? `${text.slice(0, 90)}…` : text
}

const KIND_STYLE: Record<DiffEntry['kind'], { symbol: string; label: string; className: string }> = {
  added: { symbol: '+', label: 'Added', className: 'bg-ok-bg text-ok-ink' },
  removed: { symbol: '−', label: 'Removed', className: 'bg-danger-bg text-danger-ink' },
  changed: { symbol: '~', label: 'Changed', className: 'bg-warn-bg text-warn-ink' },
}

function FormatPanel() {
  const [input, setInput] = useState('')
  const [indent, setIndent] = useState<Indent>('2')
  const [sortKeys, setSortKeys] = useState(false)

  const parsed = input.trim() ? parseJson(input) : null
  const output = parsed?.ok
    ? formatJson(parsed.value, { indent: indent === 'min' ? 0 : indent === 'tab' ? 'tab' : (Number(indent) as 2 | 4), sortKeys })
    : ''

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          name="json-indent"
          legend="Indentation"
          value={indent}
          onChange={setIndent}
          options={[
            { value: '2', label: '2 spaces' },
            { value: '4', label: '4 spaces' },
            { value: 'tab', label: 'Tab' },
            { value: 'min', label: 'Minify' },
          ]}
        />
        <div>
          <input type="checkbox" id="json-sort" checked={sortKeys} onChange={(event) => setSortKeys(event.target.checked)} className="peer sr-only" />
          <label htmlFor="json-sort" className={toggleChip}>
            <span className="dot w-1.5 h-1.5 rounded-full bg-ink-4" aria-hidden="true" />
            Sort keys
          </label>
        </div>
        <div className="flex gap-2 ml-auto">
          <button type="button" className={chip} onClick={() => setInput(SAMPLE)}>Sample</button>
          <button type="button" className={chip} onClick={() => setInput('')} disabled={!input}>Clear</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center h-7 mb-2">
            <label htmlFor="json-input" className={label} style={{ fontWeight: 500 }}>Input</label>
          </div>
          <textarea
            id="json-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
            placeholder='Paste JSON here, e.g. {"hello": "world"}'
            className={`${field} min-h-[22rem] resize-y`}
            aria-invalid={parsed?.ok === false}
          />
        </div>

        <div>
          <div className="flex items-center justify-between h-7 mb-2">
            <label htmlFor="json-output" className={label} style={{ fontWeight: 500 }}>Output</label>
            <CopyButton text={output} variant="ghost" />
          </div>
          <textarea
            id="json-output"
            value={output}
            readOnly
            spellCheck={false}
            placeholder="Formatted JSON appears here"
            className={`${readonlyField} min-h-[22rem] resize-y`}
          />
        </div>
      </div>

      {parsed && !parsed.ok && <ErrorFrame text={input} error={parsed.error} />}
      {parsed?.ok && (
        <p className="text-xs text-ok-ink" style={{ fontWeight: 500 }} role="status">
          Valid JSON · {input.length.toLocaleString()} → {output.length.toLocaleString()} characters
        </p>
      )}
      {parsed?.ok && hasPrecisionRisk(input) && (
        <Notice tone="warning">
          This document has a number with more than 15 digits. JavaScript stores numbers as doubles, so it may lose
          precision here. Keep such values as strings if exact digits matter.
        </Notice>
      )}
    </div>
  )
}

function DiffPanel() {
  const [left, setLeft] = useState('')
  const [right, setRight] = useState('')

  const a = left.trim() ? parseJson(left) : null
  const b = right.trim() ? parseJson(right) : null
  const entries: DiffEntry[] | null = a?.ok && b?.ok ? diffJson(a.value, b.value) : null
  const count = (kind: DiffEntry['kind']) => entries?.filter((entry) => entry.kind === kind).length ?? 0

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-end">
        <button type="button" className={chip} onClick={() => { setLeft(SAMPLE_A); setRight(SAMPLE_B) }}>Sample</button>
        <button type="button" className={chip} onClick={() => { setLeft(right); setRight(left) }} disabled={!left && !right}>Swap</button>
        <button type="button" className={chip} onClick={() => { setLeft(''); setRight('') }} disabled={!left && !right}>Clear</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {(
          [
            { id: 'a', title: 'Original', value: left, set: setLeft, parsed: a },
            { id: 'b', title: 'Changed', value: right, set: setRight, parsed: b },
          ] as const
        ).map((side) => (
          <div key={side.id}>
            <label htmlFor={`json-diff-${side.id}`} className={`${label} block mb-2`} style={{ fontWeight: 500 }}>{side.title}</label>
            <textarea
              id={`json-diff-${side.id}`}
              value={side.value}
              onChange={(event) => side.set(event.target.value)}
              spellCheck={false}
              placeholder="Paste JSON"
              className={`${field} min-h-[14rem] resize-y`}
              aria-invalid={side.parsed?.ok === false}
            />
            {side.parsed && !side.parsed.ok && (
              <div className="mt-2"><ErrorFrame text={side.value} error={side.parsed.error} /></div>
            )}
          </div>
        ))}
      </div>

      {entries && (
        <div className={`${card} p-5 sm:p-6`} aria-live="polite">
          {entries.length === 0 ? (
            <p className="text-sm text-ok-ink" style={{ fontWeight: 500 }}>No differences — the two documents are identical.</p>
          ) : (
            <>
              <p className="text-sm text-ink-2 mb-4" style={{ fontWeight: 500 }}>
                {entries.length} {entries.length === 1 ? 'difference' : 'differences'}
                <span className="text-ink-3" style={{ fontWeight: 400 }}>
                  {' '}· {count('added')} added · {count('removed')} removed · {count('changed')} changed
                </span>
              </p>
              <ul className="divide-y divide-line">
                {entries.map((entry) => {
                  const style = KIND_STYLE[entry.kind]
                  return (
                    <li key={`${entry.kind}-${entry.path}`} className="py-3 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                      <span className={`shrink-0 self-start w-[5.5rem] text-center px-2 py-0.5 text-[11px] rounded-full ${style.className}`} style={{ fontWeight: 500 }}>
                        {style.symbol} {style.label}
                      </span>
                      <code className="font-mono text-[13px] text-ink break-all sm:w-52 shrink-0">{entry.path}</code>
                      <span className="font-mono text-xs text-ink-2 break-all">
                        {entry.kind !== 'added' && <span className="text-danger-ink">{preview(entry.before)}</span>}
                        {entry.kind === 'changed' && <span className="text-ink-3"> → </span>}
                        {entry.kind !== 'removed' && <span className="text-ok-ink">{preview(entry.after)}</span>}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </>
          )}
          <p className="mt-4 text-xs text-ink-3" style={{ fontWeight: 400 }}>
            Arrays are compared by position, so inserting an item near the start shows every later item as changed.
          </p>
        </div>
      )}

      {!entries && !a && !b && (
        <button type="button" onClick={() => { setLeft(SAMPLE_A); setRight(SAMPLE_B) }} className={secondaryButton}>
          Try a sample comparison
        </button>
      )}
    </div>
  )
}

export default function JsonTool() {
  const [mode, setMode] = useState<Mode>('format')

  return (
    <div className="space-y-6">
      <Segmented
        name="json-mode"
        legend="Mode"
        value={mode}
        onChange={setMode}
        options={[
          { value: 'format', label: 'Format & validate' },
          { value: 'diff', label: 'Compare' },
        ]}
      />
      {mode === 'format' ? <FormatPanel /> : <DiffPanel />}
    </div>
  )
}
