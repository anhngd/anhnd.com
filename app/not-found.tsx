'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-page flex flex-col items-center justify-center px-5 sm:px-6 text-center">
      <p className="text-sm text-ink-3 mb-4 tabular-nums" style={{ fontWeight: 500 }}>
        404
      </p>
      <h1 className="text-3xl sm:text-4xl text-ink mb-3" style={{ fontWeight: 600, letterSpacing: '-0.03em' }}>
        This page doesn&apos;t exist
      </h1>
      <p className="text-base text-ink-2 max-w-sm mb-8" style={{ fontWeight: 400 }}>
        It may have moved, or the link might have a typo. Everything else is still here.
      </p>
      <div className="flex items-center gap-6 text-sm">
        <Link href="/" className="text-ink hover:text-brand-ink transition-colors" style={{ fontWeight: 500 }}>
          Back to home
        </Link>
        <Link href="/tools" className="text-ink-3 hover:text-ink transition-colors">
          Tools
        </Link>
      </div>
    </main>
  )
}
