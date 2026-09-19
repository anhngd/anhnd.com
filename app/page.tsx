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
      className="min-h-screen flex flex-col bg-page"
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
        <div className="absolute inset-0 dot-pattern dot-fade opacity-70" aria-hidden="true" />
        <div
          className="absolute top-10 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.07] blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--brand) 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        <header className="max-w-3xl mx-auto relative z-10">
          <FadeIn>
            <p className="text-xs sm:text-sm uppercase tracking-[0.18em] text-ink-3 mb-6" style={{ fontWeight: 500 }}>
              Technical Manager · Solo Founder · Vietnam
            </p>
            <h1
              className="text-5xl sm:text-7xl md:text-8xl text-ink leading-[0.95] mb-8"
              style={{ fontWeight: 600, letterSpacing: '-0.04em' }}
            >
              Anh <span className="text-brand-ink">Nguyen</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.12}>
            <p className="text-lg sm:text-xl text-ink-2 max-w-xl leading-relaxed mb-10" style={{ fontWeight: 400 }}>
              I build products, lead small teams, and think a lot about how small teams can do big things.
            </p>
          </FadeIn>

          <FadeIn delay={0.24}>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-invert text-on-invert text-sm hover:bg-invert-hover transition-colors rounded-lg"
                style={{ fontWeight: 500 }}
              >
                About me
                {arrowRight}
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 text-sm text-ink-2 hover:text-ink border border-line-strong hover:border-ink transition-colors rounded-lg"
                style={{ fontWeight: 400 }}
              >
                Try the tools
              </Link>
            </div>
          </FadeIn>
        </header>
      </section>

      {/* At a glance */}
      <section aria-label="At a glance" className="bg-card border-y border-line px-4 sm:px-6 py-10">
        <dl className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-xs text-ink-3 mb-1.5" style={{ fontWeight: 400 }}>{fact.label}</dt>
              <dd className="text-base sm:text-lg text-ink leading-snug" style={{ fontWeight: 400 }}>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* What I do */}
      <section aria-labelledby="what-i-do" className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 id="what-i-do" className="text-2xl sm:text-3xl text-ink mb-2" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
              What I do
            </h2>
            <p className="text-sm text-ink-3 mb-10" style={{ fontWeight: 400 }}>
              15+ years across gaming, government tech, and enterprise systems.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {focusAreas.map((area, index) => (
              <FadeIn key={area.title} delay={index * 0.06}>
                <div className="h-full p-6 bg-card border border-line rounded-xl hover:border-line-strong transition-colors">
                  <span className="block w-6 h-0.5 bg-brand mb-5" aria-hidden="true" />
                  <h3 className="text-base text-ink mb-2" style={{ fontWeight: 500 }}>{area.title}</h3>
                  <p className="text-sm text-ink-2 leading-relaxed" style={{ fontWeight: 400 }}>{area.description}</p>
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
                <h2 id="tools-heading" className="text-2xl sm:text-3xl text-ink mb-2" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
                  Tools
                </h2>
                <p className="text-sm text-ink-3" style={{ fontWeight: 400 }}>
                  Small developer, network and security utilities I built for myself. Free, and nearly everything runs in your browser.
                </p>
              </div>
              <Link href="/tools" className="hidden sm:inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-brand-ink transition-colors shrink-0">
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
                  className="group block p-6 sm:p-8 bg-invert rounded-2xl text-on-invert hover:bg-invert-hover transition-colors"
                >
                  <span className="inline-block px-2.5 py-1 mb-5 text-[10px] uppercase tracking-wider bg-brand text-on-brand rounded-full" style={{ fontWeight: 500 }}>
                    Featured
                  </span>
                  <h3 className="text-xl sm:text-2xl mb-2" style={{ fontWeight: 500, letterSpacing: '-0.01em' }}>{tool.name}</h3>
                  <p className="text-sm sm:text-base text-on-invert-2 leading-relaxed max-w-lg mb-6" style={{ fontWeight: 400 }}>
                    {tool.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm text-brand-on-invert group-hover:gap-3 transition-all" style={{ fontWeight: 500 }}>
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
                      className="group flex items-center justify-between gap-3 px-5 py-4 bg-card border border-line rounded-xl hover:border-brand transition-colors"
                    >
                      <span className="text-sm text-ink group-hover:text-brand-ink transition-colors" style={{ fontWeight: 400 }}>
                        {tool.name}
                      </span>
                      <span className="text-ink-4 group-hover:text-brand-ink transition-colors" aria-hidden="true">→</span>
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
            <h2 id="notes-heading" className="text-2xl sm:text-3xl text-ink mb-8" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
              Latest notes
            </h2>
            <ul>
              {latestNotes.map((note) => (
                <li key={note.id} className="border-b border-line last:border-b-0">
                  <Link href={`/notes/${note.id}`} className="group flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-5">
                    <time dateTime={note.date} className="text-xs text-ink-4 sm:w-28 shrink-0 tabular-nums" style={{ fontWeight: 400 }}>
                      {new Date(note.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </time>
                    <span className="text-base sm:text-lg text-ink group-hover:text-brand-ink transition-colors" style={{ fontWeight: 400 }}>
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
      <section aria-labelledby="contact-heading" className="bg-card border-t border-line px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 id="contact-heading" className="text-2xl sm:text-3xl text-ink mb-3" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
              Let&apos;s talk
            </h2>
            <p className="text-sm sm:text-base text-ink-2 max-w-md leading-relaxed mb-6" style={{ fontWeight: 400 }}>
              Building something, or want to compare notes on leading small teams? Drop me a line.
            </p>
            <a
              href={`mailto:${SITE.email}`}
              className="inline-flex items-center gap-2 text-base text-brand-ink hover:text-brand-hover transition-colors"
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
