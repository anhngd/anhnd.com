'use client'

import { useEffect, useRef, useState } from 'react'
import {
  DEFAULT_PLATFORM_ID,
  PLATFORMS,
  STRENGTH_TIERS,
  assessStrength,
  checkPassword,
  defaultOptions,
  generatePassword,
  getPlatform,
  lengthBounds,
  resolveOptions,
  type GeneratorOptions,
  type RuleBasis,
} from '@/lib/passwords'

const AUTO_COPY_KEY = 'anhnd.password-generator.auto-copy'

const BASIS: Record<RuleBasis, { label: string; description: string; className: string }> = {
  official: {
    label: 'Official rules',
    description: 'These limits come from the platform’s own documentation.',
    className: 'bg-ok-bg text-ok-ink',
  },
  typical: {
    label: 'Typical rules',
    description:
      'The platform only publishes recommendations, so these are the limits usually enforced. The sign-up form has the final say.',
    className: 'bg-warn-bg text-warn-ink',
  },
  guidance: {
    label: 'Our recommendation',
    description: 'No platform-specific rules exist for this, so this is what we recommend.',
    className: 'bg-sunken text-ink-2',
  },
}

const iconProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'none',
  viewBox: '0 0 24 24',
  strokeWidth: 1.5,
  stroke: 'currentColor',
  className: 'w-4 h-4 shrink-0',
  'aria-hidden': true,
} as const

function CharView({ char }: { char: string }) {
  const tone = /[0-9]/.test(char) ? 'text-brand-ink' : /[a-zA-Z]/.test(char) ? 'text-ink' : 'text-sym'
  return <span className={tone}>{char}</span>
}

const chevron = (
  <svg {...iconProps} className="w-4 h-4 text-ink-3 transition-transform group-open:rotate-180">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
)

export default function PasswordGenerator() {
  const [platformId, setPlatformId] = useState(DEFAULT_PLATFORM_ID)
  const [options, setOptions] = useState<GeneratorOptions>(() => defaultOptions(getPlatform(DEFAULT_PLATFORM_ID)))
  const [password, setPassword] = useState('')
  const [revealed, setRevealed] = useState(true)
  const [autoCopy, setAutoCopy] = useState(false)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const copyTimer = useRef<number | undefined>(undefined)

  const policy = getPlatform(platformId)
  const { min, max } = lengthBounds(policy)

  // Randomness and stored preferences are only touched after hydration, so the client render
  // matches the statically exported HTML.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const initial = getPlatform(DEFAULT_PLATFORM_ID)
      setPassword(generatePassword(initial, defaultOptions(initial)))
      try {
        setAutoCopy(window.localStorage.getItem(AUTO_COPY_KEY) === '1')
      } catch {
        // Storage can be blocked (private mode); the toggle simply starts off.
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => () => window.clearTimeout(copyTimer.current), [])

  const strength = assessStrength(policy, options)
  const checks = password ? checkPassword(password, policy) : []
  const passedChecks = checks.filter((check) => check.ok).length

  async function copyToClipboard(text: string) {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
    window.clearTimeout(copyTimer.current)
    copyTimer.current = window.setTimeout(() => setCopyState('idle'), 2000)
  }

  /** Generates a new password. `fromClick` is true only for direct clicks, the one case where auto-copy is allowed. */
  function generate(nextPlatformId: string, nextOptions: GeneratorOptions, fromClick = false) {
    const nextPolicy = getPlatform(nextPlatformId)
    const resolved = resolveOptions(nextPolicy, nextOptions)
    const next = generatePassword(nextPolicy, resolved)

    setPlatformId(nextPlatformId)
    setOptions(resolved)
    setPassword(next)
    setCopyState('idle')
    if (fromClick && autoCopy) void copyToClipboard(next)
  }

  function selectPlatform(id: string) {
    // Keep the user's toggles, but start at the new platform's recommended length.
    generate(id, { ...options, length: getPlatform(id).recommendedLength }, true)
  }

  function updateOptions(patch: Partial<GeneratorOptions>) {
    generate(platformId, { ...options, ...patch })
  }

  function toggleAutoCopy(enabled: boolean) {
    setAutoCopy(enabled)
    try {
      window.localStorage.setItem(AUTO_COPY_KEY, enabled ? '1' : '0')
    } catch {
      // Not persisted; still applies for this visit.
    }
  }

  const symbolsForced = policy.required.includes('symbol')
  const symbolsUnavailable = policy.symbols.length === 0
  const lengthPresets = [
    { label: 'Min', value: min },
    { label: 'Recommended', value: Math.min(max, policy.recommendedLength) },
    { label: 'Max', value: max },
  ].filter((preset, index, all) => all.findIndex((other) => other.value === preset.value) === index)

  const toggleChip =
    'flex items-center gap-2 px-3 py-1.5 text-xs text-ink-2 bg-card border border-line-strong rounded-full cursor-pointer select-none transition-colors ' +
    'peer-checked:bg-brand-soft peer-checked:border-brand peer-checked:text-brand-soft-ink peer-checked:[&_.dot]:bg-brand ' +
    'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2'

  return (
    <div className="space-y-4">
      <div className="bg-card border border-line rounded-2xl divide-y divide-line">
        {/* Platform */}
        <fieldset className="p-5 sm:p-6">
          <legend className="sr-only">Platform</legend>
          <p className="text-xs text-ink-3 mb-3" style={{ fontWeight: 500 }} aria-hidden="true">
            Where will you use it?
          </p>
          <div className="flex flex-wrap gap-1.5">
            {PLATFORMS.map((platform) => (
              <div key={platform.id}>
                <input
                  type="radio"
                  name="platform"
                  id={`platform-${platform.id}`}
                  value={platform.id}
                  checked={platformId === platform.id}
                  onChange={() => selectPlatform(platform.id)}
                  className="peer sr-only"
                />
                <label
                  htmlFor={`platform-${platform.id}`}
                  className="block px-3 py-1.5 text-[13px] text-ink-2 bg-page border border-line rounded-lg cursor-pointer transition-colors hover:border-ink peer-checked:bg-invert peer-checked:border-ink peer-checked:text-on-invert peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2"
                  style={{ fontWeight: 400 }}
                >
                  {platform.name}
                </label>
              </div>
            ))}
          </div>
        </fieldset>

        {/* Password */}
        <div className="p-5 sm:p-6">
          <button
            type="button"
            onClick={() => copyToClipboard(password)}
            disabled={!password}
            title="Click to copy"
            className="relative block w-full min-h-[4rem] px-4 py-4 pr-20 text-left bg-page border border-line rounded-xl font-mono text-lg sm:text-2xl leading-snug tracking-wide break-all hover:border-line-strong focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none transition-colors"
            aria-label={password ? (revealed ? `Copy password ${password}` : 'Copy hidden password') : 'Generating password'}
          >
            {!password && <span className="text-ink-4">Generating…</span>}
            {password && revealed && [...password].map((char, index) => <CharView key={index} char={char} />)}
            {password && !revealed && <span className="text-ink-3">{'•'.repeat(password.length)}</span>}
            <span
              className={`absolute top-3 right-3 px-2 py-1 text-[11px] rounded-md font-sans ${
                copyState === 'copied'
                  ? 'bg-ok-bg text-ok-ink'
                  : copyState === 'failed'
                    ? 'bg-danger-bg text-danger-ink'
                    : 'bg-sunken text-ink-3'
              }`}
              style={{ fontWeight: 500, letterSpacing: 0 }}
              aria-hidden="true"
            >
              {copyState === 'copied' ? 'Copied' : copyState === 'failed' ? 'Failed' : 'Click to copy'}
            </span>
          </button>

          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={() => copyToClipboard(password)}
              disabled={!password}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-brand text-on-brand text-sm rounded-lg hover:bg-brand-hover disabled:opacity-40 transition-colors"
              style={{ fontWeight: 500 }}
            >
              <svg {...iconProps}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
              {copyState === 'copied' ? 'Copied' : copyState === 'failed' ? 'Copy failed' : 'Copy'}
            </button>
            <button
              type="button"
              onClick={() => generate(platformId, options, true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm text-ink-2 border border-line-strong rounded-lg hover:border-ink transition-colors"
              style={{ fontWeight: 400 }}
            >
              <svg {...iconProps}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <span className="hidden sm:inline">Regenerate</span>
              <span className="sr-only sm:hidden">Regenerate</span>
            </button>
            <button
              type="button"
              onClick={() => setRevealed((value) => !value)}
              aria-pressed={!revealed}
              className="inline-flex items-center gap-2 px-3 py-2.5 text-sm text-ink-2 rounded-lg hover:text-ink transition-colors"
              style={{ fontWeight: 400 }}
            >
              <svg {...iconProps}>
                {revealed ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                ) : (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </>
                )}
              </svg>
              <span className="hidden sm:inline">{revealed ? 'Hide' : 'Show'}</span>
              <span className="sr-only sm:hidden">{revealed ? 'Hide' : 'Show'}</span>
            </button>
          </div>
          <p role="status" aria-live="polite" className="sr-only">
            {copyState === 'copied' ? 'Password copied to clipboard' : copyState === 'failed' ? 'Could not copy the password' : ''}
          </p>

          {/* Strength */}
          <div className="mt-5">
            <div className="grid grid-cols-5 gap-1" aria-hidden="true">
              {STRENGTH_TIERS.map((tier, index) => (
                <span
                  key={tier.level}
                  className="h-1.5 rounded-full transition-colors"
                  style={{ backgroundColor: index <= strength.score ? strength.tier.color : 'var(--sunken-2)' }}
                />
              ))}
            </div>
            <p className="mt-2.5 flex flex-wrap items-baseline gap-x-2 text-xs text-ink-3" style={{ fontWeight: 400 }}>
              <span className="text-sm" style={{ fontWeight: 500, color: strength.tier.color }}>{strength.tier.label}</span>
              <span aria-hidden="true">·</span>
              <span>~{Math.round(strength.bits)} bits</span>
              <span aria-hidden="true">·</span>
              <span>offline crack time ≈ {strength.crackTime}</span>
            </p>
          </div>
        </div>

        {/* Settings */}
        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 mb-2">
              <label htmlFor="length" className="text-xs text-ink-3" style={{ fontWeight: 500 }}>
                Length · <span className="text-ink tabular-nums">{options.length}</span>
              </label>
              <div className="flex flex-wrap gap-1">
                {lengthPresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => updateOptions({ length: preset.value })}
                    aria-pressed={options.length === preset.value}
                    className={`px-2.5 py-1 text-[11px] rounded-full transition-colors ${
                      options.length === preset.value
                        ? 'bg-invert text-on-invert'
                        : 'bg-sunken text-ink-2 hover:bg-sunken-2'
                    }`}
                    style={{ fontWeight: 500 }}
                  >
                    {preset.label} {preset.value}
                  </button>
                ))}
              </div>
            </div>
            <input
              id="length"
              type="range"
              min={min}
              max={max}
              step={1}
              value={options.length}
              onChange={(event) => updateOptions({ length: Number(event.target.value) })}
              className="w-full accent-brand-ink"
              aria-valuetext={`${options.length} characters`}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <div>
              <input
                type="checkbox"
                id="opt-symbols"
                checked={options.includeSymbols}
                disabled={symbolsForced || symbolsUnavailable}
                onChange={(event) => updateOptions({ includeSymbols: event.target.checked })}
                className="peer sr-only"
              />
              <label
                htmlFor="opt-symbols"
                className={toggleChip}
                title={symbolsForced ? `Required by ${policy.name}` : symbolsUnavailable ? `Not accepted by ${policy.name}` : undefined}
              >
                <span className="dot w-1.5 h-1.5 rounded-full bg-ink-4" aria-hidden="true" />
                Symbols{symbolsForced ? ' (required)' : symbolsUnavailable ? ' (not allowed)' : ''}
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="opt-ambiguous"
                checked={options.avoidAmbiguous}
                onChange={(event) => updateOptions({ avoidAmbiguous: event.target.checked })}
                className="peer sr-only"
              />
              <label htmlFor="opt-ambiguous" className={toggleChip} title="Skips 0 O 1 l I">
                <span className="dot w-1.5 h-1.5 rounded-full bg-ink-4" aria-hidden="true" />
                No look-alikes (0 O 1 l I)
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="opt-autocopy"
                checked={autoCopy}
                onChange={(event) => toggleAutoCopy(event.target.checked)}
                className="peer sr-only"
              />
              <label htmlFor="opt-autocopy" className={toggleChip} title="Copy each new password when you pick a platform or press Regenerate">
                <span className="dot w-1.5 h-1.5 rounded-full bg-ink-4" aria-hidden="true" />
                Auto-copy
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Rules */}
      <details className="group bg-card border border-line rounded-2xl">
        <summary className="cursor-pointer list-none px-5 sm:px-6 py-4 flex items-center justify-between gap-3 rounded-2xl focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none">
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-ink-2" style={{ fontWeight: 400 }}>
            Rules for {policy.name}
            <span className={`px-2 py-0.5 text-[11px] rounded-full ${BASIS[policy.basis].className}`} style={{ fontWeight: 500 }}>
              {BASIS[policy.basis].label}
            </span>
            {checks.length > 0 && (
              <span className={`text-xs ${passedChecks === checks.length ? 'text-ok-ink' : 'text-danger-ink'}`} style={{ fontWeight: 500 }}>
                {passedChecks}/{checks.length} met
              </span>
            )}
          </span>
          {chevron}
        </summary>

        <div className="px-5 sm:px-6 pb-6">
          <p className="text-xs text-ink-3 leading-relaxed mb-4" style={{ fontWeight: 400 }}>
            {BASIS[policy.basis].description}{' '}
            {policy.sourceUrl && (
              <a
                href={policy.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-brand-ink transition-colors"
              >
                Source
              </a>
            )}
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-5">
            {checks.map((check) => (
              <li key={check.label} className="flex items-start gap-2 text-sm text-ink-2">
                <svg
                  {...iconProps}
                  strokeWidth={2}
                  className={`w-4 h-4 mt-0.5 shrink-0 ${check.ok ? 'text-ok-ink' : 'text-danger-ink'}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={check.ok ? 'M4.5 12.75l6 6 9-13.5' : 'M6 18L18 6M6 6l12 12'} />
                </svg>
                <span>
                  {check.label}
                  <span className="sr-only">{check.ok ? ' — met' : ' — not met'}</span>
                </span>
              </li>
            ))}
          </ul>

          {policy.notes.length > 0 && (
            <ul className="space-y-1.5 pt-4 border-t border-line">
              {policy.notes.map((note) => (
                <li key={note} className="flex items-start gap-2.5 text-[13px] text-ink-2 leading-relaxed" style={{ fontWeight: 400 }}>
                  <span className="w-1 h-1 mt-2 rounded-full bg-ink-4 shrink-0" aria-hidden="true" />
                  {note}
                </li>
              ))}
            </ul>
          )}
        </div>
      </details>

      {/* Grading */}
      <details className="group bg-card border border-line rounded-2xl">
        <summary className="cursor-pointer list-none px-5 sm:px-6 py-4 text-sm text-ink-2 flex items-center justify-between rounded-2xl focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none" style={{ fontWeight: 400 }}>
          How strength is graded
          {chevron}
        </summary>
        <div className="px-5 sm:px-6 pb-6">
          <p className="text-sm text-ink-2 leading-relaxed mb-4" style={{ fontWeight: 400 }}>
            Strength is the entropy of the way the password was generated: how many equally likely passwords could
            have come out of the same settings. More bits means exponentially more guesses.
          </p>
          <table className="w-full text-sm">
            <caption className="sr-only">Strength tiers by entropy</caption>
            <thead>
              <tr className="text-left text-xs text-ink-3">
                <th scope="col" className="pb-2 pr-4" style={{ fontWeight: 400 }}>Tier</th>
                <th scope="col" className="pb-2" style={{ fontWeight: 400 }}>Entropy</th>
              </tr>
            </thead>
            <tbody>
              {STRENGTH_TIERS.map((tier, index) => {
                const next = STRENGTH_TIERS[index + 1]
                return (
                  <tr key={tier.level} className="border-t border-line">
                    <th scope="row" className="py-2 pr-4 text-left" style={{ fontWeight: 500, color: tier.color }}>{tier.label}</th>
                    <td className="py-2 text-ink-2 tabular-nums" style={{ fontWeight: 400 }}>
                      {next ? `${tier.minBits}–${next.minBits - 1} bits` : `${tier.minBits}+ bits`}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <p className="text-xs text-ink-3 leading-relaxed mt-4" style={{ fontWeight: 400 }}>
            The crack-time figure assumes a fast offline attack (10 billion guesses per second) on a leaked password
            database. Online logins are rate-limited, so real attacks against a good password are far slower. Reusing
            a password across sites is what actually gets people breached, so use a different one everywhere.
          </p>
        </div>
      </details>

    </div>
  )
}
