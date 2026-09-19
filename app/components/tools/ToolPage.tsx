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
  children,
}: {
  name: string
  /** Optional styled title; falls back to `name`. */
  heading?: React.ReactNode
  tagline: string
  description: string
  path: string
  category?: 'DeveloperApplication' | 'SecurityApplication' | 'UtilitiesApplication'
  children: React.ReactNode
}) {
  return (
    <main
      className="min-h-screen flex flex-col bg-[#FAFAF9]"
      style={{ fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif' }}
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

      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-20">
        <header className="mb-8">
          <nav aria-label="Breadcrumb" className="text-sm text-[#8A8886] mb-4" style={{ fontWeight: 300 }}>
            <Link href="/tools" className="hover:text-[#FF5F00] transition-colors">Tools</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-[#605E5C]" aria-current="page">{name}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl text-[#1A1A1A] mb-3" style={{ fontWeight: 300, letterSpacing: '-0.03em' }}>
            {heading ?? name}
          </h1>
          <p className="text-base text-[#605E5C] leading-relaxed max-w-xl" style={{ fontWeight: 300 }}>
            {tagline}
          </p>
        </header>

        {children}

        <p className="mt-8 text-xs text-[#8A8886] leading-relaxed px-1" style={{ fontWeight: 300 }}>
          Runs entirely in your browser. Nothing you enter is sent to a server, saved, or logged.
        </p>
      </div>

      <Footer wide />
    </main>
  )
}
