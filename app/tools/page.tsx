import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { SITE, toolCategories, tools } from '@/lib/site'

const description = 'Small free developer, network and security utilities by Anh Nguyen. Nearly everything runs in your browser.'

export const metadata: Metadata = {
  title: 'Tools',
  description,
  alternates: { canonical: `${SITE.url}/tools` },
  openGraph: { title: 'Tools — Anh Nguyen', description, url: `${SITE.url}/tools`, siteName: SITE.name, type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Tools — Anh Nguyen', description },
}

export default function ToolsPage() {
  return (
    <main
      className="min-h-screen flex flex-col bg-page"
    >
      <Nav wide />

      <div className="w-full px-4 sm:px-6 pt-12 sm:pt-16 pb-20">
        <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl text-ink mb-3" style={{ fontWeight: 600, letterSpacing: '-0.03em' }}>
            Tools
          </h1>
          <p className="text-base sm:text-lg text-ink-2 leading-relaxed max-w-xl" style={{ fontWeight: 400 }}>
            Small utilities I built because I wanted them. Free, no sign-up, and nearly everything runs in your browser — My IP is the exception, since it has to ask a lookup service.
          </p>
        </header>

        <div className="space-y-12">
          {toolCategories.map((category) => (
            <section key={category} aria-labelledby={`category-${category}`}>
              <h2 id={`category-${category}`} className="text-xs uppercase tracking-wider text-ink-3 mb-4" style={{ fontWeight: 600 }}>
                {category}
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tools
                  .filter((tool) => tool.category === category)
                  .map((tool) => (
                    <li key={tool.href}>
                      <Link
                        href={tool.href}
                        className="group flex flex-col h-full p-6 bg-card border border-line rounded-2xl hover:border-brand transition-colors"
                      >
                        <span className="block w-6 h-0.5 bg-brand mb-5" aria-hidden="true" />
                        <h3 className="text-lg text-ink group-hover:text-brand-ink transition-colors mb-2" style={{ fontWeight: 500 }}>
                          {tool.name}
                        </h3>
                        <p className="text-sm text-ink-2 leading-relaxed mb-6" style={{ fontWeight: 400 }}>
                          {tool.description}
                        </p>
                        <span className="mt-auto text-sm text-ink-3 group-hover:text-brand-ink transition-colors" style={{ fontWeight: 500 }}>
                          Open →
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
        </div>
      </div>

      <Footer wide />
    </main>
  )
}
