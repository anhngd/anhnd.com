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
    <main className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-[#F8F9FA] to-[#F0F2F5]"
          style={{ fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif' }}>
      <div className="max-w-4xl mx-auto text-center">
        <Link href="/" className="flex items-center justify-center mb-8 text-[#605E5C] hover:text-[#0078D4] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span className="text-base font-light" style={{ fontWeight: 300 }}>Back to Home</span>
        </Link>
        
        <h1 className="text-3xl sm:text-4xl text-[#323130] mb-4 font-light" style={{ fontWeight: 300 }}>
          Note Not Found
        </h1>
        <p className="text-lg text-[#605E5C] mb-8 font-light" style={{ fontWeight: 300 }}>
          No notes are available yet. Check back soon!
        </p>
        <Link href="/" className="inline-flex items-center px-6 py-2.5 rounded-sm border border-[#8A8886] text-[#323130] text-sm font-light hover:bg-[#F3F2F1] transition-colors" style={{ fontWeight: 300 }}>
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
      <main className="min-h-screen bg-gradient-to-br from-white via-[#F8F9FA] to-[#F0F2F5]"
            style={{ fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-[#E1DFDD] rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-[#E1DFDD] rounded w-1/2"></div>
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
    <main className="min-h-screen bg-gradient-to-br from-white via-[#F8F9FA] to-[#F0F2F5]"
          style={{ fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif' }}>
      {/* Header Card - Fixed when scrolled */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-[#E1DFDD]' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center text-[#605E5C] hover:text-[#0078D4] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className={`text-base font-light transition-all duration-300 ${
              isScrolled ? 'text-sm' : ''
            }`} style={{ fontWeight: 300 }}>
              Back to Home
            </span>
          </Link>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <header className="mb-10 pb-8 border-b border-[#E1DFDD]">
            <h1 className="text-4xl sm:text-5xl md:text-6xl text-[#323130] mb-4 font-light leading-tight" style={{ fontWeight: 300, letterSpacing: '-0.02em' }}>
              {note.title}
            </h1>
            <div className="flex justify-between items-center flex-wrap gap-4">
              <time className="text-sm text-[#605E5C] font-light" style={{ fontWeight: 300 }}>
                {new Date(note.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
              
              <div className="text-xs text-[#605E5C] px-3 py-1.5 rounded-sm border border-[#E1DFDD] bg-white font-light" style={{ fontWeight: 300 }}>
                {note.category}
              </div>
            </div>
          </header>
          
          <div 
            className="prose prose-lg max-w-none font-light
                       prose-headings:text-[#323130] prose-headings:font-light prose-headings:tracking-tight
                       prose-p:text-[#323130] prose-p:leading-relaxed prose-p:text-base
                       prose-a:text-[#0078D4] prose-a:no-underline hover:prose-a:underline 
                       prose-strong:text-[#323130] prose-strong:font-medium
                       prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:font-light
                       prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:font-light
                       prose-ul:my-4 prose-li:my-2 prose-li:text-base
                       prose-code:text-sm prose-code:bg-[#F3F2F1] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                       prose-pre:bg-[#F3F2F1] prose-pre:border prose-pre:border-[#E1DFDD] prose-pre:rounded-lg"
            style={{ fontWeight: 300 }}
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
        </motion.div>
      </article>
    </main>
  )
}

