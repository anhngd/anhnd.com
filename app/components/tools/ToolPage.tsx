import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '../Nav'
import Footer from '../Footer'
import StructuredData from '../StructuredData'
import ToolIcon from '../ToolIcon'
import { SITE, tools } from '@/lib/site'

export function toolMetadata({ name, description, path }: { name: string; description: string; path: string }): Metadata {
  const url = `${SITE.url}${path}`
  const image = `${SITE.url}/og-image.png`

  return {
    title: name,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${name} — Anh Nguyen`,
      description,
      url,
      siteName: SITE.name,
      type: 'website',
      locale: 'en_US',
      images: [{ url: image, width: 1200, height: 630, alt: `${name} — Anh Nguyen`, type: 'image/png' }],
    },
    twitter: { card: 'summary_large_image', title: `${name} — Anh Nguyen`, description, images: [image] },
  }
}

const lock = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
)

/**
 * Every tool is presented as a macOS window: traffic lights and a title in the
 * chrome, the tool itself in the content area, and the privacy note in a status bar.
 */
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
  const tool = tools.find((entry) => entry.href === path)

  return (
    <main className="min-h-screen flex flex-col bg-page">
      <StructuredData
        type="WebApplication"
        data={{
          name,
          description,
          url: `${SITE.url}${path}`,
          applicationCategory: category,
          operatingSystem: 'Any',
          browserRequirements: 'Requires JavaScript',
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          author: { '@type': 'Person', name: SITE.name, url: SITE.url },
          publisher: { '@type': 'Person', name: SITE.name, url: SITE.url },
        }}
      />
      <StructuredData
        type="BreadcrumbList"
        data={{
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: SITE.name, item: SITE.url },
            { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE.url}/tools` },
            { '@type': 'ListItem', position: 3, name, item: `${SITE.url}${path}` },
          ],
        }}
      />

      <Nav wide />

      <div className="relative w-full px-4 sm:px-6 pt-8 sm:pt-10 pb-16">
        <div className="aurora" aria-hidden="true" />

        <div className="max-w-5xl mx-auto relative">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-3 mb-4 px-1" style={{ fontWeight: 400 }}>
            <Link href="/tools" className="hover:text-brand-ink transition-colors">Tools</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-ink-2" aria-current="page">{name}</span>
          </nav>

          <div className="mac-window">
            {/* Title bar */}
            <div className="mac-titlebar flex items-center gap-2 px-4 h-11">
              <span className="traffic-light traffic-red" aria-hidden="true" />
              <span className="traffic-light traffic-yellow" aria-hidden="true" />
              <span className="traffic-light traffic-green" aria-hidden="true" />
              <p className="flex-1 text-center text-[13px] text-ink-2 truncate px-3 sm:pr-16" style={{ fontWeight: 500 }}>
                {name}
              </p>
              <span className="hidden sm:block w-12" aria-hidden="true" />
            </div>

            {/* Toolbar: the tool's own title and one-line pitch */}
            <header className="flex items-start gap-4 px-5 sm:px-7 py-5 sm:py-6 bg-card border-b border-line">
              {tool && <ToolIcon name={tool.icon} tint={tool.tint} size={48} />}
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl text-ink mb-1.5" style={{ fontWeight: 600, letterSpacing: '-0.03em' }}>
                  {heading ?? name}
                </h1>
                <p className="text-sm sm:text-base text-ink-2 leading-relaxed max-w-2xl" style={{ fontWeight: 400 }}>
                  {tagline}
                </p>
              </div>
            </header>

            {/* Content */}
            <div className="px-4 sm:px-7 py-6 sm:py-7 bg-win">{children}</div>

            {/* Status bar */}
            <p className="mac-statusbar flex items-start gap-2 px-5 sm:px-7 py-3 text-xs text-ink-3 leading-relaxed" style={{ fontWeight: 400 }}>
              <span className="mt-0.5">{lock}</span>
              <span>{note ?? 'Runs entirely in your browser. Nothing you enter is sent to a server, saved, or logged.'}</span>
            </p>
          </div>
        </div>
      </div>

      <Footer wide />
    </main>
  )
}
