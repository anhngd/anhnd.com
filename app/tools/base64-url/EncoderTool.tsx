'use client'

import { useState } from 'react'
import { CopyButton, Notice, Segmented } from '@/app/components/tools/ui'
import { chip, field, label, readonlyField, toggleChip } from '@/app/components/tools/toolStyles'
import { base64Decode, base64Encode, urlDecode, urlEncode, type Result, type UrlMode } from '@/lib/tools/encoding'

type Kind = 'base64' | 'url'
type Direction = 'encode' | 'decode'

const SAMPLES: Record<Kind, Record<Direction, string>> = {
  base64: { encode: 'Xin chào, Việt Nam! 🇻🇳', decode: 'WGluIGNow6BvLCBWaeG7h3QgTmFtISDwn4e78J+Hsw==' },
  url: { encode: 'https://example.com/search?q=café & bar&lang=vi', decode: 'q%3Dcaf%C3%A9%20%26%20bar' },
}

export default function EncoderTool() {
  const [kind, setKind] = useState<Kind>('base64')
  const [direction, setDirection] = useState<Direction>('encode')
  const [input, setInput] = useState('')
  const [urlSafe, setUrlSafe] = useState(false)
  const [urlMode, setUrlMode] = useState<UrlMode>('component')
  const [plusAsSpace, setPlusAsSpace] = useState(false)

  let result: Result = { ok: true, value: '' }
  if (input) {
    if (kind === 'base64') {
      result = direction === 'encode' ? { ok: true, value: base64Encode(input, urlSafe) } : base64Decode(input)
    } else {
      result = direction === 'encode' ? urlEncode(input, urlMode) : urlDecode(input, plusAsSpace)
    }
  }
  const output = result.ok ? result.value : ''

  const swap = () => {
    if (!output) return
    setInput(output)
    setDirection(direction === 'encode' ? 'decode' : 'encode')
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          name="enc-kind"
          legend="Format"
          value={kind}
          onChange={setKind}
          options={[
            { value: 'base64', label: 'Base64' },
            { value: 'url', label: 'URL' },
          ]}
        />
        <Segmented
          name="enc-direction"
          legend="Direction"
          value={direction}
          onChange={setDirection}
          options={[
            { value: 'encode', label: 'Encode' },
            { value: 'decode', label: 'Decode' },
          ]}
        />

        {kind === 'base64' && direction === 'encode' && (
          <div>
            <input type="checkbox" id="enc-urlsafe" checked={urlSafe} onChange={(event) => setUrlSafe(event.target.checked)} className="peer sr-only" />
            <label htmlFor="enc-urlsafe" className={toggleChip} title="Uses - and _ instead of + and /, and drops the = padding">
              <span className="dot w-1.5 h-1.5 rounded-full bg-ink-4" aria-hidden="true" />
              URL-safe alphabet
            </label>
          </div>
        )}
        {kind === 'url' && direction === 'encode' && (
          <Segmented
            name="enc-urlmode"
            legend="What to encode"
            value={urlMode}
            onChange={setUrlMode}
            options={[
              { value: 'component', label: 'Component' },
              { value: 'full', label: 'Full URL' },
            ]}
          />
        )}
        {kind === 'url' && direction === 'decode' && (
          <div>
            <input type="checkbox" id="enc-plus" checked={plusAsSpace} onChange={(event) => setPlusAsSpace(event.target.checked)} className="peer sr-only" />
            <label htmlFor="enc-plus" className={toggleChip} title="Form-encoded data writes spaces as +">
              <span className="dot w-1.5 h-1.5 rounded-full bg-ink-4" aria-hidden="true" />
              Treat + as space
            </label>
          </div>
        )}

        <div className="flex gap-2 ml-auto">
          <button type="button" className={chip} onClick={() => setInput(SAMPLES[kind][direction])}>Sample</button>
          <button type="button" className={chip} onClick={swap} disabled={!output} title="Move the output into the input and flip direction">
            Swap ⇄
          </button>
          <button type="button" className={chip} onClick={() => setInput('')} disabled={!input}>Clear</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center h-7 mb-2">
            <label htmlFor="enc-input" className={label} style={{ fontWeight: 500 }}>
              {direction === 'encode' ? 'Text' : kind === 'base64' ? 'Base64' : 'Encoded text'}
            </label>
          </div>
          <textarea
            id="enc-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
            placeholder={direction === 'encode' ? 'Type or paste text' : 'Paste the encoded text'}
            className={`${field} min-h-[16rem] resize-y`}
            aria-invalid={!result.ok}
          />
          <p className="mt-1.5 text-xs text-ink-3" style={{ fontWeight: 400 }}>{input.length.toLocaleString()} characters</p>
        </div>

        <div>
          <div className="flex items-center justify-between h-7 mb-2">
            <label htmlFor="enc-output" className={label} style={{ fontWeight: 500 }}>
              {direction === 'encode' ? (kind === 'base64' ? 'Base64' : 'Encoded') : 'Text'}
            </label>
            <CopyButton text={output} variant="ghost" />
          </div>
          <textarea
            id="enc-output"
            value={output}
            readOnly
            spellCheck={false}
            placeholder="Result appears here"
            className={`${readonlyField} min-h-[16rem] resize-y`}
          />
          <p className="mt-1.5 text-xs text-ink-3" style={{ fontWeight: 400 }}>{output.length.toLocaleString()} characters</p>
        </div>
      </div>

      {!result.ok && <Notice tone="error">{result.error}</Notice>}

      <p className="text-xs text-ink-3 leading-relaxed" style={{ fontWeight: 400 }}>
        {kind === 'base64'
          ? 'Text is converted as UTF-8 first, so accents, emoji and non-Latin scripts round-trip correctly. Decoding accepts both the standard and URL-safe alphabets, with or without padding.'
          : 'Component encoding escapes everything except letters, digits and - _ . ! ~ * \' ( ) — use it for a single query value. Full URL keeps the separators (: / ? # & =) intact.'}
      </p>
    </div>
  )
}
