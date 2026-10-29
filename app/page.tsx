import type { Metadata } from 'next'
import StructuredData from './components/StructuredData'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  description: `${SITE.statement} — ${SITE.intro}`,
  openGraph: { description: `${SITE.statement} — ${SITE.intro}` },
}

/**
 * The landing page carries one line and nothing else: no nav, no footer, no
 * decoration. Anything added here breaks that, so add it somewhere else.
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-page flex items-center justify-center px-6">
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
          sameAs: [SITE.github, SITE.my],
        }}
      />

      <h1
        className="text-center text-ink text-balance leading-[1.05]"
        style={{ fontSize: 'clamp(2.75rem, 11vw, 7rem)', fontWeight: 600, letterSpacing: '-0.045em' }}
      >
        {SITE.statement}
      </h1>
    </main>
  )
}
