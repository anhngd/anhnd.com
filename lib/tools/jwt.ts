// Decodes (does NOT verify) JSON Web Tokens.

export interface Claim {
  name: 'exp' | 'iat' | 'nbf'
  label: string
  seconds: number
  iso: string
}

export type TokenStatus = 'valid' | 'expired' | 'not-yet-valid' | 'no-expiry'

export interface DecodedJwt {
  header: unknown
  payload: unknown
  signature: string
  algorithm: string | null
  claims: Claim[]
}

export type DecodeResult = { ok: true; token: DecodedJwt } | { ok: false; error: string }

function decodeSegment(segment: string, label: string): unknown {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/')
  if (!/^[A-Za-z0-9+/]*$/.test(base64) || base64.length % 4 === 1) {
    throw new Error(`The ${label} is not valid Base64URL.`)
  }

  let text: string
  try {
    const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='))
    text = new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)))
  } catch {
    throw new Error(`The ${label} is not valid UTF-8 text.`)
  }

  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`The ${label} is not valid JSON.`)
  }
}

const CLAIM_LABELS: Record<Claim['name'], string> = {
  exp: 'Expires',
  iat: 'Issued at',
  nbf: 'Not valid before',
}

export function decodeJwt(input: string): DecodeResult {
  const token = input.trim().replace(/^Bearer\s+/i, '')
  const parts = token.split('.')

  if (parts.length !== 3) {
    return { ok: false, error: `A JWT has 3 dot-separated parts, but this has ${parts.length}.` }
  }

  try {
    const header = decodeSegment(parts[0], 'header')
    const payload = decodeSegment(parts[1], 'payload')
    const algorithm =
      header && typeof header === 'object' && typeof (header as Record<string, unknown>).alg === 'string'
        ? ((header as Record<string, unknown>).alg as string)
        : null

    const claims: Claim[] = []
    if (payload && typeof payload === 'object') {
      for (const name of ['iat', 'nbf', 'exp'] as const) {
        const value = (payload as Record<string, unknown>)[name]
        if (typeof value === 'number' && Number.isFinite(value)) {
          const date = new Date(value * 1000)
          if (!Number.isNaN(date.getTime())) {
            claims.push({ name, label: CLAIM_LABELS[name], seconds: value, iso: date.toISOString() })
          }
        }
      }
    }

    return { ok: true, token: { header, payload, signature: parts[2], algorithm, claims } }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Could not decode the token.' }
  }
}

export function tokenStatus(claims: Claim[], nowMs: number): TokenStatus {
  const nowSeconds = nowMs / 1000
  const exp = claims.find((claim) => claim.name === 'exp')
  const nbf = claims.find((claim) => claim.name === 'nbf')

  if (exp && nowSeconds >= exp.seconds) return 'expired'
  if (nbf && nowSeconds < nbf.seconds) return 'not-yet-valid'
  return exp ? 'valid' : 'no-expiry'
}
