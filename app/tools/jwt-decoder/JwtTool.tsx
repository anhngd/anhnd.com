'use client'

import { useState } from 'react'
import { CopyButton, Notice } from '@/app/components/tools/ui'
import { useNow } from '@/app/components/tools/useNow'
import { card, chip, field, label } from '@/app/components/tools/toolStyles'
import { decodeJwt, tokenStatus, type TokenStatus } from '@/lib/tools/jwt'
import { LOCAL_ZONE, formatInZone, relativeTime } from '@/lib/tools/time'

// The example token from jwt.io; its secret is public, so it is safe to show.
const SAMPLE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

const STATUS: Record<TokenStatus, { tone: 'success' | 'error' | 'warning' | 'info'; text: string }> = {
  valid: { tone: 'success', text: 'Not expired — the exp claim is still in the future.' },
  expired: { tone: 'error', text: 'Expired — the exp claim is in the past.' },
  'not-yet-valid': { tone: 'warning', text: 'Not valid yet — the nbf claim is in the future.' },
  'no-expiry': { tone: 'info', text: 'This token has no exp claim, so it never expires on its own.' },
}

function JsonBlock({ title, value }: { title: string; value: unknown }) {
  const text = JSON.stringify(value, null, 2)
  return (
    <section className={`${card} p-5`}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs uppercase tracking-wider text-ink-3" style={{ fontWeight: 600 }}>{title}</h2>
        <CopyButton text={text} variant="ghost" />
      </div>
      <pre className="overflow-x-auto font-mono text-[13px] leading-relaxed text-ink">{text}</pre>
    </section>
  )
}

export default function JwtTool() {
  const [input, setInput] = useState('')
  const now = useNow(15_000)

  const result = input.trim() ? decodeJwt(input) : null
  const token = result?.ok ? result.token : null

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="jwt-input" className={label} style={{ fontWeight: 500 }}>Token</label>
          <div className="flex gap-2">
            <button type="button" className={chip} onClick={() => setInput(SAMPLE)}>Sample</button>
            <button type="button" className={chip} onClick={() => setInput('')} disabled={!input}>Clear</button>
          </div>
        </div>
        <textarea
          id="jwt-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          spellCheck={false}
          placeholder="Paste a JWT (a “Bearer ” prefix is fine)"
          className={`${field} min-h-[8rem] resize-y break-all`}
          aria-invalid={result?.ok === false}
        />
      </div>

      {result && !result.ok && <Notice tone="error">{result.error}</Notice>}

      {token && (
        <>
          {now !== null && <Notice tone={STATUS[tokenStatus(token.claims, now)].tone}>{STATUS[tokenStatus(token.claims, now)].text}</Notice>}
          {token.algorithm?.toLowerCase() === 'none' && (
            <Notice tone="warning">
              The algorithm is <code className="font-mono">none</code>, so this token is unsigned. Never accept an
              unsigned token as proof of identity.
            </Notice>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <JsonBlock title={`Header${token.algorithm ? ` · ${token.algorithm}` : ''}`} value={token.header} />
            <JsonBlock title="Payload" value={token.payload} />
          </div>

          {token.claims.length > 0 && (
            <section className={`${card} p-5`} aria-labelledby="jwt-times">
              <h2 id="jwt-times" className="text-xs uppercase tracking-wider text-ink-3 mb-3" style={{ fontWeight: 600 }}>Time claims</h2>
              <dl className="divide-y divide-line">
                {token.claims.map((claim) => {
                  const date = new Date(claim.seconds * 1000)
                  return (
                    <div key={claim.name} className="py-2.5 grid grid-cols-1 sm:grid-cols-[9rem_1fr_auto] gap-x-4 gap-y-1 sm:items-baseline">
                      <dt className="text-sm text-ink-2" style={{ fontWeight: 500 }}>
                        {claim.label} <code className="font-mono text-xs text-ink-3">({claim.name})</code>
                      </dt>
                      <dd className="font-mono text-[13px] text-ink">{formatInZone(date, LOCAL_ZONE)}</dd>
                      <dd className="text-xs text-ink-3">{now === null ? '' : relativeTime(date, now)}</dd>
                    </div>
                  )
                })}
              </dl>
            </section>
          )}

          <section className={`${card} p-5`}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs uppercase tracking-wider text-ink-3" style={{ fontWeight: 600 }}>Signature</h2>
              <CopyButton text={token.signature} variant="ghost" />
            </div>
            <p className="font-mono text-[13px] leading-relaxed text-ink break-all">{token.signature || '(empty)'}</p>
            <p className="mt-3 text-xs text-ink-3 leading-relaxed" style={{ fontWeight: 400 }}>
              The signature is <strong style={{ fontWeight: 500 }}>not verified</strong>. Decoding only reads what the
              token claims; anyone can create a token with any contents. Verify signatures on your server with the
              issuer’s key.
            </p>
          </section>
        </>
      )}

      {!input && (
        <p className="text-sm text-ink-3 leading-relaxed" style={{ fontWeight: 400 }}>
          Paste a token to read its header, payload and expiry. Tokens are decoded locally and never uploaded, but treat
          live production tokens as secrets anyway.
        </p>
      )}
    </div>
  )
}
