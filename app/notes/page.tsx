'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import StructuredData from '../components/StructuredData'
import { useInView } from 'react-intersection-observer'

// Sample notes data - in a real app, this would come from a database or API
const notesData = [
  {
    id: '1',
    title: 'The Art of Simplicity',
    date: 'July 10, 2025',
    excerpt: 'Exploring the beauty of minimalist design principles and how they can transform digital experiences.',
    tags: ['Design', 'UX', 'Minimalism']
  },
  {
    id: '2',
    title: 'Building with Next.js',
    date: 'July 8, 2025',
    excerpt: 'A deep dive into creating performant web applications with Next.js and React.',
    tags: ['Development', 'Next.js', 'React']
  },
  {
    id: '3',
    title: 'Typography in Digital Design',
    date: 'July 5, 2025',
    excerpt: 'How thoughtful font choices create meaningful hierarchies and enhance user experience.',
    tags: ['Typography', 'Design', 'Accessibility']
  },
  {
    id: '4',
    title: 'Color Theory for Digital Interfaces',
    date: 'June 28, 2025',
    excerpt: 'Understanding the psychology of color and its application in modern web design.',
    tags: ['Color Theory', 'Design', 'Psychology']
  }
]

export default function Notes() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [scrollY, setScrollY] = useState(0)

  // Effect for parallax scrolling
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Function to get all unique tags from notes data
  const getAllTags = () => {
    const tags = notesData.reduce((acc, note) => {
      note.tags.forEach(tag => acc.add(tag))
      return acc
    }, new Set<string>())
    return Array.from(tags)
  }

  // Get all unique tags
  const allTags = getAllTags().sort()

  // Filter notes by tag if a tag filter is active
  const filteredNotes = selectedTag
    ? notesData.filter(note => note.tags.includes(selectedTag))
    : notesData

  return (
    <main className="min-h-screen py-20 px-6 sm:px-8 lg:px-12 bg-gradient-to-b from-bg dark:from-bg-dark to-bg/95 dark:to-bg-dark/95">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-20">
          <Link href="/" className="flex items-center mb-10 text-text/60 dark:text-text-dark/60 hover:text-[#FF5F00] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className="font-cormorant text-xl tracking-wide font-light">Return Home</span>
          </Link>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-playfair text-6xl md:text-7xl font-light text-text dark:text-text-dark mb-6 tracking-wider"
          >
            Notes
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-cormorant text-2xl text-text/70 dark:text-text-dark/70 tracking-wide font-light"
          >
            Thoughts, ideas, and explorations on design and development
          </motion.p>
        </header>
        
        {/* Tags Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex flex-wrap gap-3 items-center">
            <span className="font-cormorant text-xl text-text/60 dark:text-text-dark/60 mr-3 tracking-wide font-light">Filter by:</span>
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-full font-cormorant text-xl tracking-wide font-light transition-colors ${
                selectedTag === null 
                  ? 'bg-[#FF5F00] text-white' 
                  : 'bg-bg-section dark:bg-bg-section-dark text-text/70 dark:text-text-dark/70 hover:bg-[#FF5F00]/10'
              }`}
            >
              All
            </button>
            
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full font-cormorant text-xl tracking-wide font-light transition-colors ${
                  selectedTag === tag 
                    ? 'bg-[#FF5F00] text-white' 
                    : 'bg-bg-section dark:bg-bg-section-dark text-text/70 dark:text-text-dark/70 hover:bg-[#FF5F00]/10'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>
        
        {/* Notes list with staggered animation */}
        <div className="mt-12">
          {/* Add structured data for better SEO */}
          <StructuredData
            type="WebSite"
            data={{
              name: 'AnhND - Notes',
              description: 'Collection of notes and articles by AnhND on design, development, and technology',
              url: 'https://anhnd.com/notes',
            }}
          />
          
          <AnimatePresence mode="wait">
            {filteredNotes.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-10"
              >
                {filteredNotes.map((note, index) => {
                  // Use intersection observer for each note item
                  const [ref, inView] = useInView({
                    triggerOnce: true,
                    threshold: 0.1,
                    rootMargin: '0px 0px 100px 0px'
                  });
                  
                  return (
                    <motion.article 
                      key={note.id}
                      ref={ref}
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      style={{ 
                        // Add parallax effect based on scroll position
                        transform: `translateY(${scrollY * 0.02 * (index % 2 === 0 ? -1 : 1)}px)`
                      }}
                      className="p-8 rounded-xl bg-bg/50 dark:bg-bg-dark/50 border border-[#FF5F00]/10 backdrop-blur-sm hover:border-[#FF5F00]/30 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <Link href={`/notes/${note.id}`} className="block">
                        <h2 className="font-playfair text-3xl font-light text-text dark:text-text-dark mb-3 tracking-wide hover:text-[#FF5F00] transition-colors">
                          {note.title}
                        </h2>
                        <time className="block font-cormorant text-xl text-[#FF5F00] mb-4 tracking-wide font-light">
                          {note.date}
                        </time>
                        <p className="font-cormorant text-2xl text-text/80 dark:text-text-dark/80 mb-6 tracking-wide font-light leading-relaxed">
                          {note.excerpt}
                        </p>
                      </Link>
                      <div className="flex flex-wrap gap-2 mt-6">
                        {note.tags.map((tag: string) => (
                          <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className="px-3 py-1.5 rounded-full bg-[#FF5F00]/10 text-[#FF5F00] text-base font-light tracking-wide hover:bg-[#FF5F00]/20 transition-colors"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                      <div className="mt-8 text-right">
                        <Link href={`/notes/${note.id}`} className="inline-flex items-center font-cormorant text-xl text-primary hover:text-primary/80 transition-colors tracking-wide font-light">
                          Read more
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-5 h-5 ml-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </Link>
                      </div>
                    </motion.article>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-20"
              >
                <p className="font-cormorant text-3xl text-text/60 dark:text-text-dark/60 mb-6 tracking-wide font-light">
                  No notes found with the selected filter.
                </p>
                <button
                  onClick={() => setSelectedTag(null)}
                  className="px-6 py-2.5 rounded-lg bg-primary text-white font-light tracking-wide hover:bg-primary/90 transition-colors text-xl"
                >
                  Clear Filter
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}
