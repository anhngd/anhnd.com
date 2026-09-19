// IP address validation, classification and lookup-response parsing.

export type IpVersion = 4 | 6

function parseIpv4(text: string): number[] | null {
  const parts = text.split('.')
  if (parts.length !== 4) return null

  const octets = parts.map((part) => (/^(0|[1-9]\d{0,2})$/.test(part) ? Number(part) : NaN))
  return octets.every((octet) => octet >= 0 && octet <= 255) ? octets : null
}

/** Expands an IPv6 address to its eight 16-bit groups, or null if it isn't valid. */
function parseIpv6(text: string): number[] | null {
  if (!text.includes(':') || /[^0-9a-fA-F:.]/.test(text)) return null

  let address = text
  // A trailing dotted quad (::ffff:1.2.3.4) stands for the last two groups.
  const lastColon = address.lastIndexOf(':')
  if (address.slice(lastColon + 1).includes('.')) {
    const v4 = parseIpv4(address.slice(lastColon + 1))
    if (!v4) return null
    address = `${address.slice(0, lastColon + 1)}${((v4[0] << 8) | v4[1]).toString(16)}:${((v4[2] << 8) | v4[3]).toString(16)}`
  }

  const halves = address.split('::')
  if (halves.length > 2) return null

  const toGroups = (part: string) => (part === '' ? [] : part.split(':'))
  const head = toGroups(halves[0])
  const tail = halves.length === 2 ? toGroups(halves[1]) : []
  const missing = 8 - head.length - tail.length

  if (halves.length === 1 ? missing !== 0 : missing < 1) return null

  const groups = [...head, ...Array(halves.length === 2 ? missing : 0).fill('0'), ...tail]
  if (groups.length !== 8 || !groups.every((group) => /^[0-9a-fA-F]{1,4}$/.test(group))) return null
  return groups.map((group) => parseInt(group, 16))
}

export function ipVersion(input: string): IpVersion | null {
  const text = input.trim()
  if (parseIpv4(text)) return 4
  if (parseIpv6(text)) return 6
  return null
}

export type IpScope = 'public' | 'private' | 'shared' | 'loopback' | 'link-local' | 'multicast' | 'unspecified' | 'reserved'

export interface IpClass {
  scope: IpScope
  label: string
  /** Whether the address can be seen on the public internet, and so be looked up. */
  routable: boolean
}

const PUBLIC: IpClass = { scope: 'public', label: 'Public address', routable: true }

function classifyIpv4([a, b, c]: number[]): IpClass {
  if (a === 0) return { scope: 'unspecified', label: '“This network” (0.0.0.0/8)', routable: false }
  if (a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)) {
    return { scope: 'private', label: 'Private address (only valid inside a local network)', routable: false }
  }
  if (a === 100 && b >= 64 && b <= 127) {
    return { scope: 'shared', label: 'Shared address space (carrier-grade NAT, 100.64.0.0/10)', routable: false }
  }
  if (a === 127) return { scope: 'loopback', label: 'Loopback (this device)', routable: false }
  if (a === 169 && b === 254) return { scope: 'link-local', label: 'Link-local (self-assigned)', routable: false }
  if (a >= 224 && a <= 239) return { scope: 'multicast', label: 'Multicast', routable: false }
  if (
    a >= 240 ||
    (a === 192 && b === 0 && c === 2) ||
    (a === 198 && b === 51 && c === 100) ||
    (a === 203 && b === 0 && c === 113) ||
    (a === 198 && (b === 18 || b === 19))
  ) {
    return { scope: 'reserved', label: 'Reserved (documentation, testing or future use)', routable: false }
  }
  return PUBLIC
}

function classifyIpv6(groups: number[]): IpClass {
  const [first] = groups
  if (groups.every((group) => group === 0)) return { scope: 'unspecified', label: 'Unspecified address (::)', routable: false }
  if (groups.slice(0, 7).every((group) => group === 0) && groups[7] === 1) {
    return { scope: 'loopback', label: 'Loopback (this device)', routable: false }
  }
  // IPv4-mapped (::ffff:a.b.c.d) is judged by the IPv4 address inside it.
  if (groups.slice(0, 5).every((group) => group === 0) && groups[5] === 0xffff) {
    return classifyIpv4([groups[6] >> 8, groups[6] & 255, groups[7] >> 8, groups[7] & 255])
  }
  if ((first & 0xffc0) === 0xfe80) return { scope: 'link-local', label: 'Link-local (self-assigned)', routable: false }
  if ((first & 0xfe00) === 0xfc00) {
    return { scope: 'private', label: 'Unique local address (only valid inside a local network)', routable: false }
  }
  if ((first & 0xff00) === 0xff00) return { scope: 'multicast', label: 'Multicast', routable: false }
  if (first === 0x2001 && groups[1] === 0x0db8) {
    return { scope: 'reserved', label: 'Reserved for documentation (2001:db8::/32)', routable: false }
  }
  return PUBLIC
}

export function classifyIp(input: string): IpClass | null {
  const text = input.trim()
  const v4 = parseIpv4(text)
  if (v4) return classifyIpv4(v4)
  const v6 = parseIpv6(text)
  return v6 ? classifyIpv6(v6) : null
}

// ---------------------------------------------------------------------------
// ipwho.is response
// ---------------------------------------------------------------------------

export interface IpInfo {
  ip: string
  version: IpVersion | null
  country?: string
  countryCode?: string
  flag?: string
  region?: string
  city?: string
  postal?: string
  latitude?: number
  longitude?: number
  isp?: string
  organization?: string
  asn?: number
  domain?: string
  timezone?: { id: string; abbreviation?: string; utc?: string }
}

export type IpInfoResult = { ok: true; info: IpInfo } | { ok: false; error: string }

const text = (value: unknown): string | undefined => (typeof value === 'string' && value.trim() ? value : undefined)
const num = (value: unknown): number | undefined => (typeof value === 'number' && Number.isFinite(value) ? value : undefined)

export function parseIpInfo(data: unknown): IpInfoResult {
  if (!data || typeof data !== 'object') return { ok: false, error: 'The lookup service sent an unexpected response.' }
  const body = data as Record<string, unknown>

  if (body.success === false) {
    return { ok: false, error: text(body.message) ?? 'The lookup service could not find that address.' }
  }
  const ip = text(body.ip)
  if (!ip) return { ok: false, error: 'The lookup service sent an unexpected response.' }

  const connection = (body.connection ?? {}) as Record<string, unknown>
  const flag = (body.flag ?? {}) as Record<string, unknown>
  const timezone = (body.timezone ?? {}) as Record<string, unknown>
  const timezoneId = text(timezone.id)

  return {
    ok: true,
    info: {
      ip,
      version: ipVersion(ip),
      country: text(body.country),
      countryCode: text(body.country_code),
      flag: text(flag.emoji),
      region: text(body.region),
      city: text(body.city),
      postal: text(body.postal),
      latitude: num(body.latitude),
      longitude: num(body.longitude),
      isp: text(connection.isp),
      organization: text(connection.org),
      asn: num(connection.asn),
      domain: text(connection.domain),
      timezone: timezoneId ? { id: timezoneId, abbreviation: text(timezone.abbr), utc: text(timezone.utc) } : undefined,
    },
  }
}

export function formatCoordinates(latitude: number, longitude: number): string {
  return `${Math.abs(latitude).toFixed(3)}° ${latitude >= 0 ? 'N' : 'S'}, ${Math.abs(longitude).toFixed(3)}° ${longitude >= 0 ? 'E' : 'W'}`
}
