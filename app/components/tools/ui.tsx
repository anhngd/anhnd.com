'use client'

import { useEffect, useRef, useState } from 'react'
import { primaryButton, secondaryButton } from './toolStyles'

const icon = {
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'none',
  viewBox: '0 0 24 24',
  strokeWidth: 1.5,
  stroke: 'currentColor',
  className: 'w-4 h-4 shrink-0',
  'aria-hidden': true,
} as const

export function CopyButton({
  text,
  label = 'Copy',
  variant = 'secondary',
  disabled = false,
}: {
  text: string
  label?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
}) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setState('copied')
    } catch {
      setState('failed')
    }
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState('idle'), 1800)
  }

  const className =
    variant === 'primary'
      ? primaryButton
      : variant === 'ghost'
        ? 'inline-flex items-center gap-1.5 px-2 py-1 text-xs text-[#8A8886] rounded-md hover:text-[#1A1A1A] hover:bg-[#F3F2F1] disabled:opacity-40 transition-colors'
        : secondaryButton

  return (
    <button type="button" onClick={copy} disabled={disabled || !text} className={className}>
      <svg {...icon}>
        {state === 'copied' ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
        )}
      </svg>
      {state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : label}
      <span role="status" aria-live="polite" className="sr-only">
        {state === 'copied' ? 'Copied to clipboard' : state === 'failed' ? 'Could not copy' : ''}
      </span>
    </button>
  )
}

/** A row of mutually exclusive options, built on native radios so keyboard and screen readers just work. */
export function Segmented<T extends string>({
  name,
  legend,
  value,
  onChange,
  options,
}: {
  name: string
  legend: string
  value: T
  onChange: (value: T) => void
  options: { value: T; label: string }[]
}) {
  return (
    <fieldset>
      <legend className="sr-only">{legend}</legend>
      <div className="inline-flex flex-wrap gap-1 p-1 bg-[#F3F2F1] rounded-xl">
        {options.map((option) => (
          <div key={option.value}>
            <input
              type="radio"
              name={name}
              id={`${name}-${option.value}`}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className="block px-3.5 py-1.5 text-sm text-[#605E5C] rounded-lg cursor-pointer transition-colors hover:text-[#1A1A1A] peer-checked:bg-white peer-checked:text-[#1A1A1A] peer-checked:shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-[#FF5F00]"
              style={{ fontWeight: value === option.value ? 500 : 400 }}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  )
}

export function Notice({ tone, children }: { tone: 'error' | 'warning' | 'info' | 'success'; children: React.ReactNode }) {
  const styles = {
    error: 'bg-[#FDF0F1] border-[#F4C7CB] text-[#A4262C]',
    warning: 'bg-[#FDF6E3] border-[#F1DFA6] text-[#7A5200]',
    info: 'bg-[#F3F2F1] border-[#E1DFDD] text-[#484644]',
    success: 'bg-[#E9F5EC] border-[#BFE0C8] text-[#1E6B3A]',
  }[tone]

  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`px-4 py-3 text-sm leading-relaxed border rounded-xl ${styles}`}>
      {children}
    </div>
  )
}
