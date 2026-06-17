'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import StructuredData from './components/StructuredData'
import Modal from './components/Modal'
import SocialBar from './components/SocialBar'

// Temporarily hide the blog (Notes & Writings section + hero CTA).
// Set back to true to restore. No content is deleted.
const SHOW_BLOG = false

interface NoteData {
  id: string
  title: string
  date: string
  excerpt: string
  category: string
}

interface HomeClientProps {
  notesData: NoteData[]
}

// Fade in on scroll hook
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, isVisible } = useFadeIn()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

export default function HomeClient({ notesData }: HomeClientProps) {
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const postsPerPage = 5

  const filteredPosts = useMemo(
    () => (selectedCategory ? notesData.filter(post => post.category === selectedCategory) : notesData),
    [notesData, selectedCategory]
  )

  const totalPosts = filteredPosts.length
  const totalPages = Math.ceil(totalPosts / postsPerPage)

  const currentPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage
    return filteredPosts.slice(startIndex, startIndex + postsPerPage)
  }, [currentPage, filteredPosts])

  const categories = useMemo(() => {
    const categoriesMap = notesData.reduce((acc, post) => {
      if (!acc[post.category]) {
        acc[post.category] = []
      }
      acc[post.category].push(post)
      return acc
    }, {} as Record<string, NoteData[]>)

    return Object.entries(categoriesMap)
      .map(([name, posts]) => ({
        name,
        count: posts.length,
      }))
      .sort((a, b) => b.count - a.count)
  }, [notesData])

  return (
    <main className="min-h-screen flex flex-col bg-[#FAFAF9]"
          style={{ fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif' }}>
      {/* Structured Data */}
      <StructuredData
        type="WebSite"
        data={{
          '@id': 'https://anhnd.com/#website',
          name: 'Anh Nguyen',
          description: 'Personal site of Anh Nguyen — engineer, builder, and writer. Notes on engineering, management, and building things.',
          url: 'https://anhnd.com',
          author: { '@id': 'https://anhnd.com/#person' },
        }}
      />
      <StructuredData
        type="Person"
        data={{
          '@id': 'https://anhnd.com/#person',
          name: 'Anh Nguyen',
          url: 'https://anhnd.com',
          jobTitle: 'Technical Manager & Solo Founder',
          description: 'Engineer and builder. I build products, lead small teams, and write about what I learn along the way.',
          alumniOf: 'Hanoi University of Science and Technology',
          sameAs: ['https://github.com/anhnd']
        }}
      />

      {/* Hero Section */}
      <section
        aria-label="Introduction"
        className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 overflow-hidden"
      >
        {/* Subtle background dot pattern */}
        <div className="absolute inset-0 dot-pattern opacity-[0.4]" aria-hidden="true" />

        {/* Subtle gradient orb */}
        <div
          className="absolute top-1/4 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #FF5F00 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        <header className="max-w-3xl mx-auto w-full relative z-10">
          <FadeIn className="text-center">
            {/* Small greeting */}
            <p className="text-sm sm:text-base text-[#8A8886] font-light tracking-wide mb-6" style={{ fontWeight: 300 }}>
              Hello, I'm
            </p>

            {/* Name */}
            <h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-[#1A1A1A] leading-[0.95] mb-6"
              style={{ fontWeight: 300, letterSpacing: '-0.04em' }}
            >
              Anh<br />
              <span className="text-[#FF5F00]">Nguyen</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.15} className="text-center">
            {/* Tagline */}
            <p className="text-base sm:text-lg text-[#605E5C] font-light max-w-xl mx-auto mb-8 leading-relaxed" style={{ fontWeight: 300 }}>
              I build products, lead small teams, and write about
              <br className="hidden sm:block" />
              {' '}what I learn along the way.
            </p>

            {/* Minimal tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {['Big Data', 'AI/ML', 'Full-stack', 'Applied Math'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 text-xs font-light text-[#605E5C] border border-[#E1DFDD] rounded-full hover:border-[#FF5F00] hover:text-[#FF5F00] transition-colors"
                  style={{ fontWeight: 400 }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.3} className="text-center">
            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              {SHOW_BLOG && (
                <a
                  href="#writings"
                  onClick={(e) => {
                    e.preventDefault()
                    setSelectedCategory(null)
                    document.getElementById('writings')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                  className="inline-flex items-center gap-2 px-7 py-3 bg-[#1A1A1A] text-white text-sm hover:bg-[#333] transition-colors rounded-lg"
                  style={{ fontWeight: 500 }}
                >
                  Read my notes
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                  </svg>
                </a>
              )}

              <button
                onClick={() => setIsAboutOpen(true)}
                className="inline-flex items-center gap-2 px-7 py-3 text-sm text-[#605E5C] hover:text-[#1A1A1A] transition-colors"
                style={{ fontWeight: 400 }}
              >
                About me
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </button>
            </div>
          </FadeIn>
        </header>
      </section>

      {/* Writings Section */}
      {SHOW_BLOG && (
      <section
        id="writings"
        aria-labelledby="writings-heading"
        className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-white scroll-mt-8"
      >
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2
              id="writings-heading"
              className="text-2xl sm:text-3xl font-light text-[#1A1A1A] mb-2"
              style={{ fontWeight: 400, letterSpacing: '-0.02em' }}
            >
              Notes & Writings
            </h2>
            <p className="text-sm text-[#8A8886] font-light mb-10" style={{ fontWeight: 300 }}>
              Thoughts on engineering, management, and building things.
            </p>
          </FadeIn>

          {/* Category pills */}
          {categories.length > 0 && (
            <FadeIn delay={0.1}>
              <div className="flex flex-wrap gap-2 mb-10">
                <button
                  onClick={() => { setSelectedCategory(null); setCurrentPage(1) }}
                  className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                    !selectedCategory
                      ? 'bg-[#1A1A1A] text-white'
                      : 'bg-[#F3F2F1] text-[#605E5C] hover:bg-[#E8E6E3]'
                  }`}
                  style={{ fontWeight: 500 }}
                >
                  All ({notesData.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => { setSelectedCategory(cat.name); setCurrentPage(1) }}
                    className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                      selectedCategory === cat.name
                        ? 'bg-[#FF5F00] text-white'
                        : 'bg-[#F3F2F1] text-[#605E5C] hover:bg-[#E8E6E3]'
                    }`}
                    style={{ fontWeight: 500 }}
                  >
                    {cat.name} ({cat.count})
                  </button>
                ))}
              </div>
            </FadeIn>
          )}

          {/* Blog posts */}
          <div className="space-y-0">
            {currentPosts.length === 0 && (
              <p className="text-sm text-[#8A8886] font-light py-12 text-center">
                No notes yet. Stay tuned.
              </p>
            )}

            {currentPosts.map((post, index) => (
              <FadeIn key={post.id} delay={index * 0.05}>
                <article className="group border-b border-[#F0EEEC] last:border-b-0">
                  <Link
                    href={`/notes/${post.id}`}
                    className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-6 sm:py-5 hover:bg-[#FAFAF9] -mx-4 px-4 rounded-lg transition-colors"
                  >
                    {/* Date */}
                    <time
                      dateTime={post.date}
                      className="text-xs text-[#B4B2AF] font-light shrink-0 sm:w-28 tabular-nums"
                      style={{ fontWeight: 300 }}
                    >
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </time>

                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <h3 className="text-base sm:text-lg text-[#1A1A1A] group-hover:text-[#FF5F00] transition-colors leading-snug mb-1.5"
                          style={{ fontWeight: 400 }}>
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-sm text-[#8A8886] font-light leading-relaxed line-clamp-2"
                         style={{ fontWeight: 300 }}>
                        {post.excerpt}
                      </p>

                      {/* Category tag */}
                      <span className="inline-block mt-2 text-[10px] font-medium text-[#FF5F00] uppercase tracking-wider">
                        {post.category}
                      </span>
                    </div>

                    {/* Arrow */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                         className="w-4 h-4 text-[#D1D0CE] group-hover:text-[#FF5F00] transition-colors shrink-0 hidden sm:block self-center" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                </article>
              </FadeIn>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              aria-label="Pagination"
              className="mt-10 flex items-center justify-center gap-1"
            >
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 text-[#8A8886] hover:text-[#1A1A1A] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 text-xs rounded-md transition-colors ${
                    currentPage === page
                      ? 'bg-[#1A1A1A] text-white'
                      : 'text-[#8A8886] hover:text-[#1A1A1A] hover:bg-[#F3F2F1]'
                  }`}
                  style={{ fontWeight: currentPage === page ? 500 : 400 }}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-[#8A8886] hover:text-[#1A1A1A] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </nav>
          )}
        </div>
      </section>
      )}

      {/* Footer */}
      <footer
        role="contentinfo"
        className="py-12 px-4 sm:px-6 md:px-8 border-t border-[#F0EEEC] bg-[#FAFAF9]"
      >
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-[#B4B2AF] font-light" style={{ fontWeight: 300 }}>
            © {new Date().getFullYear()} anhnd.com
          </p>
        </div>
      </footer>

      {/* About Modal */}
      <Modal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        title="About Me"
      >
        <div className="space-y-8 text-[#323130]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/avatar.png"
              alt="Anh Nguyen"
              width={112}
              height={112}
              loading="lazy"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border border-[#F0EEEC] shrink-0 mx-auto sm:mx-0"
            />
            <p className="text-base sm:text-lg leading-relaxed font-light" style={{ fontWeight: 300 }}>
              Hi, I'm <strong style={{ fontWeight: 500 }}>Anh Nguyen</strong> — a Technical Manager and solo founder based in Vietnam. I build products, write about management and engineering, and think a lot about how small teams can do big things.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs uppercase tracking-wider text-[#8A8886] mb-3" style={{ fontWeight: 500 }}>Education</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]" style={{ fontWeight: 500 }}>MSc. Applied Mathematics</p>
                  <p className="text-xs text-[#8A8886]" style={{ fontWeight: 300 }}>HUST, Hanoi</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]" style={{ fontWeight: 500 }}>Engineer, Applied Mathematics and Informatics</p>
                  <p className="text-xs text-[#8A8886]" style={{ fontWeight: 300 }}>HUST, Hanoi</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-wider text-[#8A8886] mb-3" style={{ fontWeight: 500 }}>Focus Areas</h3>
              <ul className="space-y-1.5">
                {['Big Data & AI Engineering', 'Full-stack Development', 'Digital Transformation', 'Product & Team Building'].map(item => (
                  <li key={item} className="text-sm font-light text-[#484644] flex items-center gap-2" style={{ fontWeight: 300 }}>
                    <span className="w-1 h-1 rounded-full bg-[#FF5F00] shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-wider text-[#8A8886] mb-3" style={{ fontWeight: 500 }}>Background</h3>
            <p className="text-sm leading-relaxed font-light text-[#484644]" style={{ fontWeight: 300 }}>
              10+ years across gaming, government tech, and enterprise systems. I enjoy building products that solve real problems — from mobile apps to data platforms. As a solo founder, I wear every hat and learn something new daily.
            </p>
          </div>

          <div className="pt-4 border-t border-[#F0EEEC]">
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
      </Modal>

      {/* Social Bar */}
      <SocialBar />
    </main>
  )
}
