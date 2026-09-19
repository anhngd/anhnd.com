import Link from 'next/link'
import Nav from './components/Nav'
import Footer from './components/Footer'
import FadeIn from './components/FadeIn'
import StructuredData from './components/StructuredData'
import { getSortedNotesData } from '@/lib/markdown'
import { SHOW_BLOG, SITE, facts, focusAreas, tools } from '@/lib/site'

const arrowRight = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
  </svg>
)

export default function Home() {
  const latestNotes = SHOW_BLOG ? getSortedNotesData().slice(0, 3) : []

  return (
    <main
      className="min-h-screen flex flex-col bg-[#FAFAF9]"
      style={{ fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif' }}
    >
      <StructuredData
        type="WebSite"
        data={{
          '@id': `${SITE.url}/#website`,
          name: SITE.name,
          description: 'Personal site of Anh Nguyen — technical manager, solo founder, and builder of small useful tools.',
          url: SITE.url,
          author: { '@id': `${SITE.url}/#person` },
        }}
      />
      <StructuredData
        type="Person"
        data={{
          '@id': `${SITE.url}/#person`,
          name: SITE.name,
          url: SITE.url,
          jobTitle: SITE.role,
          description: SITE.intro,
          alumniOf: 'Hanoi University of Science and Technology',
          sameAs: [SITE.github],
        }}
      />

      <Nav />

      {/* Hero */}
      <section aria-label="Introduction" className="relative overflow-hidden px-4 sm:px-6 pt-20 sm:pt-28 pb-16 sm:pb-24">
        <div className="absolute inset-0 dot-pattern opacity-[0.4]" aria-hidden="true" />
        <div
          className="absolute top-10 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.07] blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #FF5F00 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        <header className="max-w-3xl mx-auto relative z-10">
          <FadeIn>
            <p className="text-xs sm:text-sm uppercase tracking-[0.18em] text-[#8A8886] mb-6" style={{ fontWeight: 500 }}>
              Technical Manager · Solo Founder · Vietnam
            </p>
            <h1
              className="text-5xl sm:text-7xl md:text-8xl text-[#1A1A1A] leading-[0.95] mb-8"
              style={{ fontWeight: 300, letterSpacing: '-0.04em' }}
            >
              Anh <span className="text-[#FF5F00]">Nguyen</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.12}>
            <p className="text-lg sm:text-xl text-[#605E5C] max-w-xl leading-relaxed mb-10" style={{ fontWeight: 300 }}>
              I build products, lead small teams, and think a lot about how small teams can do big things.
            </p>
          </FadeIn>

          <FadeIn delay={0.24}>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-[#1A1A1A] text-white text-sm hover:bg-[#333] transition-colors rounded-lg"
                style={{ fontWeight: 500 }}
              >
                About me
                {arrowRight}
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 text-sm text-[#605E5C] hover:text-[#1A1A1A] border border-[#E1DFDD] hover:border-[#1A1A1A] transition-colors rounded-lg"
                style={{ fontWeight: 400 }}
              >
                Try the tools
              </Link>
            </div>
          </FadeIn>
        </header>
      </section>

      {/* At a glance */}
      <section aria-label="At a glance" className="bg-white border-y border-[#F0EEEC] px-4 sm:px-6 py-10">
        <dl className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-xs text-[#8A8886] mb-1.5" style={{ fontWeight: 400 }}>{fact.label}</dt>
              <dd className="text-base sm:text-lg text-[#1A1A1A] leading-snug" style={{ fontWeight: 400 }}>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* What I do */}
      <section aria-labelledby="what-i-do" className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 id="what-i-do" className="text-2xl sm:text-3xl text-[#1A1A1A] mb-2" style={{ fontWeight: 400, letterSpacing: '-0.02em' }}>
              What I do
            </h2>
            <p className="text-sm text-[#8A8886] mb-10" style={{ fontWeight: 300 }}>
              15+ years across gaming, government tech, and enterprise systems.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {focusAreas.map((area, index) => (
              <FadeIn key={area.title} delay={index * 0.06}>
                <div className="h-full p-6 bg-white border border-[#F0EEEC] rounded-xl hover:border-[#E1DFDD] transition-colors">
                  <span className="block w-6 h-0.5 bg-[#FF5F00] mb-5" aria-hidden="true" />
                  <h3 className="text-base text-[#1A1A1A] mb-2" style={{ fontWeight: 500 }}>{area.title}</h3>
                  <p className="text-sm text-[#605E5C] leading-relaxed" style={{ fontWeight: 300 }}>{area.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section aria-labelledby="tools-heading" className="px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 id="tools-heading" className="text-2xl sm:text-3xl text-[#1A1A1A] mb-2" style={{ fontWeight: 400, letterSpacing: '-0.02em' }}>
                  Tools
                </h2>
                <p className="text-sm text-[#8A8886]" style={{ fontWeight: 300 }}>
                  Small developer and security utilities I built for myself. Free, and everything runs in your browser.
                </p>
              </div>
              <Link href="/tools" className="hidden sm:inline-flex items-center gap-1.5 text-sm text-[#605E5C] hover:text-[#FF5F00] transition-colors shrink-0">
                All tools
                {arrowRight}
              </Link>
            </div>
          </FadeIn>

          {tools
            .filter((tool) => tool.featured)
            .map((tool) => (
              <FadeIn key={tool.href} delay={0.08}>
                <Link
                  href={tool.href}
                  className="group block p-6 sm:p-8 bg-[#1A1A1A] rounded-2xl text-white hover:bg-[#242424] transition-colors"
                >
                  <span className="inline-block px-2.5 py-1 mb-5 text-[10px] uppercase tracking-wider bg-[#FF5F00] text-white rounded-full" style={{ fontWeight: 500 }}>
                    Featured
                  </span>
                  <h3 className="text-xl sm:text-2xl mb-2" style={{ fontWeight: 400, letterSpacing: '-0.01em' }}>{tool.name}</h3>
                  <p className="text-sm sm:text-base text-[#B4B2AF] leading-relaxed max-w-lg mb-6" style={{ fontWeight: 300 }}>
                    {tool.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm text-[#FF5F00] group-hover:gap-3 transition-all" style={{ fontWeight: 500 }}>
                    Open tool
                    {arrowRight}
                  </span>
                </Link>
              </FadeIn>
            ))}

          <FadeIn delay={0.12}>
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tools
                .filter((tool) => !tool.featured)
                .map((tool) => (
                  <li key={tool.href}>
                    <Link
                      href={tool.href}
                      className="group flex items-center justify-between gap-3 px-5 py-4 bg-white border border-[#F0EEEC] rounded-xl hover:border-[#FF5F00] transition-colors"
                    >
                      <span className="text-sm text-[#1A1A1A] group-hover:text-[#FF5F00] transition-colors" style={{ fontWeight: 400 }}>
                        {tool.name}
                      </span>
                      <span className="text-[#B4B2AF] group-hover:text-[#FF5F00] transition-colors" aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      {/* Latest notes (only when the blog is enabled) */}
      {SHOW_BLOG && latestNotes.length > 0 && (
        <section aria-labelledby="notes-heading" className="px-4 sm:px-6 pb-16 sm:pb-24">
          <div className="max-w-3xl mx-auto">
            <h2 id="notes-heading" className="text-2xl sm:text-3xl text-[#1A1A1A] mb-8" style={{ fontWeight: 400, letterSpacing: '-0.02em' }}>
              Latest notes
            </h2>
            <ul>
              {latestNotes.map((note) => (
                <li key={note.id} className="border-b border-[#F0EEEC] last:border-b-0">
                  <Link href={`/notes/${note.id}`} className="group flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-5">
                    <time dateTime={note.date} className="text-xs text-[#B4B2AF] sm:w-28 shrink-0 tabular-nums" style={{ fontWeight: 300 }}>
                      {new Date(note.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </time>
                    <span className="text-base sm:text-lg text-[#1A1A1A] group-hover:text-[#FF5F00] transition-colors" style={{ fontWeight: 400 }}>
                      {note.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Contact */}
      <section aria-labelledby="contact-heading" className="bg-white border-t border-[#F0EEEC] px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 id="contact-heading" className="text-2xl sm:text-3xl text-[#1A1A1A] mb-3" style={{ fontWeight: 400, letterSpacing: '-0.02em' }}>
              Let&apos;s talk
            </h2>
            <p className="text-sm sm:text-base text-[#605E5C] max-w-md leading-relaxed mb-6" style={{ fontWeight: 300 }}>
              Building something, or want to compare notes on leading small teams? Drop me a line.
            </p>
            <a
              href={`mailto:${SITE.email}`}
              className="inline-flex items-center gap-2 text-base text-[#FF5F00] hover:text-[#E55500] transition-colors"
              style={{ fontWeight: 500 }}
            >
              {SITE.email}
              {arrowRight}
            </a>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </main>
  )
}
