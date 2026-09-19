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
  type PlatformCategory,
  type RuleBasis,
} from '@/lib/passwords'

const CATEGORY_ORDER: PlatformCategory[] = [
  'Universal',
  'Accounts',
  'Social',
  'Shopping & Media',
  'Developer & Network',
]

const BASIS: Record<RuleBasis, { label: string; description: string; className: string }> = {
  official: {
    label: 'Official rules',
    description: 'These limits come from the platform’s own documentation.',
    className: 'bg-[#E6F4EA] text-[#1E6B3A]',
  },
  typical: {
    label: 'Typical rules',
    description:
      'The platform only publishes recommendations, so these are the limits usually enforced. The sign-up form has the final say.',
    className: 'bg-[#FDF3DC] text-[#8A5A00]',
  },
  guidance: {
    label: 'Our recommendation',
    description: 'No platform-specific rules exist for this, so this is what we recommend.',
    className: 'bg-[#EEEDEB] text-[#484644]',
  },
}

const iconProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'none',
  viewBox: '0 0 24 24',
  strokeWidth: 1.5,
  stroke: 'currentColor',
  className: 'w-4 h-4',
  'aria-hidden': true,
} as const

function CharView({ char }: { char: string }) {
  const tone = /[0-9]/.test(char) ? 'text-[#FF5F00]' : /[a-zA-Z]/.test(char) ? 'text-[#1A1A1A]' : 'text-[#0F6CBD]'
  return <span className={tone}>{char}</span>
}

export default function PasswordGenerator() {
  const [platformId, setPlatformId] = useState(DEFAULT_PLATFORM_ID)
  const [options, setOptions] = useState<GeneratorOptions>(() => defaultOptions(getPlatform(DEFAULT_PLATFORM_ID)))
  const [password, setPassword] = useState('')
  const [revealed, setRevealed] = useState(true)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const copyTimer = useRef<number | undefined>(undefined)

  const policy = getPlatform(platformId)
  const { min, max } = lengthBounds(policy)

  // The first password is generated after hydration: randomness during render would make the
  // client differ from the statically exported HTML.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const initial = getPlatform(DEFAULT_PLATFORM_ID)
      setPassword(generatePassword(initial, defaultOptions(initial)))
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => () => window.clearTimeout(copyTimer.current), [])

  const strength = assessStrength(policy, options)
  const checks = password ? checkPassword(password, policy) : []

  function regenerate(nextPlatformId: string, nextOptions: GeneratorOptions) {
    const nextPolicy = getPlatform(nextPlatformId)
    const resolved = resolveOptions(nextPolicy, nextOptions)
    setPlatformId(nextPlatformId)
    setOptions(resolved)
    setPassword(generatePassword(nextPolicy, resolved))
    setCopyState('idle')
  }

  function selectPlatform(id: string) {
    // Keep the user's toggles, but start at the new platform's recommended length.
    regenerate(id, { ...options, length: getPlatform(id).recommendedLength })
  }

  function updateOptions(patch: Partial<GeneratorOptions>) {
    regenerate(platformId, { ...options, ...patch })
  }

  async function copy() {
    if (!password) return
    try {
      await navigator.clipboard.writeText(password)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
    window.clearTimeout(copyTimer.current)
    copyTimer.current = window.setTimeout(() => setCopyState('idle'), 2000)
  }

  const symbolsForced = policy.required.includes('symbol')
  const symbolsUnavailable = policy.symbols.length === 0
  const lengthPresets = [
    { label: 'Minimum', value: min },
    { label: 'Recommended', value: Math.min(max, policy.recommendedLength) },
    { label: 'Maximum', value: max },
  ].filter((preset, index, all) => all.findIndex((other) => other.value === preset.value) === index)

  return (
    <div className="space-y-10">
      {/* 1. Platform */}
      <section aria-labelledby="platform-heading">
        <h2 id="platform-heading" className="text-xs uppercase tracking-wider text-[#8A8886] mb-4" style={{ fontWeight: 500 }}>
          1 · Where will you use it?
        </h2>

        <div className="space-y-5">
          {CATEGORY_ORDER.map((category) => (
            <fieldset key={category}>
              <legend className="text-xs text-[#B4B2AF] mb-2" style={{ fontWeight: 400 }}>{category}</legend>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.filter((platform) => platform.category === category).map((platform) => (
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
                      className="block px-3.5 py-2 text-sm text-[#484644] bg-white border border-[#E1DFDD] rounded-lg cursor-pointer transition-colors hover:border-[#1A1A1A] peer-checked:bg-[#1A1A1A] peer-checked:border-[#1A1A1A] peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#FF5F00] peer-focus-visible:ring-offset-2"
                      style={{ fontWeight: 400 }}
                    >
                      {platform.name}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      </section>

      {/* 2. Result */}
      <section aria-labelledby="result-heading">
        <h2 id="result-heading" className="text-xs uppercase tracking-wider text-[#8A8886] mb-4" style={{ fontWeight: 500 }}>
          2 · Your password
        </h2>

        <div className="bg-white border border-[#F0EEEC] rounded-2xl p-5 sm:p-7">
          <p className="text-sm text-[#8A8886] mb-3" style={{ fontWeight: 300 }}>
            For <span className="text-[#1A1A1A]" style={{ fontWeight: 500 }}>{policy.name}</span>
          </p>

          <p
            className="min-h-[3.5rem] px-4 py-3.5 bg-[#FAFAF9] border border-[#F0EEEC] rounded-xl font-mono text-lg sm:text-2xl leading-snug tracking-wide break-all select-all"
            aria-label={revealed ? undefined : 'Password hidden'}
          >
            {!password && <span className="text-[#B4B2AF]">Generating…</span>}
            {password && revealed && [...password].map((char, index) => <CharView key={index} char={char} />)}
            {password && !revealed && <span className="text-[#8A8886]">{'•'.repeat(password.length)}</span>}
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            <button
              type="button"
              onClick={copy}
              disabled={!password}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-white text-sm rounded-lg hover:bg-[#333] disabled:opacity-40 transition-colors"
              style={{ fontWeight: 500 }}
            >
              <svg {...iconProps}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
              {copyState === 'copied' ? 'Copied' : copyState === 'failed' ? 'Copy failed' : 'Copy'}
            </button>
            <button
              type="button"
              onClick={() => regenerate(platformId, options)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm text-[#484644] border border-[#E1DFDD] rounded-lg hover:border-[#1A1A1A] transition-colors"
              style={{ fontWeight: 400 }}
            >
              <svg {...iconProps}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Regenerate
            </button>
            <button
              type="button"
              onClick={() => setRevealed((value) => !value)}
              aria-pressed={!revealed}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm text-[#605E5C] rounded-lg hover:text-[#1A1A1A] transition-colors"
              style={{ fontWeight: 400 }}
            >
              <svg {...iconProps}>
                {revealed ? (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </>
                ) : (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </>
                )}
              </svg>
              {revealed ? 'Hide' : 'Show'}
            </button>
          </div>
          <p role="status" aria-live="polite" className="sr-only">
            {copyState === 'copied' ? 'Password copied to clipboard' : copyState === 'failed' ? 'Could not copy the password' : ''}
          </p>

          {/* Strength */}
          <div className="mt-7 pt-6 border-t border-[#F0EEEC]">
            <div className="flex items-baseline justify-between gap-4 mb-3">
              <p className="text-sm text-[#8A8886]" style={{ fontWeight: 300 }}>Strength</p>
              <p className="text-base" style={{ fontWeight: 500, color: strength.tier.color }}>
                {strength.tier.label}
              </p>
            </div>
            <div className="grid grid-cols-5 gap-1.5" aria-hidden="true">
              {STRENGTH_TIERS.map((tier, index) => (
                <span
                  key={tier.level}
                  className="h-1.5 rounded-full transition-colors"
                  style={{ backgroundColor: index <= strength.score ? strength.tier.color : '#EEEDEB' }}
                />
              ))}
            </div>
            <p className="mt-3 text-xs text-[#8A8886] leading-relaxed" style={{ fontWeight: 300 }}>
              About {Math.round(strength.bits)} bits of entropy. An offline attacker guessing 10 billion passwords per
              second would need roughly <span className="text-[#484644]" style={{ fontWeight: 400 }}>{strength.crackTime}</span> on
              average.
            </p>
          </div>

          {/* Options */}
          <div className="mt-7 pt-6 border-t border-[#F0EEEC] space-y-6">
            <div>
              <div className="flex items-baseline justify-between mb-3">
                <label htmlFor="length" className="text-sm text-[#484644]" style={{ fontWeight: 400 }}>Length</label>
                <span className="text-sm text-[#1A1A1A] tabular-nums" style={{ fontWeight: 500 }}>{options.length}</span>
              </div>
              <input
                id="length"
                type="range"
                min={min}
                max={max}
                step={1}
                value={options.length}
                onChange={(event) => updateOptions({ length: Number(event.target.value) })}
                className="w-full accent-[#FF5F00]"
                aria-valuetext={`${options.length} characters`}
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {lengthPresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => updateOptions({ length: preset.value })}
                    aria-pressed={options.length === preset.value}
                    className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                      options.length === preset.value
                        ? 'bg-[#1A1A1A] text-white'
                        : 'bg-[#F3F2F1] text-[#605E5C] hover:bg-[#E8E6E3]'
                    }`}
                    style={{ fontWeight: 500 }}
                  >
                    {preset.label} · {preset.value}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 text-sm text-[#484644] cursor-pointer has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60">
                <input
                  type="checkbox"
                  checked={options.includeSymbols}
                  disabled={symbolsForced || symbolsUnavailable}
                  onChange={(event) => updateOptions({ includeSymbols: event.target.checked })}
                  className="mt-0.5 w-4 h-4 accent-[#FF5F00]"
                />
                <span>
                  Include symbols
                  {symbolsForced && <span className="block text-xs text-[#8A8886]">Required by {policy.name}.</span>}
                  {symbolsUnavailable && <span className="block text-xs text-[#8A8886]">Not accepted by {policy.name}.</span>}
                </span>
              </label>

              <label className="flex items-start gap-3 text-sm text-[#484644] cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.avoidAmbiguous}
                  onChange={(event) => updateOptions({ avoidAmbiguous: event.target.checked })}
                  className="mt-0.5 w-4 h-4 accent-[#FF5F00]"
                />
                <span>
                  Avoid look-alike characters
                  <span className="block text-xs text-[#8A8886]">Skips 0 O 1 l I — easier to read aloud or type by hand.</span>
                </span>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Rules */}
      <section aria-labelledby="rules-heading">
        <h2 id="rules-heading" className="text-xs uppercase tracking-wider text-[#8A8886] mb-4" style={{ fontWeight: 500 }}>
          3 · Rules for {policy.name}
        </h2>

        <div className="bg-white border border-[#F0EEEC] rounded-2xl p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-5">
            <span className={`px-2.5 py-1 text-[11px] rounded-full ${BASIS[policy.basis].className}`} style={{ fontWeight: 500 }}>
              {BASIS[policy.basis].label}
            </span>
            {policy.sourceUrl && (
              <a
                href={policy.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#8A8886] hover:text-[#FF5F00] underline underline-offset-2 transition-colors"
              >
                Source
              </a>
            )}
          </div>
          <p className="text-xs text-[#8A8886] leading-relaxed mb-6" style={{ fontWeight: 300 }}>
            {BASIS[policy.basis].description}
          </p>

          <ul className="space-y-2.5 mb-6">
            {checks.map((check) => (
              <li key={check.label} className="flex items-start gap-2.5 text-sm text-[#484644]">
                <svg
                  {...iconProps}
                  strokeWidth={2}
                  className={`w-4 h-4 mt-0.5 shrink-0 ${check.ok ? 'text-[#3E9B5F]' : 'text-[#C4314B]'}`}
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
            <ul className="space-y-2 pt-5 border-t border-[#F0EEEC]">
              {policy.notes.map((note) => (
                <li key={note} className="flex items-start gap-2.5 text-sm text-[#605E5C] leading-relaxed" style={{ fontWeight: 300 }}>
                  <span className="w-1 h-1 mt-2 rounded-full bg-[#B4B2AF] shrink-0" aria-hidden="true" />
                  {note}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Grading + privacy */}
      <section className="space-y-4">
        <details className="group bg-white border border-[#F0EEEC] rounded-2xl">
          <summary className="cursor-pointer list-none px-5 sm:px-7 py-4 text-sm text-[#484644] flex items-center justify-between" style={{ fontWeight: 400 }}>
            How strength is graded
            <svg {...iconProps} className="w-4 h-4 text-[#8A8886] transition-transform group-open:rotate-180">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </summary>
          <div className="px-5 sm:px-7 pb-6">
            <p className="text-sm text-[#605E5C] leading-relaxed mb-4" style={{ fontWeight: 300 }}>
              Strength is the entropy of the way the password was generated: how many equally likely passwords could
              have come out of the same settings. More bits means exponentially more guesses.
            </p>
            <table className="w-full text-sm">
              <caption className="sr-only">Strength tiers by entropy</caption>
              <thead>
                <tr className="text-left text-xs text-[#8A8886]">
                  <th scope="col" className="pb-2 pr-4" style={{ fontWeight: 400 }}>Tier</th>
                  <th scope="col" className="pb-2" style={{ fontWeight: 400 }}>Entropy</th>
                </tr>
              </thead>
              <tbody>
                {STRENGTH_TIERS.map((tier, index) => {
                  const next = STRENGTH_TIERS[index + 1]
                  return (
                    <tr key={tier.level} className="border-t border-[#F0EEEC]">
                      <th scope="row" className="py-2 pr-4 text-left" style={{ fontWeight: 500, color: tier.color }}>{tier.label}</th>
                      <td className="py-2 text-[#605E5C] tabular-nums" style={{ fontWeight: 300 }}>
                        {next ? `${tier.minBits}–${next.minBits - 1} bits` : `${tier.minBits}+ bits`}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <p className="text-xs text-[#8A8886] leading-relaxed mt-4" style={{ fontWeight: 300 }}>
              The crack-time figure assumes a fast offline attack on a leaked password database. Online logins are
              rate-limited, so real-world attacks against a good password are far slower. Reusing a password across
              sites is what actually gets people breached, so use a different one everywhere.
            </p>
          </div>
        </details>

        <p className="text-xs text-[#8A8886] leading-relaxed px-1" style={{ fontWeight: 300 }}>
          Passwords are generated in your browser with the Web Crypto API. Nothing is sent to a server, saved, or logged.
          Platform rules change without notice; if a site rejects a password, follow the message on its form.
        </p>
      </section>
    </div>
  )
}
