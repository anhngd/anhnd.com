// Platform-aware password generation, rule checking and strength grading.
// Pure logic (no React, no DOM) so it can be exercised from a plain Node script.

export type CharClass = 'lower' | 'upper' | 'digit' | 'symbol'

export type PlatformCategory = 'Universal' | 'Accounts' | 'Social' | 'Shopping & Media' | 'Developer & Network'

/**
 * How much we trust the rules of a preset:
 * - official: taken from the platform's own documentation.
 * - typical: the platform only publishes recommendations; limits are the common enforced ones.
 * - guidance: our own recommendation for a use case with no platform-specific rules.
 */
export type RuleBasis = 'official' | 'typical' | 'guidance'

export interface PlatformPolicy {
  id: string
  name: string
  category: PlatformCategory
  basis: RuleBasis
  sourceUrl?: string
  minLength: number
  maxLength: number
  /** Length used by default. Above the platform minimum whenever the maximum allows it. */
  recommendedLength: number
  /** Character classes that must each appear at least once. */
  required: CharClass[]
  /** Symbols we may use for this platform. Empty string means "no symbols". */
  symbols: string
  /** Longest run of the same character the platform tolerates. */
  maxRepeat?: number
  /** Rules we cannot verify from the password alone, shown as guidance. */
  notes: string[]
}

export interface GeneratorOptions {
  length: number
  includeSymbols: boolean
  avoidAmbiguous: boolean
}

const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const DIGITS = '0123456789'
const AMBIGUOUS = new Set('0O1lI')

/** Symbols accepted almost everywhere and safe to paste into forms, shells and URLs. */
const COMMON_SYMBOLS = '!@#$%^&*-_+=?.'

/** PayPal's own tips page lists this symbol set (no hyphen). */
const PAYPAL_SYMBOLS = '!@#$%^&*_+=?.'

/** Characters that never need percent-encoding in a URL (RFC 3986 "unreserved"), minus letters and digits. */
const URL_SAFE_SYMBOLS = '-._~'

const NO_DOCUMENTED_MAX = 128

export const PLATFORMS: PlatformPolicy[] = [
  {
    id: 'universal',
    name: 'Any website',
    category: 'Universal',
    basis: 'guidance',
    minLength: 8,
    maxLength: NO_DOCUMENTED_MAX,
    recommendedLength: 16,
    required: ['lower', 'upper', 'digit', 'symbol'],
    symbols: COMMON_SYMBOLS,
    notes: [
      'A balanced default that the vast majority of sites accept.',
      'If a form rejects a symbol, turn symbols off and add length instead.',
    ],
  },

  // Accounts
  {
    id: 'google',
    name: 'Google',
    category: 'Accounts',
    basis: 'typical',
    sourceUrl: 'https://support.google.com/accounts/answer/32040',
    minLength: 8,
    maxLength: NO_DOCUMENTED_MAX,
    recommendedLength: 16,
    required: [],
    symbols: COMMON_SYMBOLS,
    notes: [
      'Google recommends at least 12 characters.',
      'ASCII characters only, and no leading or trailing space.',
      'Weak or previously used passwords are rejected.',
    ],
  },
  {
    id: 'apple',
    name: 'Apple Account',
    category: 'Accounts',
    basis: 'official',
    sourceUrl: 'https://support.apple.com/en-us/102614',
    minLength: 8,
    maxLength: NO_DOCUMENTED_MAX,
    recommendedLength: 16,
    required: ['lower', 'upper', 'digit'],
    symbols: COMMON_SYMBOLS,
    maxRepeat: 2,
    notes: [
      'Avoids three or more identical characters in a row as a precaution — Apple is widely reported to reject them.',
    ],
  },
  {
    id: 'microsoft',
    name: 'Microsoft (personal)',
    category: 'Accounts',
    basis: 'typical',
    sourceUrl:
      'https://support.microsoft.com/en-us/account-billing/change-your-microsoft-account-password-fdde885b-86da-2965-69fd-4871309ef1f1',
    minLength: 8,
    maxLength: NO_DOCUMENTED_MAX,
    recommendedLength: 16,
    required: [],
    symbols: COMMON_SYMBOLS,
    notes: ['New Microsoft accounts are passwordless by default; a password is optional.'],
  },
  {
    id: 'microsoft-work',
    name: 'Microsoft 365 (work or school)',
    category: 'Accounts',
    basis: 'official',
    sourceUrl: 'https://learn.microsoft.com/en-us/entra/identity/authentication/concept-sspr-policy',
    minLength: 8,
    maxLength: 256,
    recommendedLength: 16,
    required: ['lower', 'upper', 'digit', 'symbol'],
    symbols: COMMON_SYMBOLS,
    notes: [
      'Microsoft Entra requires 3 of the 4 character types; this password includes all four.',
      'Your organization may set a stricter policy.',
    ],
  },

  // Social
  {
    id: 'facebook',
    name: 'Facebook',
    category: 'Social',
    basis: 'typical',
    sourceUrl: 'https://www.facebook.com/help/124904560921566',
    minLength: 6,
    maxLength: NO_DOCUMENTED_MAX,
    recommendedLength: 16,
    required: [],
    symbols: COMMON_SYMBOLS,
    notes: [
      'Facebook recommends a mix of letters, numbers and special characters.',
      'Don’t reuse your email, phone number or birthday inside the password.',
    ],
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'Social',
    basis: 'typical',
    sourceUrl: 'https://www.facebook.com/help/instagram/369001149843369',
    minLength: 6,
    maxLength: NO_DOCUMENTED_MAX,
    recommendedLength: 16,
    required: [],
    symbols: COMMON_SYMBOLS,
    notes: ['Instagram recommends at least 6 characters mixing letters, numbers and special characters.'],
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    category: 'Social',
    basis: 'typical',
    minLength: 8,
    maxLength: NO_DOCUMENTED_MAX,
    recommendedLength: 16,
    required: [],
    symbols: COMMON_SYMBOLS,
    notes: ['X recommends a long, unique password without personal information or common sequences.'],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    category: 'Social',
    basis: 'official',
    sourceUrl: 'https://www.linkedin.com/help/linkedin/answer/a1379143/changing-your-password',
    minLength: 8,
    maxLength: NO_DOCUMENTED_MAX,
    recommendedLength: 16,
    required: [],
    symbols: COMMON_SYMBOLS,
    notes: ['Case-sensitive. LinkedIn recommends mixing letters, numbers and special characters.'],
  },
  {
    id: 'discord',
    name: 'Discord',
    category: 'Social',
    basis: 'typical',
    sourceUrl: 'https://support.discord.com/hc/en-us/articles/218410947',
    minLength: 8,
    maxLength: NO_DOCUMENTED_MAX,
    recommendedLength: 16,
    required: [],
    symbols: COMMON_SYMBOLS,
    notes: ['Discord recommends a long, unique password.'],
  },

  // Shopping & media
  {
    id: 'amazon',
    name: 'Amazon',
    category: 'Shopping & Media',
    basis: 'typical',
    sourceUrl: 'https://pay.amazon.com/help/201754750',
    minLength: 6,
    maxLength: NO_DOCUMENTED_MAX,
    recommendedLength: 16,
    required: [],
    symbols: COMMON_SYMBOLS,
    notes: [
      'Amazon publishes rules only for Amazon Pay: 6+ characters mixing at least 3 of the 4 character types.',
      'Generated passwords include all four types.',
    ],
  },
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'Shopping & Media',
    basis: 'official',
    sourceUrl: 'https://help.netflix.com/en/node/54078',
    minLength: 6,
    maxLength: 60,
    recommendedLength: 16,
    required: [],
    symbols: COMMON_SYMBOLS,
    notes: ['Length is documented (6–60). Common or insecure passwords are rejected.'],
  },
  {
    id: 'spotify',
    name: 'Spotify',
    category: 'Shopping & Media',
    basis: 'typical',
    sourceUrl: 'https://support.spotify.com/us/article/protect-your-account/',
    minLength: 8,
    maxLength: NO_DOCUMENTED_MAX,
    recommendedLength: 16,
    required: [],
    symbols: COMMON_SYMBOLS,
    notes: ['Spotify recommends a long password with letters, capitals, numbers and special characters.'],
  },
  {
    id: 'paypal',
    name: 'PayPal',
    category: 'Shopping & Media',
    basis: 'typical',
    sourceUrl: 'https://www.paypal.com/us/cshelp/article/tips-for-creating-a-secure-password-help684',
    minLength: 8,
    maxLength: NO_DOCUMENTED_MAX,
    recommendedLength: 16,
    required: [],
    symbols: PAYPAL_SYMBOLS,
    notes: [
      'PayPal suggests lowercase, uppercase, a number, a special character, and more than 8 characters.',
      'Only uses the symbols PayPal lists on its tips page.',
    ],
  },

  // Developer & network
  {
    id: 'github',
    name: 'GitHub',
    category: 'Developer & Network',
    basis: 'official',
    sourceUrl:
      'https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-strong-password',
    minLength: 8,
    maxLength: NO_DOCUMENTED_MAX,
    recommendedLength: 20,
    required: ['lower', 'digit'],
    symbols: COMMON_SYMBOLS,
    notes: [
      'GitHub accepts 15+ characters of anything, or 8+ characters with a number and a lowercase letter.',
      'Passwords found in known breaches are rejected.',
    ],
  },
  {
    id: 'wifi',
    name: 'Wi-Fi (WPA2 / WPA3)',
    category: 'Developer & Network',
    basis: 'typical',
    minLength: 8,
    maxLength: 63,
    recommendedLength: 20,
    required: [],
    symbols: COMMON_SYMBOLS,
    notes: [
      'WPA2 passphrases are 8–63 printable ASCII characters; WPA3 routers use the same range for compatibility.',
      'Attackers can capture a handshake and guess offline, so length matters most here.',
      'Typing it on a TV or console? Turn on “avoid look-alike characters”.',
    ],
  },
  {
    id: 'database',
    name: 'Database / server',
    category: 'Developer & Network',
    basis: 'guidance',
    sourceUrl: 'https://datatracker.ietf.org/doc/html/rfc3986#section-3.2.1',
    minLength: 12,
    maxLength: NO_DOCUMENTED_MAX,
    recommendedLength: 24,
    required: ['lower', 'upper', 'digit'],
    symbols: URL_SAFE_SYMBOLS,
    notes: [
      'Only uses A–Z a–z 0–9 and - . _ ~, characters that never need URL-encoding.',
      'Paste it straight into a connection string like postgres://user:password@host/db.',
    ],
  },
]

export const DEFAULT_PLATFORM_ID = 'universal'

export function getPlatform(id: string): PlatformPolicy {
  return PLATFORMS.find((platform) => platform.id === id) ?? PLATFORMS[0]
}

// ---------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------

/** Longest length offered by the UI slider, even if a platform allows more. */
export const UI_MAX_LENGTH = 64

export function lengthBounds(policy: PlatformPolicy): { min: number; max: number } {
  return { min: policy.minLength, max: Math.min(policy.maxLength, UI_MAX_LENGTH) }
}

/** Clamp options to what the platform allows and force symbols on/off when the rules demand it. */
export function resolveOptions(policy: PlatformPolicy, options: GeneratorOptions): GeneratorOptions {
  const { min, max } = lengthBounds(policy)
  const symbolsAllowed = policy.symbols.length > 0
  const symbolsRequired = policy.required.includes('symbol')

  return {
    length: Math.min(max, Math.max(min, Math.round(options.length))),
    includeSymbols: symbolsAllowed && (symbolsRequired || options.includeSymbols),
    avoidAmbiguous: options.avoidAmbiguous,
  }
}

export function defaultOptions(policy: PlatformPolicy): GeneratorOptions {
  return resolveOptions(policy, {
    length: policy.recommendedLength,
    includeSymbols: true,
    avoidAmbiguous: false,
  })
}

// ---------------------------------------------------------------------------
// Generation
// ---------------------------------------------------------------------------

function activePools(policy: PlatformPolicy, options: GeneratorOptions): string[] {
  const keep = (chars: string) =>
    options.avoidAmbiguous ? [...chars].filter((char) => !AMBIGUOUS.has(char)).join('') : chars

  const pools = [keep(LOWER), keep(UPPER), keep(DIGITS)]
  if (options.includeSymbols) pools.push(policy.symbols)
  return pools
}

/** Uniform integer in [0, max) from the Web Crypto API, using rejection sampling to avoid modulo bias. */
function randomInt(max: number): number {
  const limit = Math.floor(0x100000000 / max) * max
  const buffer = new Uint32Array(1)
  do {
    crypto.getRandomValues(buffer)
  } while (buffer[0] >= limit)
  return buffer[0] % max
}

function longestRun(password: string): number {
  let longest = 0
  let run = 0
  for (let i = 0; i < password.length; i++) {
    run = i > 0 && password[i] === password[i - 1] ? run + 1 : 1
    longest = Math.max(longest, run)
  }
  return longest
}

export function generatePassword(policy: PlatformPolicy, requested: GeneratorOptions): string {
  const options = resolveOptions(policy, requested)
  const pools = activePools(policy, options)
  const everything = pools.join('')

  // Rejection sampling: draw every character uniformly from the full pool and keep the result only if
  // it contains each character class. That makes every valid password equally likely, so the entropy
  // computed in assessStrength() is exact. Expected tries are small (about 4 in the worst case).
  for (let attempt = 0; attempt < 1000; attempt++) {
    const chars = Array.from({ length: options.length }, () => everything[randomInt(everything.length)])

    const hasEveryClass = pools.every((pool) => chars.some((char) => pool.includes(char)))
    const password = chars.join('')
    if (hasEveryClass && (!policy.maxRepeat || longestRun(password) <= policy.maxRepeat)) return password
  }

  throw new Error(`Could not generate a password for ${policy.name}`)
}

// ---------------------------------------------------------------------------
// Rule checks
// ---------------------------------------------------------------------------

export interface RuleCheck {
  label: string
  ok: boolean
}

const CLASS_TESTS: Record<CharClass, { label: string; test: (password: string) => boolean }> = {
  lower: { label: 'Contains a lowercase letter', test: (p) => /[a-z]/.test(p) },
  upper: { label: 'Contains an uppercase letter', test: (p) => /[A-Z]/.test(p) },
  digit: { label: 'Contains a number', test: (p) => /[0-9]/.test(p) },
  symbol: { label: 'Contains a symbol', test: (p) => /[^a-zA-Z0-9]/.test(p) },
}

export function checkPassword(password: string, policy: PlatformPolicy): RuleCheck[] {
  const lengthLabel =
    policy.maxLength >= UI_MAX_LENGTH * 2
      ? `At least ${policy.minLength} characters`
      : `${policy.minLength}–${policy.maxLength} characters`

  const checks: RuleCheck[] = [
    {
      label: lengthLabel,
      ok: password.length >= policy.minLength && password.length <= policy.maxLength,
    },
    ...policy.required.map((cls) => ({ label: CLASS_TESTS[cls].label, ok: CLASS_TESTS[cls].test(password) })),
  ]

  if (policy.maxRepeat) {
    checks.push({
      label: `No more than ${policy.maxRepeat} identical characters in a row`,
      ok: longestRun(password) <= policy.maxRepeat,
    })
  }

  const allowedSymbols = new Set(policy.symbols)
  checks.push({
    label: policy.symbols ? 'Only uses symbols the platform accepts' : 'Letters and numbers only',
    ok: [...password].every((char) => /[a-zA-Z0-9]/.test(char) || allowedSymbols.has(char)),
  })

  return checks
}

// ---------------------------------------------------------------------------
// Strength
// ---------------------------------------------------------------------------

export type StrengthLevel = 'very-weak' | 'weak' | 'fair' | 'strong' | 'very-strong'

export interface StrengthTier {
  level: StrengthLevel
  label: string
  /** Lowest entropy (in bits) that earns this tier. */
  minBits: number
  color: string
}

export const STRENGTH_TIERS: StrengthTier[] = [
  { level: 'very-weak', label: 'Very weak', minBits: 0, color: 'var(--tier-1)' },
  { level: 'weak', label: 'Weak', minBits: 28, color: 'var(--tier-2)' },
  { level: 'fair', label: 'Fair', minBits: 36, color: 'var(--tier-3)' },
  { level: 'strong', label: 'Strong', minBits: 60, color: 'var(--tier-4)' },
  { level: 'very-strong', label: 'Very strong', minBits: 80, color: 'var(--tier-5)' },
]

/** Assumed attacker speed for the offline estimate: 10 billion guesses per second (GPU rig, fast hash). */
const GUESSES_PER_SECOND = 1e10

/**
 * Exact entropy of a uniformly random string of `length` characters that must contain at least one
 * character from every pool. Inclusion–exclusion over the pools, so the "one of each class" rule is
 * accounted for instead of overstating the strength of short passwords.
 */
function entropyBits(pools: string[], length: number): number {
  const total = pools.reduce((sum, pool) => sum + pool.length, 0)
  let valid = 0

  for (let mask = 0; mask < 1 << pools.length; mask++) {
    let remaining = total
    let excluded = 0
    pools.forEach((pool, index) => {
      if (mask & (1 << index)) {
        remaining -= pool.length
        excluded++
      }
    })
    valid += (excluded % 2 === 0 ? 1 : -1) * Math.pow(remaining, length)
  }

  return Math.log2(valid)
}

export function formatCrackTime(bits: number): string {
  // On average an attacker finds the password after trying half the search space.
  const seconds = Math.pow(2, bits - 1) / GUESSES_PER_SECOND

  if (seconds < 1) return 'instantly'
  if (seconds < 60) return `${Math.round(seconds)} seconds`
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`

  const years = seconds / 31_557_600
  if (years < 1) return `${Math.round(seconds / 86400)} days`
  if (years < 1000) return `${Math.round(years)} years`
  if (years < 1e6) return `${Math.round(years / 1e3)} thousand years`
  if (years < 1e9) return `${Math.round(years / 1e6)} million years`
  if (years < 1e12) return `${Math.round(years / 1e9)} billion years`
  return 'more than a trillion years'
}

export interface Strength {
  tier: StrengthTier
  /** 0 (very weak) to 4 (very strong). */
  score: number
  bits: number
  crackTime: string
}

export function assessStrength(policy: PlatformPolicy, requested: GeneratorOptions): Strength {
  const options = resolveOptions(policy, requested)
  const bits = entropyBits(activePools(policy, options), options.length)

  let score = 0
  STRENGTH_TIERS.forEach((tier, index) => {
    if (bits >= tier.minBits) score = index
  })

  return { tier: STRENGTH_TIERS[score], score, bits, crackTime: formatCrackTime(bits) }
}

export { COMMON_SYMBOLS }
