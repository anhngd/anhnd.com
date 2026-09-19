import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '../Nav'
import Footer from '../Footer'
import StructuredData from '../StructuredData'
import { SITE } from '@/lib/site'

export function toolMetadata({ name, description, path }: { name: string; description: string; path: string }): Metadata {
  const url = `${SITE.url}${path}`
  return {
    title: name,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${name} — Anh Nguyen`, description, url, siteName: SITE.name, type: 'website' },
    twitter: { card: 'summary_large_image', title: `${name} — Anh Nguyen`, description },
  }
}

export default function ToolPage({
  name,
  heading,
  tagline,
  description,
  path,
  category = 'DeveloperApplication',
  note,
  children,
}: {
  name: string
  /** Optional styled title; falls back to `name`. */
  heading?: React.ReactNode
  tagline: string
  description: string
  path: string
  category?: 'DeveloperApplication' | 'SecurityApplication' | 'UtilitiesApplication'
  /** Replaces the default privacy line, for tools that must contact an outside service. */
  note?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <main
      className="min-h-screen flex flex-col bg-page"
    >
      <StructuredData
        type="WebApplication"
        data={{
          name,
          description,
          url: `${SITE.url}${path}`,
          applicationCategory: category,
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          author: { '@id': `${SITE.url}/#person` },
        }}
      />

      <Nav wide />

      <div className="w-full px-4 sm:px-6 pt-10 sm:pt-14 pb-20">
        <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-3 mb-4" style={{ fontWeight: 400 }}>
            <Link href="/tools" className="hover:text-brand-ink transition-colors">Tools</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-ink-2" aria-current="page">{name}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl text-ink mb-3" style={{ fontWeight: 600, letterSpacing: '-0.03em' }}>
            {heading ?? name}
          </h1>
          <p className="text-base text-ink-2 leading-relaxed max-w-xl" style={{ fontWeight: 400 }}>
            {tagline}
          </p>
        </header>

        {children}

        <p className="mt-8 text-xs text-ink-3 leading-relaxed px-1" style={{ fontWeight: 400 }}>
          {note ?? 'Runs entirely in your browser. Nothing you enter is sent to a server, saved, or logged.'}
        </p>
        </div>
      </div>

      <Footer wide />
    </main>
  )
}
