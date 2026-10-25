import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Section from '../components/Section'
import ToolIcon from '../components/ToolIcon'
import { SITE, toolCategories, tools } from '@/lib/site'

const description = 'Small free developer, network and security utilities by Anh Nguyen. Nearly everything runs in your browser.'

export const metadata: Metadata = {
  title: 'Tools',
  description,
  alternates: { canonical: `${SITE.url}/tools` },
  openGraph: {
    title: 'Tools — Anh Nguyen',
    description,
    url: `${SITE.url}/tools`,
    siteName: SITE.name,
    type: 'website',
    locale: 'en_US',
    images: [{ url: `${SITE.url}/og-image.png`, width: 1200, height: 630, alt: 'Tools — Anh Nguyen', type: 'image/png' }],
  },
  twitter: { card: 'summary_large_image', title: 'Tools — Anh Nguyen', description, images: [`${SITE.url}/og-image.png`] },
}

export default function ToolsPage() {
  return (
    <main className="min-h-screen flex flex-col bg-page">
      <Nav />

      {/* Masthead */}
      <section className="relative px-5 sm:px-6">
        <div className="aurora" aria-hidden="true" />

        <div className="max-w-4xl mx-auto relative pt-20 sm:pt-28 pb-14 sm:pb-16">
          <h1
            className="text-ink leading-[1.05] mb-5"
            style={{ fontSize: 'clamp(2.25rem, 5.5vw, 3.5rem)', fontWeight: 600, letterSpacing: '-0.035em' }}
          >
            Tools
          </h1>
          <p className="text-lg text-ink-2 leading-[1.6] max-w-[56ch]" style={{ fontWeight: 400 }}>
            Small utilities I built because I wanted them. Free, no sign-up, and nearly everything runs in your
            browser — My IP is the exception, since it has to ask a lookup service.
          </p>
        </div>
      </section>

      {toolCategories.map((category, index) => (
        <Section
          key={category}
          id={`category-${category.toLowerCase()}`}
          index={String(index + 1).padStart(2, '0')}
          title={category}
        >
          <ul className="divide-y divide-line">
            {tools
              .filter((tool) => tool.category === category)
              .map((tool, toolIndex) => (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    className={`group flex items-center gap-4 ${toolIndex === 0 ? 'pb-4' : 'py-4 last:pb-0'}`}
                  >
                    <ToolIcon name={tool.icon} tint={tool.tint} size={32} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] text-ink group-hover:text-brand-ink transition-colors" style={{ fontWeight: 500 }}>
                        {tool.name}
                      </span>
                      <span className="block text-sm text-ink-3 leading-relaxed" style={{ fontWeight: 400 }}>
                        {tool.description}
                      </span>
                    </span>
                    <span className="text-ink-4 group-hover:text-brand-ink transition-colors shrink-0" aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
          </ul>
        </Section>
      ))}

      <section className="border-t border-line px-5 sm:px-6">
        <p className="max-w-4xl mx-auto py-10 text-sm text-ink-3 leading-relaxed" style={{ fontWeight: 400 }}>
          Missing something you need every week?{' '}
          <a href={`mailto:${SITE.email}`} className="text-ink hover:text-brand-ink transition-colors">
            Tell me
          </a>{' '}
          — that is where most of these came from.
        </p>
      </section>

      <Footer />
    </main>
  )
}
