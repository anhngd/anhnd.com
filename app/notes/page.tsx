'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import StructuredData from '../components/StructuredData'
import { useInView } from 'react-intersection-observer'
import { Metadata } from 'next'

// Define note type
type Note = {
  id: string
  title: string
  date: string
  excerpt: string
  category: string
}

// Generate empty notes array for future real content
const generateMockNotes = (): Note[] => {  
  // Return empty array - no mock notes
  return []
}

// Generate the mock notes data
const notesData = generateMockNotes()

export default function Notes() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const notesPerPage = 12

  // Function to get all categories
  const getAllCategories = useMemo(() => {
    const categories = notesData.reduce((acc, note) => {
      acc.add(note.category)
      return acc
    }, new Set<string>())
    return Array.from(categories).sort()
  }, [])

  // Get filtered notes based on selected category and search term
  const filteredNotes = useMemo(() => {
    let filtered = notesData

    // Apply category filter if we have data and category
    if (selectedCategory && filtered.length > 0) {
      filtered = filtered.filter(note => note.category === selectedCategory)
    }

    return filtered
  }, [selectedCategory, notesData])
  
  // Paginate the filtered notes
  const displayedNotes = useMemo(() => {
    const startIndex = (page - 1) * notesPerPage
    return filteredNotes.slice(startIndex, startIndex + notesPerPage)
  }, [filteredNotes, page])
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredNotes.length / notesPerPage)
  
  // Reset page when filter changes
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category)
    setPage(1)
  }

  return (
    <main className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-bg dark:from-bg-dark to-bg/95 dark:to-bg-dark/95">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <Link href="/" className="flex items-center mb-8 text-text/60 dark:text-text-dark/60 hover:text-[#FF5F00] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-4 h-4 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className="font-cormorant text-lg tracking-wide font-light">Home</span>
          </Link>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-playfair text-4xl md:text-5xl font-medium text-text dark:text-text-dark mb-4 tracking-wide"
          >
            Notes
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-cormorant text-xl text-text/70 dark:text-text-dark/70 tracking-wide font-light max-w-3xl"
          >
            Collection of thoughts, learnings, and explorations.
          </motion.p>
        </header>
        
        {/* Categories Filter */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-10"
        >
          <div>
            <h2 className="font-playfair text-lg font-medium text-text dark:text-text-dark mb-3 tracking-wide">Categories</h2>
            <div className="flex flex-wrap gap-2 items-center">
              <button
                onClick={() => handleCategoryChange(null)}
                className={`px-3 py-1.5 border rounded-md text-sm transition-colors ${selectedCategory === null 
                  ? 'border-[#FF5F00] bg-[#FF5F00]/5 text-[#FF5F00]' 
                  : 'border-text/10 dark:border-text-dark/10 text-text/70 dark:text-text-dark/70 hover:border-[#FF5F00]/30'}`}
              >
                All
              </button>
              
              {getAllCategories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 py-1.5 border rounded-md text-sm transition-colors ${selectedCategory === category 
                    ? 'border-[#FF5F00] bg-[#FF5F00]/5 text-[#FF5F00]' 
                    : 'border-text/10 dark:border-text-dark/10 text-text/70 dark:text-text-dark/70 hover:border-[#FF5F00]/30'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Notes list with minimal design */}
        <div className="mt-8">
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
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-sm text-text/50 dark:text-text-dark/50">
                    {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} found
                  </p>
                  {totalPages > 1 && (
                    <p className="text-sm text-text/50 dark:text-text-dark/50">
                      Page {page} of {totalPages}
                    </p>
                  )}
                </div>
                
                <motion.div
                  key={`${selectedCategory}-${page}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {displayedNotes.map((note, index) => {
                    // Use intersection observer for each note item
                    const [ref, inView] = useInView({
                      triggerOnce: true,
                      threshold: 0.1
                    });
                    
                    return (
                      <motion.article 
                        key={note.id}
                        ref={ref}
                        initial={{ opacity: 0, y: 10 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ duration: 0.3, delay: 0.05 * index }}
                        className="py-5 border-b border-text/10 dark:border-text-dark/10 hover:bg-bg-section/30 dark:hover:bg-bg-section-dark/30 transition-colors px-2"
                      >
                        <Link href={`/notes/${note.id}`} className="group block">
                          <div className="flex justify-between items-start mb-1.5">
                            <h2 className="font-playfair text-xl font-medium text-text dark:text-text-dark tracking-wide group-hover:text-[#FF5F00] transition-colors">
                              {note.title}
                            </h2>
                            <time className="font-cormorant text-sm text-text/40 dark:text-text-dark/40 tracking-wide font-light">
                              {note.date}
                            </time>
                          </div>
                          <p className="font-cormorant text-base text-text/70 dark:text-text-dark/70 tracking-wide font-light leading-relaxed line-clamp-2">
                            {note.excerpt}
                          </p>
                        </Link>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          <span className="text-xs text-text/40 dark:text-text-dark/40 px-2 py-1 tracking-wide font-light">
                            {note.category}
                          </span>
                        </div>
                      </motion.article>
                    );
                  })}
                </motion.div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex justify-center items-center space-x-2">
                    <button
                      onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className={`p-2 rounded-md ${page === 1 ? 'text-text/30 dark:text-text-dark/30 cursor-not-allowed' : 'text-text/70 dark:text-text-dark/70 hover:text-[#FF5F00]'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Logic to show pages around current page
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-8 h-8 rounded-md text-sm ${page === pageNum 
                            ? 'bg-[#FF5F00]/10 text-[#FF5F00] font-medium' 
                            : 'text-text/70 dark:text-text-dark/70 hover:text-[#FF5F00] hover:bg-[#FF5F00]/5'}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={page === totalPages}
                      className={`p-2 rounded-md ${page === totalPages ? 'text-text/30 dark:text-text-dark/30 cursor-not-allowed' : 'text-text/70 dark:text-text-dark/70 hover:text-[#FF5F00]'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <p className="font-cormorant text-xl text-text/60 dark:text-text-dark/60 mb-4 tracking-wide font-light">
                  {notesData.length === 0 ? 'No notes have been published yet. Check back soon!' : 'No notes found with the selected filters.'}
                </p>
                <div className="flex gap-3 justify-center">
                  {selectedCategory && (
                    <button
                      onClick={() => handleCategoryChange(null)}
                      className="px-4 py-1.5 rounded-md border border-[#FF5F00] text-[#FF5F00] text-sm font-light tracking-wide hover:bg-[#FF5F00]/5 transition-colors"
                    >
                      Clear Category
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}
