'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { NoteMetadata } from '@/lib/markdown'

type Note = {
  id: string
  title: string
  date: string
  excerpt: string
  category: string
  content: string
  contentHtml: string
}

type Heading = {
  id: string
  text: string
  level: number
}

function extractHeadings(html: string): { headings: Heading[], modifiedHtml: string } {
  const headings: Heading[] = []
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const headingElements = doc.querySelectorAll('h1, h2, h3, h4')

  headingElements.forEach((heading, index) => {
    const level = parseInt(heading.tagName.substring(1))
    const text = heading.textContent || ''
    const id = `heading-${index}`
    heading.id = id
    headings.push({ id, text, level })
  })

  return { headings, modifiedHtml: doc.body.innerHTML }
}

function NotFoundUI() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[#FAFAF9]"
          style={{ fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif' }}>
      <div className="text-center">
        <p className="text-6xl text-[#E1DFDD] font-light mb-4" style={{ fontWeight: 300 }}>404</p>
        <h1 className="text-lg text-[#1A1A1A] mb-2" style={{ fontWeight: 400 }}>Note not found</h1>
        <p className="text-sm text-[#8A8886] mb-6" style={{ fontWeight: 300 }}>This note doesn't exist or hasn't been published yet.</p>
        <Link href="/" className="text-sm text-[#FF5F00] hover:text-[#E55500] transition-colors" style={{ fontWeight: 500 }}>
          Back to home
        </Link>
      </div>
    </main>
  )
}

export default function NoteContent({ note, allNotes }: { note: Note | null, allNotes: NoteMetadata[] }) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [contentHtml, setContentHtml] = useState<string>('')
  const [activeHeading, setActiveHeading] = useState<string>('')
  const [showToc, setShowToc] = useState(false)

  useEffect(() => {
    if (note?.contentHtml && typeof window !== 'undefined') {
      const { headings: extractedHeadings, modifiedHtml } = extractHeadings(note.contentHtml)
      setHeadings(extractedHeadings)
      setContentHtml(modifiedHtml)
    }
  }, [note])

  // Track active heading on scroll
  useEffect(() => {
    if (typeof window === 'undefined' || headings.length === 0) return

    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollPosition = window.scrollY + 120

          for (let i = headings.length - 1; i >= 0; i--) {
            const heading = document.getElementById(headings[i].id)
            if (heading && heading.offsetTop <= scrollPosition) {
              setActiveHeading(headings[i].id)
              break
            }
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [headings])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' })
    }
    setShowToc(false)
  }

  const relatedNotes = useMemo(
    () => allNotes
      .filter(n => n.id !== note?.id)
      .filter(n => n.category === note?.category)
      .slice(0, 3),
    [allNotes, note?.id, note?.category]
  )

  const otherNotes = useMemo(
    () => relatedNotes.length < 3
      ? [...relatedNotes, ...allNotes.filter(n => n.id !== note?.id && n.category !== note?.category).slice(0, 3 - relatedNotes.length)]
      : relatedNotes,
    [allNotes, relatedNotes, note?.id, note?.category]
  )

  if (!note) return <NotFoundUI />

  return (
    <main className="min-h-screen bg-[#FAFAF9]"
          style={{ fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif' }}>

      {/* Top bar */}
      <nav className="sticky top-0 z-30 bg-[#FAFAF9]/80 backdrop-blur-md border-b border-[#F0EEEC]">
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-[#8A8886] hover:text-[#1A1A1A] transition-colors gap-1.5"
            style={{ fontWeight: 400 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Home
          </Link>

          {/* TOC toggle for mobile + desktop */}
          {headings.length > 0 && (
            <button
              onClick={() => setShowToc(!showToc)}
              className="inline-flex items-center text-xs text-[#8A8886] hover:text-[#1A1A1A] transition-colors gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-[#F3F2F1]"
              style={{ fontWeight: 400 }}
              aria-label="Toggle table of contents"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              Contents
            </button>
          )}
        </div>

        {/* TOC dropdown */}
        {showToc && headings.length > 0 && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setShowToc(false)} />
            <div className="absolute right-0 top-14 w-full sm:w-80 max-h-[60vh] overflow-y-auto bg-white border border-[#F0EEEC] shadow-lg sm:rounded-bl-lg z-30">
              <div className="p-4">
                <p className="text-xs text-[#B4B2AF] uppercase tracking-wider mb-3" style={{ fontWeight: 500 }}>On this page</p>
                <ul className="space-y-1">
                  {headings.map((heading) => (
                    <li key={heading.id}>
                      <button
                        onClick={() => scrollToHeading(heading.id)}
                        className={`w-full text-left text-sm py-1.5 px-2 rounded transition-colors ${
                          activeHeading === heading.id
                            ? 'text-[#FF5F00] bg-[#FFF4ED]'
                            : 'text-[#605E5C] hover:text-[#1A1A1A] hover:bg-[#F3F2F1]'
                        }`}
                        style={{
                          fontWeight: activeHeading === heading.id ? 500 : 300,
                          paddingLeft: `${8 + (heading.level - 2) * 16}px`
                        }}
                      >
                        {heading.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* Article header */}
      <header className="bg-white border-b border-[#F0EEEC]">
        <div className="max-w-[680px] mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-10 sm:pb-12">
          {/* Category + Date */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[10px] font-medium text-[#FF5F00] uppercase tracking-wider bg-[#FFF4ED] px-2 py-0.5 rounded">
              {note.category}
            </span>
            <time
              dateTime={note.date}
              className="text-xs text-[#B4B2AF]"
              style={{ fontWeight: 300 }}
            >
              {new Date(note.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>

          {/* Title */}
          <h1
            className="text-3xl sm:text-4xl md:text-5xl text-[#1A1A1A] leading-[1.15] mb-4"
            style={{ fontWeight: 400, letterSpacing: '-0.02em' }}
          >
            {note.title}
          </h1>

          {/* Excerpt */}
          <p className="text-base sm:text-lg text-[#8A8886] leading-relaxed max-w-2xl" style={{ fontWeight: 300 }}>
            {note.excerpt}
          </p>
        </div>
      </header>

      {/* Article body */}
      <article className="bg-white">
        <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: contentHtml || note.contentHtml }}
          />
        </div>
      </article>

      {/* Related notes */}
      {otherNotes.length > 0 && (
        <section className="border-t border-[#F0EEEC] bg-[#FAFAF9]">
          <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <h2 className="text-lg text-[#1A1A1A] mb-6" style={{ fontWeight: 400 }}>
              More notes
            </h2>
            <div className="space-y-0">
              {otherNotes.map((otherNote) => (
                <Link
                  key={otherNote.id}
                  href={`/notes/${otherNote.id}`}
                  className="group flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-4 border-b border-[#F0EEEC] last:border-b-0 hover:bg-white -mx-3 px-3 rounded-lg transition-colors"
                >
                  <time
                    dateTime={otherNote.date}
                    className="text-xs text-[#B4B2AF] shrink-0 sm:w-24 tabular-nums"
                    style={{ fontWeight: 300 }}
                  >
                    {new Date(otherNote.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </time>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#1A1A1A] group-hover:text-[#FF5F00] transition-colors" style={{ fontWeight: 400 }}>
                      {otherNote.title}
                    </p>
                    <span className="text-[10px] text-[#B4B2AF] uppercase tracking-wider">{otherNote.category}</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                       className="w-3.5 h-3.5 text-[#D1D0CE] group-hover:text-[#FF5F00] transition-colors shrink-0 hidden sm:block self-center" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-[#F0EEEC] bg-[#FAFAF9]">
        <div className="max-w-[680px] mx-auto text-center">
          <p className="text-xs text-[#B4B2AF]" style={{ fontWeight: 300 }}>
            © {new Date().getFullYear()} anhnd.com
          </p>
        </div>
      </footer>
    </main>
  )
}
