'use client'

import { useEffect, useState } from 'react'

/**
 * The current time in ms, refreshed every `intervalMs`. Null until the page has mounted, so the
 * first client render matches the statically exported HTML.
 */
export function useNow(intervalMs: number): number | null {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    const tick = () => setNow(Date.now())
    const frame = requestAnimationFrame(tick)
    const timer = window.setInterval(tick, intervalMs)
    return () => {
      cancelAnimationFrame(frame)
      window.clearInterval(timer)
    }
  }, [intervalMs])

  return now
}
