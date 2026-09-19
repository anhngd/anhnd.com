'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Fades content in as it scrolls into view. Content is visible by default, so it still shows with
 * JavaScript off and to crawlers; only blocks that start below the fold are hidden, after mount.
 */
export default function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let observer: IntersectionObserver | undefined
    const frame = requestAnimationFrame(() => {
      if (el.getBoundingClientRect().top < window.innerHeight) return

      setIsVisible(false)
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer?.disconnect()
          }
        },
        { threshold: 0.1 }
      )
      observer.observe(el)
    })

    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
    }
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}
