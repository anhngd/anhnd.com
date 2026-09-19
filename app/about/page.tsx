import Nav from '../components/Nav'
import Footer from '../components/Footer'
import StructuredData from '../components/StructuredData'
import { SITE, education, facts, focusAreas } from '@/lib/site'

export default function AboutPage() {
  return (
    <main
      className="min-h-screen flex flex-col bg-[#FAFAF9]"
      style={{ fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif' }}
    >
      <StructuredData
        type="Person"
        data={{
          '@id': `${SITE.url}/#person`,
          name: SITE.name,
          url: `${SITE.url}/about`,
          jobTitle: SITE.role,
          description: SITE.intro,
          alumniOf: 'Hanoi University of Science and Technology',
          sameAs: [SITE.github],
        }}
      />

      <Nav />

      {/* Intro */}
      <section aria-label="Introduction" className="relative px-4 sm:px-6 pt-16 sm:pt-24 pb-14 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-[0.4]" aria-hidden="true" />
        <div
          className="absolute top-0 -left-32 w-[420px] h-[420px] rounded-full opacity-[0.06] blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #FF5F00 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        <div className="max-w-3xl mx-auto relative z-10">
          <p className="text-sm text-[#8A8886] mb-3" style={{ fontWeight: 300 }}>About</p>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl text-[#1A1A1A] leading-[1.05] mb-5"
            style={{ fontWeight: 300, letterSpacing: '-0.03em' }}
          >
            Anh <span className="text-[#FF5F00]">Nguyen</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#605E5C] leading-relaxed max-w-xl" style={{ fontWeight: 300 }}>
            {SITE.intro}
          </p>
        </div>
      </section>

      {/* At a glance */}
      <section aria-label="At a glance" className="bg-white border-y border-[#F0EEEC] px-4 sm:px-6 py-10">
        <dl className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-xs text-[#8A8886] mb-1.5">{fact.label}</dt>
              <dd className="text-base sm:text-lg text-[#1A1A1A] leading-snug" style={{ fontWeight: 400 }}>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Details */}
      <section className="px-4 sm:px-6 py-14 sm:py-20">
        <div className="max-w-3xl mx-auto space-y-14">
          <div>
            <h2 className="text-xs uppercase tracking-wider text-[#8A8886] mb-4" style={{ fontWeight: 500 }}>
              Background
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-[#484644] max-w-2xl" style={{ fontWeight: 300 }}>
              15+ years building across gaming, government tech, and enterprise systems — turning real problems into products, from mobile apps to data platforms. As a solo founder, I wear every hat and learn something new every day.
            </p>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-wider text-[#8A8886] mb-5" style={{ fontWeight: 500 }}>
              Focus areas
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {focusAreas.map((area) => (
                <li key={area.title}>
                  <p className="flex items-center gap-2 text-sm text-[#1A1A1A] mb-1" style={{ fontWeight: 500 }}>
                    <span className="w-1 h-1 rounded-full bg-[#FF5F00] shrink-0" aria-hidden="true" />
                    {area.title}
                  </p>
                  <p className="text-sm text-[#605E5C] leading-relaxed pl-3" style={{ fontWeight: 300 }}>{area.description}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-wider text-[#8A8886] mb-4" style={{ fontWeight: 500 }}>
              Education
            </h2>
            <ul className="space-y-4">
              {education.map((item) => (
                <li key={item.degree}>
                  <p className="text-sm text-[#1A1A1A]" style={{ fontWeight: 500 }}>{item.degree}</p>
                  <p className="text-xs text-[#8A8886]" style={{ fontWeight: 300 }}>{item.school}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8 border-t border-[#F0EEEC]">
            <a
              href={`mailto:${SITE.email}`}
              className="inline-flex items-center gap-2 text-sm text-[#FF5F00] hover:text-[#E55500] transition-colors"
              style={{ fontWeight: 500 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              {SITE.email}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
