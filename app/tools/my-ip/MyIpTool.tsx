'use client'

import { useEffect, useRef, useState } from 'react'
import { CopyButton, Notice } from '@/app/components/tools/ui'
import { useNow } from '@/app/components/tools/useNow'
import { card, chip, field, primaryButton } from '@/app/components/tools/toolStyles'
import { classifyIp, formatCoordinates, ipVersion, parseIpInfo, type IpClass, type IpInfo } from '@/lib/tools/ip'
import { formatInZone } from '@/lib/tools/time'

type Remote<T> = { status: 'loading' } | { status: 'ok'; value: T } | { status: 'error'; message: string }

const V4_URL = 'https://api.ipify.org?format=json'
const V6_URL = 'https://api6.ipify.org?format=json'
const DETAILS_URL = 'https://ipwho.is/'

async function getJson(url: string, timeoutMs = 8000): Promise<unknown> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeoutMs)
  try {
    // No cookies and no referrer: the service learns the IP it is asked about and nothing else.
    const response = await fetch(url, { signal: controller.signal, cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer' })
    if (!response.ok) throw new Error(`The service answered with HTTP ${response.status}.`)
    return await response.json()
  } finally {
    window.clearTimeout(timer)
  }
}

function readIp(data: unknown): string {
  const ip = data && typeof data === 'object' ? (data as Record<string, unknown>).ip : undefined
  if (typeof ip !== 'string' || !ipVersion(ip)) throw new Error('The service sent an unexpected response.')
  return ip
}

function describeError(error: unknown): string {
  if (error instanceof DOMException && error.name === 'AbortError') return 'The request timed out.'
  if (error instanceof TypeError) return 'Couldn’t reach the service. A network filter or ad blocker may be blocking it.'
  return error instanceof Error ? error.message : 'Something went wrong.'
}

async function fetchInfo(ip?: string): Promise<IpInfo> {
  const result = parseIpInfo(await getJson(ip ? `${DETAILS_URL}${encodeURIComponent(ip)}` : DETAILS_URL))
  if (!result.ok) throw new Error(result.error)
  return result.info
}

interface BrowserInfo {
  browser: string
  platform: string
  languages: string
  timeZone: string
  screen: string
  connection: string | null
  online: boolean
}

function readBrowser(): BrowserInfo {
  const nav = navigator as Navigator & {
    userAgentData?: { platform?: string; brands?: { brand: string; version: string }[] }
    connection?: { effectiveType?: string; downlink?: number; rtt?: number }
  }
  const brands = nav.userAgentData?.brands?.filter((item) => !/not.?a.?brand/i.test(item.brand)) ?? []
  const connection = nav.connection

  return {
    browser: brands.length ? brands.map((item) => `${item.brand} ${item.version}`).join(', ') : nav.userAgent,
    platform: nav.userAgentData?.platform || nav.platform || 'Unknown',
    languages: nav.languages?.join(', ') || nav.language,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screen: `${window.screen.width} × ${window.screen.height} at ${window.devicePixelRatio}x`,
    connection: connection
      ? [connection.effectiveType, connection.downlink !== undefined ? `${connection.downlink} Mbps` : null, connection.rtt !== undefined ? `${connection.rtt} ms round trip` : null]
          .filter(Boolean)
          .join(' · ')
      : null,
    online: nav.onLine,
  }
}

function Row({ name, children, copy }: { name: string; children: React.ReactNode; copy?: string }) {
  return (
    <div className="py-3 grid grid-cols-1 sm:grid-cols-[9rem_1fr_auto] gap-x-4 gap-y-1 sm:items-baseline">
      <dt className="text-xs text-ink-3">{name}</dt>
      <dd className="text-sm text-ink break-words min-w-0">{children}</dd>
      <div className="min-h-0">{copy && <CopyButton text={copy} variant="ghost" />}</div>
    </div>
  )
}

function InfoTable({ info, now }: { info: IpInfo; now: number | null }) {
  // Cities like Hanoi are also their own region; don't print the name twice.
  const place = [...new Set([info.city, info.region, info.country].filter(Boolean))].join(', ')
  let localTime: string | null = null
  if (info.timezone && now !== null) {
    try {
      localTime = formatInZone(new Date(now), info.timezone.id)
    } catch {
      localTime = null // The service sent a zone name this browser doesn't know.
    }
  }

  return (
    <dl className="divide-y divide-line">
      <Row name="IP address" copy={info.ip}>
        <span className="font-mono text-[13px]">{info.ip}</span>
        {info.version && <span className="ml-2 text-xs text-ink-3">IPv{info.version}</span>}
      </Row>
      {place && (
        <Row name="Location">
          {info.flag && <span className="mr-1.5" aria-hidden="true">{info.flag}</span>}
          {place}
          {info.postal && <span className="text-ink-3"> · {info.postal}</span>}
        </Row>
      )}
      {info.latitude !== undefined && info.longitude !== undefined && (
        <Row name="Coordinates">
          <span className="font-mono text-[13px]">{formatCoordinates(info.latitude, info.longitude)}</span>
          <a
            href={`https://www.openstreetmap.org/?mlat=${info.latitude}&mlon=${info.longitude}#map=10/${info.latitude}/${info.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 text-xs text-ink-3 underline underline-offset-2 hover:text-brand-ink transition-colors"
          >
            View on map
          </a>
        </Row>
      )}
      {info.isp && <Row name="ISP">{info.isp}</Row>}
      {info.organization && info.organization !== info.isp && <Row name="Organization">{info.organization}</Row>}
      {info.asn !== undefined && <Row name="ASN"><span className="font-mono text-[13px]">AS{info.asn}</span>{info.domain && <span className="text-ink-3"> · {info.domain}</span>}</Row>}
      {info.timezone && (
        <Row name="Time zone">
          {info.timezone.id}
          <span className="text-ink-3">
            {' '}
            {[info.timezone.abbreviation, info.timezone.utc && `UTC${info.timezone.utc}`].filter(Boolean).join(' · ')}
          </span>
          {localTime && <span className="block text-xs text-ink-3 mt-0.5">Now there: {localTime}</span>}
        </Row>
      )}
    </dl>
  )
}

const SAMPLES = ['8.8.8.8', '1.1.1.1', '2606:4700:4700::1111']

type Lookup =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'invalid' }
  | { status: 'local'; ip: string; ipClass: IpClass }
  | { status: 'ok'; info: IpInfo }
  | { status: 'error'; message: string }

export default function MyIpTool() {
  const now = useNow(30_000)
  const [attempt, setAttempt] = useState(0)
  const [v4, setV4] = useState<Remote<string>>({ status: 'loading' })
  const [v6, setV6] = useState<Remote<string>>({ status: 'loading' })
  const [details, setDetails] = useState<Remote<IpInfo>>({ status: 'loading' })
  const [browser, setBrowser] = useState<BrowserInfo | null>(null)
  const [query, setQuery] = useState('')
  const [lookup, setLookup] = useState<Lookup>({ status: 'idle' })
  const lookupId = useRef(0)

  useEffect(() => {
    let cancelled = false
    const track = <T,>(promise: Promise<T>, set: (state: Remote<T>) => void) => {
      promise
        .then((value) => !cancelled && set({ status: 'ok', value }))
        .catch((error) => !cancelled && set({ status: 'error', message: describeError(error) }))
    }

    track(getJson(V4_URL).then(readIp), setV4)
    track(getJson(V6_URL).then(readIp), setV6)
    track(fetchInfo(), setDetails)

    return () => {
      cancelled = true
    }
  }, [attempt])

  // Browser details are read after mount so the first render matches the static HTML.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setBrowser(readBrowser()))
    return () => cancelAnimationFrame(frame)
  }, [])

  function refresh() {
    setV4({ status: 'loading' })
    setV6({ status: 'loading' })
    setDetails({ status: 'loading' })
    setAttempt((value) => value + 1)
  }

  async function runLookup(input: string) {
    const ip = input.trim()
    const id = ++lookupId.current
    setQuery(input)

    if (!ipVersion(ip)) return setLookup({ status: 'invalid' })

    const ipClass = classifyIp(ip)
    // Private and reserved addresses can't be located, so there is nothing to ask the service.
    if (ipClass && !ipClass.routable) return setLookup({ status: 'local', ip, ipClass })

    setLookup({ status: 'loading' })
    try {
      const info = await fetchInfo(ip)
      if (id === lookupId.current) setLookup({ status: 'ok', info })
    } catch (error) {
      if (id === lookupId.current) setLookup({ status: 'error', message: describeError(error) })
    }
  }

  const primary = v4.status === 'ok' ? v4.value : v6.status === 'ok' ? v6.value : null
  const settled = v4.status !== 'loading' && v6.status !== 'loading'
  const failed = settled && !primary
  const ipRow = (version: string, state: Remote<string>) => (
    <div className="py-3 flex items-center justify-between gap-3">
      <dt className="text-xs text-ink-3 w-14 shrink-0">{version}</dt>
      <dd className="font-mono text-[13px] text-ink break-all flex-1">
        {state.status === 'loading' && <span className="text-ink-4">Looking up…</span>}
        {state.status === 'ok' && state.value}
        {state.status === 'error' && (
          <span className="text-ink-3 font-sans text-sm" style={{ fontWeight: 400 }}>
            {version === 'IPv6' ? 'No IPv6 address detected' : 'Not available'}
          </span>
        )}
      </dd>
      {state.status === 'ok' && <CopyButton text={state.value} variant="ghost" />}
    </div>
  )

  return (
    <div className="space-y-5">
      {/* Public IP */}
      <section className={`${card} p-5 sm:p-7`} aria-labelledby="ip-public" aria-live="polite">
        <div className="flex items-start justify-between gap-3 mb-4">
          <h2 id="ip-public" className="text-xs uppercase tracking-wider text-ink-3" style={{ fontWeight: 600 }}>Your public IP</h2>
          <button type="button" onClick={refresh} className={chip}>Refresh</button>
        </div>

        <p className="font-mono text-2xl sm:text-4xl text-ink break-all leading-tight min-h-[2.5rem]">
          {primary ?? (failed ? '—' : <span className="text-ink-4">Looking up…</span>)}
        </p>
        {primary && (
          <div className="mt-4">
            <CopyButton text={primary} variant="primary" label="Copy IP" />
          </div>
        )}

        {failed && (
          <div className="mt-4">
            <Notice tone="error">
              {v4.status === 'error' ? v4.message : 'Couldn’t determine your IP address.'}
              {' '}<button type="button" onClick={refresh} className="underline underline-offset-2">Try again</button>
            </Notice>
          </div>
        )}

        <dl className="mt-5 pt-2 border-t border-line divide-y divide-line">
          {ipRow('IPv4', v4)}
          {ipRow('IPv6', v6)}
        </dl>
      </section>

      {/* Location and network */}
      <section className={`${card} p-5 sm:p-7`} aria-labelledby="ip-details">
        <h2 id="ip-details" className="text-xs uppercase tracking-wider text-ink-3 mb-2" style={{ fontWeight: 600 }}>Location & network</h2>
        {details.status === 'loading' && <p className="py-3 text-sm text-ink-4">Looking up…</p>}
        {details.status === 'error' && <p className="py-3 text-sm text-ink-3" style={{ fontWeight: 400 }}>{details.message}</p>}
        {details.status === 'ok' && (
          <>
            <InfoTable info={details.value} now={now} />
            <p className="mt-3 text-xs text-ink-3 leading-relaxed" style={{ fontWeight: 400 }}>
              Location comes from an IP database and is usually only right to the city or region. VPNs, proxies, company
              networks and mobile carriers often show a different place from where you are.
            </p>
          </>
        )}
      </section>

      {/* Lookup */}
      <section className={`${card} p-5 sm:p-7`} aria-labelledby="ip-lookup">
        <h2 id="ip-lookup" className="text-xs uppercase tracking-wider text-ink-3 mb-4" style={{ fontWeight: 600 }}>Look up any IP</h2>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            void runLookup(query)
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <label htmlFor="ip-query" className="sr-only">IP address to look up</label>
          <input
            id="ip-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            spellCheck={false}
            autoComplete="off"
            inputMode="text"
            placeholder="8.8.8.8 or 2001:4860:4860::8888"
            className={field}
            aria-invalid={lookup.status === 'invalid'}
          />
          <button type="submit" className={`${primaryButton} whitespace-nowrap`} disabled={!query.trim() || lookup.status === 'loading'}>
            {lookup.status === 'loading' ? 'Looking up…' : 'Look up'}
          </button>
        </form>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-xs text-ink-4">Try</span>
          {SAMPLES.map((sample) => (
            <button key={sample} type="button" className={`${chip} font-mono`} onClick={() => void runLookup(sample)}>{sample}</button>
          ))}
        </div>

        <div className="mt-5" aria-live="polite">
          {lookup.status === 'invalid' && <Notice tone="error">That isn’t a valid IPv4 or IPv6 address.</Notice>}
          {lookup.status === 'error' && <Notice tone="error">{lookup.message}</Notice>}
          {lookup.status === 'local' && (
            <Notice tone="info">
              <span className="font-mono">{lookup.ip}</span> — {lookup.ipClass.label}. It can’t be seen from the internet,
              so it has no public location or ISP to look up.
            </Notice>
          )}
          {lookup.status === 'ok' && <InfoTable info={lookup.info} now={now} />}
        </div>
      </section>

      {/* Browser */}
      <section className={`${card} p-5 sm:p-7`} aria-labelledby="ip-browser">
        <h2 id="ip-browser" className="text-xs uppercase tracking-wider text-ink-3 mb-1" style={{ fontWeight: 600 }}>Your browser</h2>
        <p className="text-xs text-ink-3 mb-2" style={{ fontWeight: 400 }}>
          Read locally from your browser. Sites you visit can usually see this too; none of it is sent from here.
        </p>
        {browser ? (
          <dl className="divide-y divide-line">
            <Row name="Browser">{browser.browser}</Row>
            <Row name="Platform">{browser.platform}</Row>
            <Row name="Languages">{browser.languages}</Row>
            <Row name="Time zone">{browser.timeZone}</Row>
            <Row name="Screen">{browser.screen}</Row>
            {browser.connection && <Row name="Connection">{browser.connection}</Row>}
            <Row name="Online">{browser.online ? 'Yes' : 'No'}</Row>
          </dl>
        ) : (
          <p className="py-3 text-sm text-ink-4">Reading…</p>
        )}
      </section>
    </div>
  )
}
