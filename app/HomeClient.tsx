'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import StructuredData from './components/StructuredData'
import Modal from './components/Modal'

// Load components only on client-side to avoid SSR issues
const SocialBar = dynamic(() => import('./components/SocialBar'), {
  ssr: false,
})

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

export default function HomeClient({ notesData }: HomeClientProps) {
  const [showContent, setShowContent] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const postsPerPage = 5

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 100)
    }

    handleScroll()
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle scroll to blog section
  const scrollToBlog = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const blogSection = document.getElementById('blog-section')
    if (blogSection) {
      const offset = 80
      const elementPosition = blogSection.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      })
    }
  }

  // Show content after initial animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Filter posts by selected category
  const filteredPosts = selectedCategory 
    ? notesData.filter(post => post.category === selectedCategory)
    : notesData

  const totalPosts = filteredPosts.length
  const totalPages = Math.ceil(totalPosts / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const currentPosts = filteredPosts.slice(startIndex, endIndex)

  // Group posts by category
  const categoriesMap = notesData.reduce((acc, post) => {
    if (!acc[post.category]) {
      acc[post.category] = []
    }
    acc[post.category].push(post)
    return acc
  }, {} as Record<string, NoteData[]>)
  
  const categories = Object.entries(categoriesMap).map(([name, posts]) => ({
    name,
    count: posts.length,
    posts
  })).sort((a, b) => b.count - a.count) // Sort by count descending

  return (
    <main className="min-h-screen flex flex-col"
          style={{ fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif' }}>
      {/* Structured Data */}
      <StructuredData 
        type="WebSite"
        data={{
          '@id': 'https://anhnd.com/#website',
          name: 'AnhND',
          description: 'PERSONAL PAGE OF ANHND - Full-stack Developer, Solo Founder, MSc. in Applied Mathematics',
          url: 'https://anhnd.com',
          author: {
            '@id': 'https://anhnd.com/#person'
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://anhnd.com/search?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        }}
      />
      
      <StructuredData 
        type="Person"
        data={{
          '@id': 'https://anhnd.com/#person',
          name: 'AnhND',
          url: 'https://anhnd.com',
          jobTitle: 'Software Engineer',
          description: 'Full-stack Developer, Solo Founder with expertise in Big Data, AI, and Digital Transformation',
          sameAs: [
            'https://github.com/anhnd'
          ]
        }}
      />

      {/* Hero Section - Professional Layout */}
      <section 
        aria-label="Introduction"
        className={`flex flex-col items-center justify-center transition-all duration-500 px-4 sm:px-6 md:px-8 ${
          isScrolled 
            ? 'min-h-0 py-6 sm:py-8' 
            : 'min-h-screen py-12 sm:py-16 md:py-20'
        }`}
      >
        <header className={`max-w-5xl mx-auto w-full transition-all duration-500 ${
          isScrolled ? 'scale-95 opacity-90' : 'scale-100 opacity-100'
        }`}>
          <div className="text-center">
            {/* Greeting */}
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`transition-all duration-500 mb-3 ${isScrolled ? 'text-sm' : 'text-base sm:text-lg'}`}
            >
              <span className="text-[#484644] font-light" style={{ fontWeight: 300 }}>
                Hello, I'm
              </span>
            </motion.p>

            {/* Name - Large and Bold */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`font-light text-[#201F1E] leading-tight mb-4 transition-all duration-500 ${
                isScrolled 
                  ? 'text-3xl sm:text-4xl' 
                  : 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl'
              }`}
              style={{ fontWeight: 300, letterSpacing: '-0.03em' }}
            >
              Anh <span className="text-[#FF5F00]" aria-label="Nguyen">Nguyen</span>
            </motion.h1>

            {/* Description/Tagline */}
            {!isScrolled && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg md:text-xl text-[#484644] font-light max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed"
                style={{ fontWeight: 300 }}
              >
                <p className="mb-2">
                  Full-stack Developer, Solo Founder, and MSc. in Applied Mathematics
                </p>
                <p className="text-sm sm:text-base text-[#6F6C6A] mt-2">
                  Building scalable systems in Big Data, AI, and Digital Transformation
                </p>
              </motion.div>
            )}

            {/* Expertise Tags */}
            {!isScrolled && showContent && (
              <motion.nav
                aria-label="Areas of expertise"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 sm:mb-12"
              >
                {['Big Data', 'AI/ML', 'Gaming', 'Digital Transformation', 'Applied Mathematics'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-light bg-white border border-[#D1D0CE] text-[#484644] rounded-full hover:border-[#FF5F00] hover:text-[#FF5F00] hover:shadow-sm transition-all duration-200"
                    style={{ fontWeight: 400 }}
                    role="listitem"
                  >
                    {tag}
                  </span>
                ))}
              </motion.nav>
            )}

            {/* CTA Buttons */}
            {!isScrolled && showContent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center mb-10 sm:mb-12"
                role="group"
                aria-label="Call to action buttons"
              >
                <a
                  href="#blog-section"
                  onClick={(e) => {
                    setSelectedCategory(null) // Clear category filter
                    scrollToBlog(e)
                  }}
                  className="group inline-flex items-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 bg-[#FF5F00] text-white hover:bg-[#E55500] focus:outline-none focus:ring-4 focus:ring-[#FF5F00]/30 shadow-md hover:shadow-lg transition-all duration-300 text-base sm:text-lg font-medium rounded-xl w-full sm:w-auto justify-center"
                  style={{ fontWeight: 500 }}
                  aria-label="View my notes and articles"
                >
                  My Notes
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>

                <button
                  onClick={() => setIsAboutOpen(true)}
                  className="group inline-flex items-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 bg-transparent border-2 border-[#201F1E] text-[#201F1E] hover:bg-[#201F1E] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#201F1E]/20 transition-all duration-300 text-base sm:text-lg font-medium rounded-xl w-full sm:w-auto justify-center"
                  style={{ fontWeight: 500 }}
                  aria-label="Learn more about me"
                >
                  About Me
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                  </svg>
                </button>
              </motion.div>
            )}

          </div>
        </header>
      </section>

      {/* Categories Section */}
      <section 
        aria-labelledby="categories-heading"
        className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <h2 id="categories-heading" className="sr-only">Article Categories</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {categories.map((category, index) => (
              <motion.article
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    setSelectedCategory(category.name)
                    setCurrentPage(1)
                    
                    const blogSection = document.getElementById('blog-section')
                    if (blogSection) {
                      const offset = 80
                      const elementPosition = blogSection.getBoundingClientRect().top + window.scrollY
                      window.scrollTo({
                        top: elementPosition - offset,
                        behavior: 'smooth'
                      })
                    }
                  }}
                  className="group w-full h-full text-left bg-[#F5F3F0] hover:bg-[#ECEAE6] rounded-3xl p-6 sm:p-8 lg:p-10 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#201F1E]/10 relative overflow-hidden min-h-[200px] sm:min-h-[240px]"
                >
                  {/* Decorative Icon - Subtle/Faded */}
                  <div className="absolute top-4 right-4 sm:top-6 sm:right-6 opacity-[0.08] group-hover:opacity-[0.12] transition-opacity duration-300">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth={1} 
                      stroke="currentColor" 
                      className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 text-[#1A1A1A]"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                    </svg>
                  </div>

                  {/* Category Title */}
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1A1A1A] mb-3 sm:mb-4 relative z-10 group-hover:text-[#FF5F00] transition-colors duration-300"
                      style={{ fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                    {category.name}
                  </h3>
                  
                  {/* Category Description */}
                  <p className="text-sm sm:text-base lg:text-lg text-[#4A4A4A] font-light leading-relaxed relative z-10" 
                     style={{ fontWeight: 300 }}>
                    {category.count} {category.count === 1 ? 'article' : 'articles'}
                  </p>
                </button>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section 
        id="blog-section" 
        aria-labelledby="blog-heading"
        className="min-h-screen flex flex-col items-center justify-start py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 bg-white"
      >
        <div className="max-w-3xl w-full">
          <h2 id="blog-heading" className="sr-only">Blog Posts</h2>
          
          {/* Category Filter Indicator */}
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 sm:mb-10 flex items-center justify-between bg-[#FFF4ED] border border-[#FF5F00]/20 rounded-xl p-4 sm:p-5"
            >
              <div className="flex items-center gap-3">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="w-5 h-5 text-[#FF5F00] flex-shrink-0"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                </svg>
                <div>
                  <p className="text-sm font-light text-[#6F6C6A]" style={{ fontWeight: 300 }}>
                    Showing articles in
                  </p>
                  <p className="text-base sm:text-lg font-medium text-[#FF5F00]" style={{ fontWeight: 500 }}>
                    {selectedCategory}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory(null)
                  setCurrentPage(1)
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#FF5F00] hover:bg-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5F00]/30"
                style={{ fontWeight: 500 }}
                aria-label="Clear category filter"
              >
                Clear
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          )}
          
          {/* Blog posts list */}
          <div className="space-y-8 sm:space-y-10">
            {currentPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group border-b border-[#E1DFDD] pb-6 sm:pb-8 last:border-b-0 hover:border-[#C8C6C4] transition-colors"
              >
                <Link href={`/notes/${post.id}`} className="block focus:outline-none focus:ring-4 focus:ring-[#FF5F00]/20 rounded-lg -m-2 p-2">
                  {/* Category and Date */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <span className="text-xs font-medium text-[#FF5F00] uppercase tracking-wider bg-[#FFF4ED] px-2 py-1 rounded">
                      {post.category}
                    </span>
                    <time 
                      dateTime={post.date}
                      className="text-xs text-[#6F6C6A] font-light"
                      style={{ fontWeight: 300 }}
                    >
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </time>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-light text-[#201F1E] mb-3 sm:mb-4 group-hover:text-[#FF5F00] transition-colors duration-200 leading-tight"
                      style={{ fontWeight: 400, letterSpacing: '-0.01em' }}>
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm sm:text-base text-[#484644] font-light leading-relaxed" 
                     style={{ fontWeight: 300 }}>
                    {post.excerpt}
                  </p>
                  
                  {/* Read more indicator */}
                  <span className="inline-flex items-center mt-4 text-sm text-[#FF5F00] font-medium group-hover:gap-2 transition-all">
                    Read article
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </Link>
              </motion.article>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <nav 
              aria-label="Blog posts pagination"
              className="mt-12 flex items-center justify-center gap-2"
            >
              {/* Previous button */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-[#D1D0CE] text-[#201F1E] hover:bg-[#F3F2F1] focus:ring-4 focus:ring-[#201F1E]/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                aria-label="Go to previous page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`min-w-[40px] h-10 px-4 rounded-lg font-medium text-sm transition-all duration-200 focus:ring-4 ${
                    currentPage === page
                      ? 'bg-[#FF5F00] text-white shadow-md focus:ring-[#FF5F00]/30'
                      : 'border border-[#D1D0CE] text-[#201F1E] hover:bg-[#F3F2F1] focus:ring-[#201F1E]/10'
                  }`}
                  style={{ fontWeight: currentPage === page ? 500 : 400 }}
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              ))}
              
              {/* Next button */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-[#D1D0CE] text-[#201F1E] hover:bg-[#F3F2F1] focus:ring-4 focus:ring-[#201F1E]/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                aria-label="Go to next page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </nav>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer 
        role="contentinfo"
        className="bg-[#201F1E] text-white py-8 sm:py-12 px-4 sm:px-6 md:px-8 border-t border-[#323130]"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 text-center">
          <p className="text-xl sm:text-2xl font-light mb-2" style={{ fontWeight: 300 }}>
            anhnd.com
          </p>
          <p className="text-[#C8C6C4] font-light text-sm sm:text-base mb-4" style={{ fontWeight: 300 }}>
            PERSONAL PAGE OF ANHND
          </p>
          <p className="text-[#8A8886] text-xs sm:text-sm">
            © {new Date().getFullYear()} AnhND. All rights reserved.
          </p>
        </div>
      </footer>

      {/* About Modal */}
      <Modal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        title="About Me"
      >
        <div className="space-y-6 text-[#323130]">
          <p className="text-base sm:text-lg leading-relaxed font-light" style={{ fontWeight: 300 }}>
            Hi, I'm <strong style={{ fontWeight: 500 }}>AnhND</strong> - a passionate technologist with expertise in Big Data, AI, and Full-stack Development.
          </p>

          <div>
            <h3 className="font-medium text-lg sm:text-xl mb-3 text-[#201F1E]" style={{ fontWeight: 500 }}>Education</h3>
            <div className="space-y-3">
              <div className="pl-4 border-l-2 border-[#FF5F00]">
                <p className="font-medium text-base text-[#201F1E]" style={{ fontWeight: 500 }}>
                  MSc. in Applied Mathematics
                </p>
                <p className="text-sm text-[#605E5C] font-light mt-1" style={{ fontWeight: 300 }}>
                  Hanoi University of Science and Technology (HUST)
                </p>
                <p className="text-xs text-[#8A8886] font-light mt-1" style={{ fontWeight: 300 }}>
                  Focus: Mathematical modeling, optimization, and computational methods
                </p>
              </div>
              <div className="pl-4 border-l-2 border-[#D1D0CE]">
                <p className="font-medium text-base text-[#201F1E]" style={{ fontWeight: 500 }}>
                  Engineer in Computer Science
                </p>
                <p className="text-sm text-[#605E5C] font-light mt-1" style={{ fontWeight: 300 }}>
                  Hanoi University of Science and Technology (HUST)
                </p>
                <p className="text-xs text-[#8A8886] font-light mt-1" style={{ fontWeight: 300 }}>
                  Foundation in software engineering and algorithm design
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg sm:text-xl mb-3 text-[#201F1E]" style={{ fontWeight: 500 }}>What I Do</h3>
            <ul className="space-y-2" role="list">
              <li className="flex items-start text-sm sm:text-base font-light" style={{ fontWeight: 300 }}>
                <span className="text-[#FF5F00] mr-3 flex-shrink-0" aria-hidden="true">▪</span>
                <span>Big Data & AI Engineering</span>
              </li>
              <li className="flex items-start text-sm sm:text-base font-light" style={{ fontWeight: 300 }}>
                <span className="text-[#FF5F00] mr-3 flex-shrink-0" aria-hidden="true">▪</span>
                <span>Full-stack Web Development</span>
              </li>
              <li className="flex items-start text-sm sm:text-base font-light" style={{ fontWeight: 300 }}>
                <span className="text-[#FF5F00] mr-3 flex-shrink-0" aria-hidden="true">▪</span>
                <span>Digital Transformation Consulting</span>
              </li>
              <li className="flex items-start text-sm sm:text-base font-light" style={{ fontWeight: 300 }}>
                <span className="text-[#FF5F00] mr-3 flex-shrink-0" aria-hidden="true">▪</span>
                <span>Gaming Industry Innovation</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg sm:text-xl mb-3 text-[#201F1E]" style={{ fontWeight: 500 }}>Experience</h3>
            <p className="text-sm sm:text-base leading-relaxed font-light" style={{ fontWeight: 300 }}>
              With <strong style={{ fontWeight: 500 }}>10+ years of experience</strong>, I've worked across various industries including gaming, government tech, and enterprise systems. 
              As a solo founder and developer, I enjoy building products that solve real problems and deliver meaningful impact.
            </p>
          </div>

          <div className="pt-4 border-t border-[#E1DFDD] space-y-3">
            <div>
              <h3 className="font-medium text-base sm:text-lg mb-2 text-[#201F1E]" style={{ fontWeight: 500 }}>Get in Touch</h3>
              <a 
                href="mailto:me@anhnd.com" 
                className="inline-flex items-center gap-2 text-sm sm:text-base text-[#FF5F00] hover:text-[#E55500] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5F00]/30 rounded px-1 -ml-1"
                style={{ fontWeight: 500 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                me@anhnd.com
              </a>
            </div>
            <p className="text-sm text-[#605E5C] font-light" style={{ fontWeight: 300 }}>
              Feel free to connect with me through email or the social links above!
            </p>
          </div>
        </div>
      </Modal>

      {/* Social Bar with Theme Switch - Fixed Position */}
      <SocialBar />
    </main>
  )
}
