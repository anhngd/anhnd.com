'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <main
      className="min-h-screen bg-[#FAFAF9] flex items-center justify-center p-4 sm:p-6 md:p-8"
      style={{ fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif' }}
    >
      <div className="max-w-md mx-auto text-center">
        <p className="text-8xl sm:text-9xl font-light text-[#E1DFDD] mb-6" style={{ fontWeight: 300 }}>
          404
        </p>
        <h1 className="text-xl sm:text-2xl text-[#1A1A1A] mb-3 font-light" style={{ fontWeight: 400 }}>
          Page not found
        </h1>
        <p className="text-sm text-[#8A8886] mb-8 font-light" style={{ fontWeight: 300 }}>
          This page doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1A1A1A] text-white text-sm hover:bg-[#333] transition-colors rounded-lg"
          style={{ fontWeight: 500 }}
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}
