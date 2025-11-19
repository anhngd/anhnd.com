'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

type Note = {
  id: string
  title: string
  date: string
  excerpt: string
  category: string
  content: string
}

function NotFoundUI() {
  return (
    <main className="min-h-screen py-12 sm:py-16 px-4 sm:px-6 md:px-8 bg-white"
          style={{ fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif' }}>
      <div className="max-w-3xl mx-auto text-center">
        <Link href="/" className="inline-flex items-center mb-8 sm:mb-12 text-[#605E5C] hover:text-[#323130] transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span className="text-sm font-light" style={{ fontWeight: 300 }}>Home</span>
        </Link>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl text-[#323130] mb-4 sm:mb-6 font-light" style={{ fontWeight: 300 }}>
          Note Not Found
        </h1>
        <p className="text-base sm:text-lg text-[#605E5C] mb-6 sm:mb-8 leading-relaxed font-light px-4" style={{ fontWeight: 300 }}>
          This note doesn't exist or hasn't been published yet.
        </p>
        <Link href="/" className="inline-flex items-center px-6 py-3 border border-[#E1DFDD] text-[#323130] text-sm hover:bg-[#F3F2F1] transition-colors font-light" style={{ fontWeight: 300 }}>
          Return to Home
        </Link>
      </div>
    </main>
  )
}

export default function NoteContent({ note }: { note: Note | null }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
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
  
  // Show loading state until mounted
  if (!mounted) {
    return (
      <main className="min-h-screen bg-white"
            style={{ fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="animate-pulse">
            <div className="h-3 bg-[#E1DFDD] rounded w-20 sm:w-24 mb-4 sm:mb-6"></div>
            <div className="h-10 sm:h-12 bg-[#E1DFDD] rounded w-full mb-3 sm:mb-4"></div>
            <div className="h-10 sm:h-12 bg-[#E1DFDD] rounded w-3/4 mb-6 sm:mb-8"></div>
            <div className="h-4 bg-[#E1DFDD] rounded w-1/3"></div>
          </div>
        </div>
      </main>
    )
  }
  
  // Show not found if note doesn't exist
  if (!note) {
    return <NotFoundUI />
  }

  return (
    <main className="min-h-screen bg-white"
          style={{ fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif' }}>
      {/* Minimal Header - Fixed when scrolled */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/98 backdrop-blur-sm shadow-sm border-b border-[#E1DFDD]' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-5">
          <Link href="/" className="inline-flex items-center text-[#605E5C] hover:text-[#323130] transition-colors group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className="text-sm font-light" style={{ fontWeight: 300 }}>Home</span>
          </Link>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <header className="mb-8 sm:mb-10 md:mb-12">
            {/* Category tag */}
            <div className="mb-4 sm:mb-6">
              <span className="inline-block text-xs font-medium text-[#FF5F00] uppercase tracking-wider">
                {note.category}
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#323130] mb-4 sm:mb-6 font-light leading-tight" 
                style={{ fontWeight: 300, letterSpacing: '-0.01em' }}>
              {note.title}
            </h1>
            
            {/* Meta */}
            <div className="flex items-center gap-3 text-xs text-[#8A8886]">
              <time>
                {new Date(note.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </time>
            </div>
          </header>
          
          {/* Content */}
          <div 
            className="article-content
                       text-[#323130] text-sm sm:text-base md:text-lg leading-relaxed font-light
                       [&>h2]:text-xl [&>h2]:sm:text-2xl [&>h2]:md:text-3xl [&>h2]:font-light [&>h2]:text-[#323130] [&>h2]:mt-8 [&>h2]:sm:mt-10 [&>h2]:md:mt-12 [&>h2]:mb-3 [&>h2]:sm:mb-4 [&>h2]:leading-tight
                       [&>h3]:text-lg [&>h3]:sm:text-xl [&>h3]:md:text-2xl [&>h3]:font-light [&>h3]:text-[#323130] [&>h3]:mt-6 [&>h3]:sm:mt-8 [&>h3]:md:mt-10 [&>h3]:mb-2 [&>h3]:sm:mb-3 [&>h3]:leading-tight
                       [&>p]:mb-4 [&>p]:sm:mb-5 [&>p]:md:mb-6 [&>p]:leading-relaxed
                       [&>ul]:my-4 [&>ul]:sm:my-5 [&>ul]:md:my-6 [&>ul]:space-y-2 [&>ul]:sm:space-y-3
                       [&>li]:pl-0 [&>li]:leading-relaxed
                       [&>strong]:font-medium [&>strong]:text-[#323130]
                       [&>a]:text-[#FF5F00] [&>a]:underline [&>a]:decoration-1 [&>a]:underline-offset-2
                       [&>a:hover]:text-[#EB001B] [&>a:hover]:decoration-2
                       [&>blockquote]:border-l-2 [&>blockquote]:border-[#E1DFDD] [&>blockquote]:pl-4 [&>blockquote]:sm:pl-6 [&>blockquote]:my-6 [&>blockquote]:sm:my-8
                       [&>blockquote]:italic [&>blockquote]:text-[#605E5C]
                       [&>code]:bg-[#F3F2F1] [&>code]:px-1.5 [&>code]:sm:px-2 [&>code]:py-0.5 [&>code]:sm:py-1 [&>code]:rounded [&>code]:text-xs [&>code]:sm:text-sm
                       [&>code]:font-mono [&>code]:text-[#323130]
                       [&>pre]:bg-[#323130] [&>pre]:text-white [&>pre]:p-4 [&>pre]:sm:p-6 [&>pre]:rounded-lg [&>pre]:my-6 [&>pre]:sm:my-8
                       [&>pre]:overflow-x-auto [&>pre]:text-xs [&>pre]:sm:text-sm [&>pre]:leading-relaxed"
            style={{ fontWeight: 300 }}
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
          
          {/* Back to home - Bottom */}
          <div className="mt-12 sm:mt-14 md:mt-16 pt-6 sm:pt-8 border-t border-[#E1DFDD]">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-[#605E5C] hover:text-[#323130] transition-colors group font-light"
              style={{ fontWeight: 300 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to all posts
            </Link>
          </div>
        </motion.div>
      </article>
    </main>
  )
}

