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
  contentHtml: string
  segments?: string[]
}

type Heading = {
  id: string
  text: string
  level: number
}

// Extract headings from HTML content and add IDs
function extractHeadings(html: string): { headings: Heading[], modifiedHtml: string } {
  const headings: Heading[] = []
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const headingElements = doc.querySelectorAll('h1, h2, h3, h4')
  
  headingElements.forEach((heading, index) => {
    const level = parseInt(heading.tagName.substring(1))
    const text = heading.textContent || ''
    const id = `heading-${index}`
    
    // Add id to heading for scroll linking
    heading.id = id
    
    headings.push({ id, text, level })
  })
  
  // Return modified HTML with IDs
  const modifiedHtml = doc.body.innerHTML
  
  return { headings, modifiedHtml }
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

export default function NoteContent({ note, allNotes: notesData }: { note: Note | null, allNotes: any[] }) {
  const [mounted, setMounted] = useState(false)
  const [allNotes, setAllNotes] = useState<any[]>([])
  const [headings, setHeadings] = useState<Heading[]>([])
  const [contentHtml, setContentHtml] = useState<string>('')
  const [activeHeading, setActiveHeading] = useState<string>('')

  useEffect(() => {
    setMounted(true)
  }, [])

  // Initialize navigation data and extract headings
  useEffect(() => {
    setAllNotes(notesData)
    
    // Extract headings from content
    if (note?.contentHtml && typeof window !== 'undefined') {
      const { headings: extractedHeadings, modifiedHtml } = extractHeadings(note.contentHtml)
      setHeadings(extractedHeadings)
      setContentHtml(modifiedHtml)
    }
  }, [notesData, note])

  // Track active heading on scroll
  useEffect(() => {
    if (typeof window === 'undefined' || headings.length === 0) return

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = document.getElementById(headings[i].id)
        if (heading && heading.offsetTop <= scrollPosition) {
          setActiveHeading(headings[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [headings])

  // Scroll to heading
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      })
    }
  }
  
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
          style={{ fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif' }}
          role="main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Sidebar */}
          <aside 
            className="lg:col-span-4 lg:sticky lg:top-8 lg:self-start"
            aria-label="Article navigation"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Back Link */}
              <Link 
                href="/" 
                className="inline-flex items-center text-[#484644] hover:text-[#201F1E] focus:ring-4 focus:ring-[#201F1E]/10 rounded-lg -ml-2 pl-2 pr-3 py-1 transition-colors group text-sm font-light"
                style={{ fontWeight: 400 }}
                aria-label="Go back to home page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Trở về trước
              </Link>

              {/* Article Title */}
              <header>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl text-[#201F1E] font-light leading-tight mb-4"
                    style={{ fontWeight: 400, letterSpacing: '-0.01em' }}>
                  {note.title}
                </h1>
                
                {/* Category and Date */}
                <div className="space-y-2">
                  <span className="inline-block text-xs font-medium text-[#FF5F00] uppercase tracking-wider bg-[#FFF4ED] px-2 py-1 rounded">
                    {note.category}
                  </span>
                  <div className="text-xs text-[#6F6C6A] font-light" style={{ fontWeight: 300 }}>
                    <time dateTime={note.date}>
                      {new Date(note.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </time>
                  </div>
                </div>
              </header>

              {/* Table of Contents / Outline */}
              {headings.length > 0 && (
                <nav 
                  aria-label="Table of contents"
                  className="border-t border-[#D1D0CE] pt-6"
                >
                  <h2 className="text-lg font-light text-[#201F1E] mb-4"
                      style={{ fontWeight: 400 }}>
                    Nội dung bài viết
                  </h2>
                  <ul className="space-y-2" role="list">
                    {headings.map((heading) => (
                      <li key={heading.id} role="listitem">
                        <button
                          onClick={() => scrollToHeading(heading.id)}
                          className={`flex items-start text-left text-sm font-light transition-colors w-full group focus:outline-none focus:ring-2 focus:ring-[#FF5F00]/30 rounded -ml-2 pl-2 pr-2 py-1 ${
                            activeHeading === heading.id
                              ? 'text-[#FF5F00] font-medium'
                              : 'text-[#484644] hover:text-[#FF5F00]'
                          }`}
                          style={{ 
                            fontWeight: activeHeading === heading.id ? 500 : 300,
                            paddingLeft: `${8 + (heading.level - 2) * 12}px`
                          }}
                          aria-current={activeHeading === heading.id ? 'location' : undefined}
                        >
                          <span className={`mr-2 text-xs ${
                            activeHeading === heading.id ? 'text-[#FF5F00]' : 'text-[#8A8886] group-hover:text-[#FF5F00]'
                          }`} aria-hidden="true">•</span>
                          <span className="flex-1">{heading.text}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              {/* Other Articles */}
              {allNotes.length > 0 && (
                <nav 
                  aria-label="Related articles"
                  className="border-t border-[#D1D0CE] pt-6"
                >
                  <h2 className="text-lg font-light text-[#201F1E] mb-4"
                      style={{ fontWeight: 400 }}>
                    Bài viết khác
                  </h2>
                  <ul className="space-y-3" role="list">
                    {allNotes
                      .filter(n => n.id !== note.id)
                      .slice(0, 5)
                      .map((otherNote) => (
                        <li key={otherNote.id} role="listitem">
                          <Link
                            href={`/notes/${otherNote.id}`}
                            className="text-sm text-[#484644] hover:text-[#FF5F00] focus:ring-2 focus:ring-[#FF5F00]/30 rounded transition-colors font-light block -ml-2 pl-2 pr-2 py-1"
                            style={{ fontWeight: 300 }}
                          >
                            <span className="hover:underline">{otherNote.title}</span>
                          </Link>
                        </li>
                      ))}
                  </ul>
                </nav>
              )}
            </motion.div>
          </aside>

          {/* Main Content */}
          <article className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose prose-lg max-w-none
                prose-headings:font-light prose-headings:text-[#201F1E] prose-headings:scroll-mt-20
                prose-h1:text-3xl prose-h1:mb-6 prose-h1:font-normal
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-5 prose-h2:font-normal prose-h2:border-b prose-h2:border-[#E1DFDD] prose-h2:pb-3
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:font-normal
                prose-p:text-[#201F1E] prose-p:leading-[1.75] prose-p:mb-6 prose-p:text-base
                prose-a:text-[#FF5F00] prose-a:no-underline prose-a:font-medium hover:prose-a:underline prose-a:transition-colors
                prose-strong:text-[#201F1E] prose-strong:font-semibold
                prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
                prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2
                prose-li:text-[#201F1E] prose-li:leading-relaxed
                prose-blockquote:border-l-4 prose-blockquote:border-[#FF5F00] prose-blockquote:pl-6 prose-blockquote:py-1 prose-blockquote:my-6 prose-blockquote:italic prose-blockquote:text-[#484644] prose-blockquote:bg-[#FFF4ED]/30
                prose-code:text-[#FF5F00] prose-code:bg-[#FFF4ED] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-medium prose-code:before:content-[''] prose-code:after:content-['']
                prose-pre:bg-[#201F1E] prose-pre:text-white prose-pre:rounded-lg prose-pre:shadow-lg prose-pre:my-6
                prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                prose-hr:border-[#E1DFDD] prose-hr:my-12
                prose-table:border-collapse prose-table:w-full prose-table:my-6
                prose-th:border prose-th:border-[#E1DFDD] prose-th:bg-[#F3F2F1] prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold
                prose-td:border prose-td:border-[#E1DFDD] prose-td:px-4 prose-td:py-2"
              dangerouslySetInnerHTML={{ __html: contentHtml || note.contentHtml }}
            />
          </article>
        </div>
      </div>
    </main>
  )
}

