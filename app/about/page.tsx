import Nav from '../components/Nav'
import SocialBar from '../components/SocialBar'
import StructuredData from '../components/StructuredData'

const education = [
  { degree: 'MSc. Applied Mathematics', school: 'HUST, Hanoi' },
  { degree: 'Engineer, Applied Mathematics and Informatics', school: 'HUST, Hanoi' },
]

const focusAreas = [
  'Big Data & AI Engineering',
  'Full-stack Development',
  'Digital Transformation',
  'Product & Team Building',
]

export default function AboutPage() {
  return (
    <main
      className="min-h-screen flex flex-col bg-[#FAFAF9]"
      style={{ fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif' }}
    >
      <StructuredData
        type="Person"
        data={{
          '@id': 'https://anhnd.com/#person',
          name: 'Anh Nguyen',
          url: 'https://anhnd.com/about',
          jobTitle: 'Technical Manager & Solo Founder',
          description: 'Engineer and builder. I build products, lead small teams, and write about what I learn along the way.',
          alumniOf: 'Hanoi University of Science and Technology',
          sameAs: ['https://github.com/anhnd'],
        }}
      />

      <Nav />

      {/* Intro */}
      <section
        aria-label="Introduction"
        className="relative px-4 sm:px-6 md:px-8 pt-16 sm:pt-20 pb-14 sm:pb-16 overflow-hidden"
      >
        <div className="absolute inset-0 dot-pattern opacity-[0.4]" aria-hidden="true" />
        <div
          className="absolute top-0 -left-32 w-[420px] h-[420px] rounded-full opacity-[0.06] blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #FF5F00 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/avatar.png"
              alt="Anh Nguyen"
              width={128}
              height={128}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border border-[#F0EEEC] shrink-0 mx-auto sm:mx-0"
            />
            <div className="text-center sm:text-left">
              <p className="text-sm text-[#8A8886] font-light mb-2" style={{ fontWeight: 300 }}>
                About
              </p>
              <h1
                className="text-3xl sm:text-4xl md:text-5xl text-[#1A1A1A] leading-[1.05] mb-3"
                style={{ fontWeight: 300, letterSpacing: '-0.03em' }}
              >
                Anh <span className="text-[#FF5F00]">Nguyen</span>
              </h1>
              <p className="text-base sm:text-lg text-[#605E5C] font-light leading-relaxed max-w-xl" style={{ fontWeight: 300 }}>
                Technical Manager and solo founder based in Vietnam. I build products, lead small teams, and think a lot about how small teams can do big things.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="px-4 sm:px-6 md:px-8 py-14 sm:py-16 bg-white border-t border-[#F0EEEC]">
        <div className="max-w-3xl mx-auto space-y-12 sm:space-y-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div>
              <h2 className="text-xs uppercase tracking-wider text-[#8A8886] mb-4" style={{ fontWeight: 500 }}>
                Education
              </h2>
              <div className="space-y-4">
                {education.map((item) => (
                  <div key={item.degree}>
                    <p className="text-sm text-[#1A1A1A]" style={{ fontWeight: 500 }}>{item.degree}</p>
                    <p className="text-xs text-[#8A8886]" style={{ fontWeight: 300 }}>{item.school}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xs uppercase tracking-wider text-[#8A8886] mb-4" style={{ fontWeight: 500 }}>
                Focus Areas
              </h2>
              <ul className="space-y-2">
                {focusAreas.map((item) => (
                  <li key={item} className="text-sm text-[#484644] flex items-center gap-2" style={{ fontWeight: 300 }}>
                    <span className="w-1 h-1 rounded-full bg-[#FF5F00] shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-2 border-t border-[#F0EEEC]">
            <h2 className="text-xs uppercase tracking-wider text-[#8A8886] mb-4 mt-10" style={{ fontWeight: 500 }}>
              Background
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-[#484644] max-w-2xl" style={{ fontWeight: 300 }}>
              10+ years across gaming, government tech, and enterprise systems. I enjoy building products that solve real problems — from mobile apps to data platforms. As a solo founder, I wear every hat and learn something new daily.
            </p>
          </div>

          <div className="pt-6 border-t border-[#F0EEEC]">
            <a
              href="mailto:me@anhnd.com"
              className="inline-flex items-center gap-2 text-sm text-[#FF5F00] hover:text-[#E55500] transition-colors"
              style={{ fontWeight: 500 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              me@anhnd.com
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer role="contentinfo" className="mt-auto py-12 px-4 sm:px-6 md:px-8 border-t border-[#F0EEEC] bg-[#FAFAF9]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-[#B4B2AF] font-light" style={{ fontWeight: 300 }}>
            © {new Date().getFullYear()} anhnd.com
          </p>
        </div>
      </footer>

      <SocialBar />
    </main>
  )
}
