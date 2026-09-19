'use client'

import { useEffect, useState } from 'react'

type Mode = 'system' | 'light' | 'dark'

const ORDER: Mode[] = ['system', 'light', 'dark']
const STORAGE_KEY = 'theme'

function apply(mode: Mode) {
  const root = document.documentElement
  if (mode === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', mode)
}

const icons: Record<Mode, React.ReactNode> = {
  system: <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />,
  light: <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />,
  dark: <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />,
}

const labels: Record<Mode, string> = { system: 'System', light: 'Light', dark: 'Dark' }

export default function ThemeToggle() {
  const [mode, setMode] = useState<Mode>('system')

  // The saved choice is read after mount so the first render matches the static HTML.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY)
        if (saved === 'light' || saved === 'dark') setMode(saved)
      } catch {
        // Storage can be blocked; the toggle still works for this visit.
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  function cycle() {
    const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length]
    setMode(next)
    apply(next)
    try {
      if (next === 'system') window.localStorage.removeItem(STORAGE_KEY)
      else window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Not persisted.
    }
  }

  const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length]

  return (
    <button
      type="button"
      onClick={cycle}
      className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-ink-3 hover:text-ink hover:bg-sunken transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      aria-label={`Theme: ${labels[mode]}. Switch to ${labels[next]}.`}
      title={`Theme: ${labels[mode]}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[18px] h-[18px]" aria-hidden="true">
        {icons[mode]}
      </svg>
    </button>
  )
}
