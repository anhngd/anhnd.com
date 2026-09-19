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
      className="min-h-screen flex flex-col bg-[#FAFAF9]"
      style={{ fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif' }}
    >
      <Nav wide />

      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-20">
        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl text-[#1A1A1A] mb-3" style={{ fontWeight: 300, letterSpacing: '-0.03em' }}>
            Tools
          </h1>
          <p className="text-base sm:text-lg text-[#605E5C] leading-relaxed max-w-xl" style={{ fontWeight: 300 }}>
            Small utilities I built because I wanted them. Free, no sign-up, and nearly everything runs in your browser — My IP is the exception, since it has to ask a lookup service.
          </p>
        </header>

        <div className="space-y-12">
          {toolCategories.map((category) => (
            <section key={category} aria-labelledby={`category-${category}`}>
              <h2 id={`category-${category}`} className="text-xs uppercase tracking-wider text-[#8A8886] mb-4" style={{ fontWeight: 500 }}>
                {category}
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tools
                  .filter((tool) => tool.category === category)
                  .map((tool) => (
                    <li key={tool.href}>
                      <Link
                        href={tool.href}
                        className="group flex flex-col h-full p-6 bg-white border border-[#F0EEEC] rounded-2xl hover:border-[#FF5F00] transition-colors"
                      >
                        <span className="block w-6 h-0.5 bg-[#FF5F00] mb-5" aria-hidden="true" />
                        <h3 className="text-lg text-[#1A1A1A] group-hover:text-[#FF5F00] transition-colors mb-2" style={{ fontWeight: 400 }}>
                          {tool.name}
                        </h3>
                        <p className="text-sm text-[#605E5C] leading-relaxed mb-6" style={{ fontWeight: 300 }}>
                          {tool.description}
                        </p>
                        <span className="mt-auto text-sm text-[#8A8886] group-hover:text-[#FF5F00] transition-colors" style={{ fontWeight: 500 }}>
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

      <Footer wide />
    </main>
  )
}
