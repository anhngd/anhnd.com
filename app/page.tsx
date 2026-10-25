import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Section from './components/Section'
import StructuredData from './components/StructuredData'
import { getSortedNotesData } from '@/lib/markdown'
import { SHOW_BLOG, SITE, education, facts, focusAreas } from '@/lib/site'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

const arrowRight = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
  </svg>
)

export default function Home() {
  const latestNotes = SHOW_BLOG ? getSortedNotesData().slice(0, 3) : []

  return (
    <main className="min-h-screen flex flex-col bg-page">
      {/* A personal profile page: ProfilePage wraps the Person it is about. */}
      <StructuredData
        type="ProfilePage"
        data={{
          '@id': `${SITE.url}/#profilepage`,
          url: SITE.url,
          name: `${SITE.name} — personal profile`,
          isPartOf: { '@id': `${SITE.url}/#website` },
          mainEntity: { '@id': `${SITE.url}/#person` },
          inLanguage: 'en',
        }}
      />
      <StructuredData
        type="WebSite"
        data={{
          '@id': `${SITE.url}/#website`,
          name: SITE.name,
          alternateName: 'AnhND',
          description: SITE.intro,
          url: SITE.url,
          inLanguage: 'en',
          publisher: { '@id': `${SITE.url}/#person` },
        }}
      />
      <StructuredData
        type="Person"
        data={{
          '@id': `${SITE.url}/#person`,
          name: SITE.name,
          alternateName: 'AnhND',
          givenName: 'Anh',
          familyName: 'Nguyen',
          url: SITE.url,
          mainEntityOfPage: { '@id': `${SITE.url}/#profilepage` },
          description: SITE.intro,
          image: `${SITE.url}${SITE.image}`,
          email: `mailto:${SITE.email}`,
          address: {
            '@type': 'PostalAddress',
            addressLocality: SITE.city,
            addressCountry: SITE.country,
          },
          alumniOf: {
            '@type': 'CollegeOrUniversity',
            name: SITE.university.name,
            url: SITE.university.url,
          },
          knowsAbout: focusAreas.map((area) => area.title),
          sameAs: [SITE.github, SITE.my],
        }}
      />

      <Nav />

      {/* Masthead */}
      <section aria-label="Introduction" className="relative px-5 sm:px-6">
        <div className="aurora" aria-hidden="true" />

        <header className="max-w-4xl mx-auto relative pt-24 sm:pt-32 pb-16 sm:pb-20">
          <h1
            className="text-ink leading-[1.02] mb-6"
            style={{ fontSize: 'clamp(2.75rem, 7vw, 4.5rem)', fontWeight: 600, letterSpacing: '-0.04em' }}
          >
            Anh Nguyen
          </h1>
          <p
            className="text-ink-2 leading-[1.45] max-w-[34ch]"
            style={{ fontSize: 'clamp(1.25rem, 2.6vw, 1.75rem)', fontWeight: 400, letterSpacing: '-0.015em' }}
          >
            {SITE.intro}
          </p>

          <a
            href={`mailto:${SITE.email}`}
            className="mt-9 inline-flex items-center gap-1.5 pb-0.5 text-sm text-ink border-b border-line-strong hover:text-brand-ink hover:border-brand transition-colors"
            style={{ fontWeight: 500 }}
          >
            {SITE.email}
            {arrowRight}
          </a>
        </header>
      </section>

      {/* 01 — Profile */}
      <Section id="profile" index="01" title="Profile">
        <dl className="grid grid-cols-2 gap-x-10 gap-y-7">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-xs text-ink-3 mb-1.5" style={{ fontWeight: 400 }}>{fact.label}</dt>
              <dd className="text-[15px] text-ink leading-snug" style={{ fontWeight: 500 }}>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* 02 — Background */}
      <Section id="background" index="02" title="Background">
        <div className="space-y-4 text-base text-ink-2 leading-[1.75] max-w-[66ch]" style={{ fontWeight: 400 }}>
          <p>
            15+ years building across gaming, government tech and enterprise systems — turning real problems into
            products, from mobile apps to data platforms.
          </p>
          <p>
            I work best with lean teams: a few people who own the whole problem, ship early, and keep the feedback loop
            short. As a solo founder I wear every hat, which keeps me honest about what actually matters.
          </p>
        </div>
      </Section>

      {/* 03 — What I do */}
      <Section id="what-i-do" index="03" title="What I do">
        <dl className="divide-y divide-line">
          {focusAreas.map((area, index) => (
            <div key={area.title} className={index === 0 ? 'pb-5' : 'py-5 last:pb-0'}>
              <dt className="text-[15px] text-ink mb-1.5" style={{ fontWeight: 500 }}>{area.title}</dt>
              <dd className="text-sm text-ink-2 leading-relaxed max-w-[62ch]" style={{ fontWeight: 400 }}>
                {area.description}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* 04 — Education */}
      <Section id="education" index="04" title="Education">
        <dl className="divide-y divide-line">
          {education.map((item, index) => (
            <div
              key={item.degree}
              className={`flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-8 ${index === 0 ? 'pb-5' : 'py-5 last:pb-0'}`}
            >
              <dt className="text-[15px] text-ink" style={{ fontWeight: 500 }}>{item.degree}</dt>
              <dd className="text-sm text-ink-3 shrink-0" style={{ fontWeight: 400 }}>{item.school}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Writing (only when the blog is enabled) */}
      {SHOW_BLOG && latestNotes.length > 0 && (
        <Section id="writing" index="05" title="Writing">
          <ul className="divide-y divide-line">
            {latestNotes.map((note, index) => (
              <li key={note.id}>
                <Link
                  href={`/notes/${note.id}`}
                  className={`group flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 ${index === 0 ? 'pb-5' : 'py-5'}`}
                >
                  <time dateTime={note.date} className="text-xs text-ink-3 sm:w-28 shrink-0 tabular-nums" style={{ fontWeight: 400 }}>
                    {new Date(note.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </time>
                  <span className="text-[15px] text-ink group-hover:text-brand-ink transition-colors" style={{ fontWeight: 500 }}>
                    {note.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Contact */}
      <Section id="contact" index={SHOW_BLOG && latestNotes.length > 0 ? '06' : '05'} title="Contact">
        <p className="text-base text-ink-2 leading-relaxed max-w-[62ch] mb-5" style={{ fontWeight: 400 }}>
          Building something, or want to compare notes on leading lean teams? I answer every email.
        </p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
          <a
            href={`mailto:${SITE.email}`}
            className="inline-flex items-center gap-1.5 pb-0.5 text-ink border-b border-line-strong hover:text-brand-ink hover:border-brand transition-colors"
            style={{ fontWeight: 500 }}
          >
            {SITE.email}
            {arrowRight}
          </a>
          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-3 hover:text-ink transition-colors"
          >
            GitHub
          </a>
        </div>
      </Section>

      <Footer />
    </main>
  )
}
