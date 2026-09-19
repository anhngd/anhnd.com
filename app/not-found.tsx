'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <main
      className="min-h-screen bg-page flex items-center justify-center p-4 sm:p-6 md:p-8"
    >
      <div className="max-w-md mx-auto text-center">
        <p className="text-8xl sm:text-9xl font-normal text-line-strong mb-6" style={{ fontWeight: 400 }}>
          404
        </p>
        <h1 className="text-xl sm:text-2xl text-ink mb-3 font-normal" style={{ fontWeight: 600 }}>
          Page not found
        </h1>
        <p className="text-sm text-ink-3 mb-8 font-normal" style={{ fontWeight: 400 }}>
          This page doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-invert text-on-invert text-sm hover:bg-invert-hover transition-colors rounded-lg"
          style={{ fontWeight: 500 }}
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}
