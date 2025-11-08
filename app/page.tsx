'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import StructuredData from './components/StructuredData'

export default function Home() {
  const [showContent, setShowContent] = useState(false)
  const [greetingText, setGreetingText] = useState('')
  const [isTypingGreeting, setIsTypingGreeting] = useState(true)
  const [greetingIndex, setGreetingIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const greetingFullText = "Hi, I'm AnhND."

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      // Collapse when scrolled down past hero section (threshold: 100px)
      setIsScrolled(scrollPosition > 100)
    }

    // Check initial scroll position
    handleScroll()
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle scroll to blog section
  const scrollToBlog = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const blogSection = document.getElementById('blog-section')
    if (blogSection) {
      blogSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Typing effect for greeting - loops
  useEffect(() => {
    if (!isTypingGreeting) return
    
    let timeout: NodeJS.Timeout
    
    if (!isDeleting && greetingIndex < greetingFullText.length) {
      // Typing
      timeout = setTimeout(() => {
        setGreetingText(greetingFullText.slice(0, greetingIndex + 1))
        setGreetingIndex(prev => prev + 1)
      }, 100)
    } else if (!isDeleting && greetingIndex >= greetingFullText.length) {
      // Wait before deleting
      timeout = setTimeout(() => {
        setIsDeleting(true)
      }, 2000)
    } else if (isDeleting && greetingIndex > 0) {
      // Deleting
      timeout = setTimeout(() => {
        setGreetingIndex(prev => prev - 1)
        setGreetingText(greetingFullText.slice(0, greetingIndex - 1))
      }, 50)
    } else if (isDeleting && greetingIndex === 0) {
      // Reset and loop
      timeout = setTimeout(() => {
        setIsDeleting(false)
        setGreetingText('')
      }, 500)
    }
    
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [greetingIndex, isDeleting, greetingFullText, isTypingGreeting])

  // Show content after greeting completes first time
  useEffect(() => {
    if (greetingIndex >= greetingFullText.length && !isDeleting) {
      const timer = setTimeout(() => {
        setShowContent(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [greetingIndex, greetingFullText, isDeleting])

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  // Start typing greeting on mount
  useEffect(() => {
    // Start typing immediately
    setIsTypingGreeting(true)
    setGreetingIndex(0)
  }, [])

  return (
    <main 
      className="h-screen overflow-y-scroll snap-y snap-mandatory bg-gradient-to-br from-white via-[#F8F9FA] to-[#F0F2F5]" 
      style={{ 
        fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, -apple-system, sans-serif',
        scrollBehavior: 'smooth'
      }}
    >
      <StructuredData 
        type="Person"
        data={{
          name: 'AnhND',
          jobTitle: 'Full-stack Developer',
          url: 'https://anhnd.com',
          sameAs: [
            'https://github.com/anhnd',
            'https://linkedin.com/in/anhngd'
          ]
        }}
      />

      {/* Hero Section - Full screen when at top, collapsed card header when scrolled */}
      <section 
        className={`h-screen snap-start flex flex-col items-center justify-center p-6 sm:p-8 md:p-12 lg:p-16 transition-all duration-300 ${
          isScrolled 
            ? 'fixed top-4 left-4 right-4 z-50 h-auto' 
            : ''
        }`}
      >
        {isScrolled ? (
          <motion.div 
            className="group w-full rounded-lg p-[2px] transition-all duration-300"
            style={{
              background: '#E1DFDD'
            }}
            whileHover={{ 
              scale: 1.01,
              y: -2,
              transition: { duration: 0.2 }
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FF5F00'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#E1DFDD'
            }}
          >
            <div className="bg-white rounded-lg py-3 px-4 sm:px-6 transition-all duration-300">
              <div className="max-w-full w-full transition-all duration-300">
                <div className="flex flex-row items-center justify-between gap-4">
                  {/* Greeting with typing effect */}
                  <div className="mb-0 flex-shrink-0 transition-all duration-300">
                    <p className="group-hover:greeting-gradient font-light leading-tight text-base sm:text-lg md:text-xl min-h-auto whitespace-nowrap transition-all duration-300 text-[#323130]"
                       style={{ 
                         fontWeight: 300, 
                         letterSpacing: '-0.02em',
                         fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif'
                       }}>
                      {greetingText}
                      <span className={`ml-2 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100 group-hover:text-[#EB001B]`} style={{ fontSize: '0.8em', color: '#323130' }}>|</span>
                    </p>
                </div>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 10 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="flex flex-row flex-shrink-0 gap-2 sm:gap-3 justify-center items-center transition-all duration-300"
                  >
                    {/* LinkedIn CTA - Primary Button */}
                    <a
                      href="https://linkedin.com/in/anhngd" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#0078D4] text-white hover:bg-[#106EBE] active:bg-[#005A9E] transition-all duration-150 flex items-center justify-center gap-1.5 sm:gap-2 font-light rounded-sm shadow-sm hover:shadow-md px-3 py-1.5 text-xs"
                      style={{ 
                        boxShadow: '0 1.6px 3.6px rgba(0,0,0,.132), 0 .3px .9px rgba(0,0,0,.108)',
                        minHeight: '32px',
                        fontWeight: 300
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-3.5 h-3.5">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      <span>LinkedIn</span>
                    </a>

                    {/* Email CTA - Secondary Button */}
                    <a
                      href="mailto:hi@anhnd.com"
                      className="bg-white border border-[#8A8886] text-[#323130] hover:bg-[#F3F2F1] active:bg-[#EDEBE9] transition-all duration-150 flex items-center justify-center gap-1.5 sm:gap-2 font-light rounded-sm px-3 py-1.5 text-xs"
                      style={{ minHeight: '32px', fontWeight: 300 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                      </svg>
                      <span className="hidden sm:inline">Email hi@anhnd.com</span>
                    </a>

                    {/* Notes CTA - Secondary Button */}
                    <a
                      href="#blog-section"
                      onClick={scrollToBlog}
                      className="bg-white border border-[#8A8886] text-[#323130] hover:bg-[#F3F2F1] active:bg-[#EDEBE9] transition-all duration-150 flex items-center justify-center gap-1.5 sm:gap-2 font-light rounded-sm cursor-pointer px-3 py-1.5 text-xs"
                      style={{ minHeight: '32px', fontWeight: 300 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                      </svg>
                      <span>My Notes</span>
                    </a>
                  </motion.div>
                </div>
                    </div>
                  </div>
          </motion.div>
        ) : (
          <div className="max-w-6xl w-full transition-all duration-300">
            <div className="flex flex-col items-center justify-center text-center transition-all duration-300">
              {/* Greeting with typing effect */}
              <div className="mb-12 sm:mb-16 transition-all duration-300">
                <p className="font-light leading-tight text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl min-h-[1.2em] transition-all duration-300"
                   style={{ 
                     fontWeight: 300, 
                     letterSpacing: '-0.02em',
                     fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif',
                     color: '#1A1A1A'
                   }}>
                  {greetingText}
                  <span className={`ml-2 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`} style={{ fontSize: '0.8em', color: '#0078D4' }}>|</span>
                </p>
              </div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 10 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-3 justify-center items-center transition-all duration-300"
              >
                {/* LinkedIn CTA - Primary Button */}
                <a
                  href="https://linkedin.com/in/anhngd" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0078D4] text-white hover:bg-[#106EBE] active:bg-[#005A9E] transition-all duration-150 flex items-center justify-center gap-1.5 sm:gap-2 font-light rounded-sm shadow-sm hover:shadow-md px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base"
                  style={{ 
                    boxShadow: '0 1.6px 3.6px rgba(0,0,0,.132), 0 .3px .9px rgba(0,0,0,.108)',
                    minHeight: '32px',
                    fontWeight: 300
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span>LinkedIn</span>
                </a>

                {/* Email CTA - Secondary Button */}
                <a
                  href="mailto:hi@anhnd.com"
                  className="bg-white border border-[#8A8886] text-[#323130] hover:bg-[#F3F2F1] active:bg-[#EDEBE9] transition-all duration-150 flex items-center justify-center gap-1.5 sm:gap-2 font-light rounded-sm px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base"
                  style={{ minHeight: '32px', fontWeight: 300 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  <span>Email hi@anhnd.com</span>
                </a>

                {/* Notes CTA - Secondary Button */}
                <a
                  href="#blog-section"
                  onClick={scrollToBlog}
                  className="bg-white border border-[#8A8886] text-[#323130] hover:bg-[#F3F2F1] active:bg-[#EDEBE9] transition-all duration-150 flex items-center justify-center gap-1.5 sm:gap-2 font-light rounded-sm cursor-pointer px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base"
                  style={{ minHeight: '32px', fontWeight: 300 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                  </svg>
                  <span>My Notes</span>
                </a>
              </motion.div>
            </div>
          </div>
        )}
      </section>

      {/* Spacer for fixed header when scrolled */}
      {isScrolled && <div className="h-20 sm:h-24" />}

      {/* Blog Posts Section - Page 2 */}
      <section id="blog-section" className="min-h-screen snap-start flex flex-col items-center justify-center p-6 sm:p-8 md:p-12 lg:p-16 bg-gradient-to-br from-[#F8F9FA] via-white to-[#F0F2F5]">
        <div className="max-w-4xl w-full">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-3xl sm:text-4xl md:text-5xl text-[#323130] mb-8 sm:mb-12 font-light text-center sm:text-left"
            style={{ fontWeight: 300, letterSpacing: '0.01em' }}
          >
            Recent Posts
          </motion.h2>

          <div className="space-y-4 sm:space-y-6">
            {/* Sample blog post items */}
            {[
              {
                title: "Building Scalable Systems",
                date: "2024-01-15",
                excerpt: "Thoughts on building systems that grow with your business needs.",
                tag: "Engineering"
              },
              {
                title: "Data-Driven Decision Making",
                date: "2024-01-10",
                excerpt: "How to leverage data and AI in real-world business scenarios.",
                tag: "Data"
              },
              {
                title: "Lessons from Gaming Industry",
                date: "2024-01-05",
                excerpt: "Insights from working in traditional games and GameFi projects.",
                tag: "Business"
              }
            ].map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ 
                  scale: 1.02,
                  y: -4,
                  transition: { duration: 0.2 }
                }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group rounded-lg p-[2px] transition-all duration-300 cursor-pointer"
                style={{
                  background: '#E1DFDD'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FF5F00'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#E1DFDD'
                }}
              >
                <article className="p-6 sm:p-8 bg-white rounded-lg h-full transition-all duration-300">
                <Link href={`/notes/${post.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs text-[#605E5C] px-3 py-1 rounded-sm border border-[#E1DFDD] bg-[#F3F2F1] font-light group-hover:border-[#FF5F00] group-hover:text-[#FF5F00] transition-all duration-200"
                          style={{ fontWeight: 300 }}>
                      {post.tag}
                    </span>
                    <p className="text-sm text-[#605E5C] font-light" style={{ fontWeight: 300 }}>
                      {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <h3 className="group-hover:title-gradient text-xl sm:text-2xl mb-3 font-light transition-all duration-200 text-[#323130]"
                      style={{ 
                        fontWeight: 300
                      }}>
                    {post.title}
                  </h3>
                  <p className="text-base text-[#323130] font-light leading-relaxed" style={{ fontWeight: 300 }}>
                    {post.excerpt}
                  </p>
                </Link>
                </article>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      </main>
  )
} 
