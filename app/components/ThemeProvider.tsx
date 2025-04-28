'use client'

import { useEffect } from 'react'

export default function ThemeProvider() {
  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours()
      const isNight = hour >= 18 || hour < 6
      document.documentElement.setAttribute('data-theme', isNight ? 'dark' : 'light')
    }

    // Update theme on mount
    updateTheme()

    // Update theme every minute
    const interval = setInterval(updateTheme, 60000)

    // Cleanup interval on unmount
    return () => clearInterval(interval)
  }, [])

  return null
} 