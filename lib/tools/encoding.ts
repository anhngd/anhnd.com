// Base64 and URL encoding helpers that are safe for non-ASCII text.

export type Result = { ok: true; value: string } | { ok: false; error: string }

function bytesToBinary(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  }
  return binary
}

export function base64Encode(text: string, urlSafe: boolean): string {
  const encoded = btoa(bytesToBinary(new TextEncoder().encode(text)))
  return urlSafe ? encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') : encoded
}

export function base64Decode(input: string): Result {
  // Accept both alphabets, and input with or without padding or line breaks.
  const cleaned = input.replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/')
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleaned)) {
    return { ok: false, error: 'Contains characters that are not valid Base64.' }
  }
  if (cleaned.replace(/=+$/, '').length % 4 === 1) {
    return { ok: false, error: 'Length is not valid for Base64 (a character is missing).' }
  }

  try {
    const binary = atob(cleaned.padEnd(Math.ceil(cleaned.length / 4) * 4, '='))
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    return { ok: true, value: new TextDecoder('utf-8', { fatal: true }).decode(bytes) }
  } catch {
    return { ok: false, error: 'Decoded bytes are not valid UTF-8 text (it may be binary data).' }
  }
}

export type UrlMode = 'component' | 'full'

export function urlEncode(text: string, mode: UrlMode): Result {
  try {
    return { ok: true, value: mode === 'component' ? encodeURIComponent(text) : encodeURI(text) }
  } catch {
    return { ok: false, error: 'Contains an unpaired surrogate and cannot be encoded.' }
  }
}

export function urlDecode(text: string, plusAsSpace: boolean): Result {
  try {
    return { ok: true, value: decodeURIComponent(plusAsSpace ? text.replace(/\+/g, ' ') : text) }
  } catch {
    return { ok: false, error: 'Contains a malformed percent sequence such as a lone "%".' }
  }
}
