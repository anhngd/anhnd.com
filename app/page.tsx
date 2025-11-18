'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import StructuredData from './components/StructuredData'
import Modal from './components/Modal'

export default function Home() {
  const [showContent, setShowContent] = useState(false)
  const [greetingText, setGreetingText] = useState('')
  const [isTypingGreeting, setIsTypingGreeting] = useState(true)
  const [greetingIndex, setGreetingIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [phraseIndex, setPhraseIndex] = useState(0)

  const phrases = ["a developer.", "a solo founder.", "and more..."]
  const greetingFullText = phrases[phraseIndex]

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

  // Typing effect for greeting - loops through phrases
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
      // Move to next phrase and reset
      timeout = setTimeout(() => {
        setIsDeleting(false)
        setGreetingText('')
        setPhraseIndex((prev) => (prev + 1) % phrases.length)
      }, 500)
    }
    
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [greetingIndex, isDeleting, greetingFullText, isTypingGreeting, phrases.length])

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
          '@id': 'https://anhnd.com/#person',
          name: 'AnhND',
          alternateName: ['Anh Nguyen', 'Nguyen Duc Anh'],
          givenName: 'Duc Anh',
          familyName: 'Nguyen',
          jobTitle: 'Big Data & AI Lead | Engineer & Master of Applied Mathematics',
          description: 'Engineer and Master of Applied Mathematics with 10+ years in IT. Expert in Big Data, AI, Digital Transformation, Gaming, and Web3. Based in Vietnam.',
          url: 'https://anhnd.com',
          image: 'https://anhnd.com/avatar.png',
          email: 'hi@anhnd.com',
          worksFor: {
            '@type': 'Organization',
            name: 'AnhND'
          },
          alumniOf: {
            '@type': 'EducationalOrganization',
            name: 'Hanoi University of Science and Technology',
            alternateName: 'HUST'
          },
          knowsAbout: [
            'Big Data',
            'Artificial Intelligence',
            'Machine Learning',
            'Data Engineering',
            'Digital Transformation',
            'System Architecture',
            'Web3',
            'Blockchain',
            'Gaming Industry',
            'Applied Mathematics',
            'Technical Leadership'
          ],
          sameAs: [
            'https://linkedin.com/in/anhngd',
            'https://github.com/anhnd'
          ],
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'VN',
            addressLocality: 'Vietnam'
          }
        }}
      />
      
      {/* Website Structured Data */}
      <StructuredData 
        type="WebSite"
        data={{
          '@id': 'https://anhnd.com/#website',
          name: 'AnhND',
          description: 'Personal website of AnhND - Big Data & AI Lead, Developer, Solo Founder',
          url: 'https://anhnd.com',
          author: {
            '@id': 'https://anhnd.com/#person'
          },
          inLanguage: 'en-US',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://anhnd.com/notes?search={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
          }
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
                    <div className="group-hover:greeting-gradient font-light leading-tight text-base sm:text-lg md:text-xl min-h-auto whitespace-nowrap transition-all duration-300 text-[#323130]"
                       style={{ 
                         fontWeight: 300, 
                         letterSpacing: '-0.02em',
                         fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif'
                       }}>
                      I'm <span className="text-[#FF5F00]">AnhND</span>, {greetingText}
                      <span className={`ml-2 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`} style={{ fontSize: '0.8em', color: '#FF5F00' }}>|</span>
                    </div>
                </div>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 10 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="flex flex-row flex-shrink-0 gap-2 sm:gap-3 justify-center items-center transition-all duration-300"
                  >
                    {/* About Me Button */}
                    <button
                      onClick={() => setIsAboutOpen(true)}
                      className="bg-[#FF5F00] text-white hover:bg-[#EB001B] active:bg-[#D10019] transition-all duration-150 flex items-center justify-center gap-1.5 sm:gap-2 font-light rounded-sm shadow-sm hover:shadow-md px-3 py-1.5 text-xs"
                      style={{ 
                        boxShadow: '0 1.6px 3.6px rgba(0,0,0,.132), 0 .3px .9px rgba(0,0,0,.108)',
                        minHeight: '32px',
                        fontWeight: 300
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                      <span>About</span>
                    </button>

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
                      <span className="hidden sm:inline">LinkedIn</span>
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
                      <span className="hidden sm:inline">Email</span>
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
                      <span className="hidden sm:inline">Notes</span>
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
                {/* Static "I'm AnhND" */}
                <h1 className="font-light leading-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 transition-all duration-300"
                   style={{ 
                     fontWeight: 300, 
                     letterSpacing: '-0.02em',
                     fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif',
                     color: '#323130'
                   }}>
                  I'm <span className="text-[#FF5F00]">AnhND</span>
                </h1>
                
                {/* Cycling phrases */}
                <div className="font-light leading-tight text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl min-h-[1.2em] transition-all duration-300"
                   style={{ 
                     fontWeight: 300, 
                     letterSpacing: '-0.02em',
                     fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif',
                     color: '#1A1A1A'
                   }}>
                  {greetingText}
                  <span className={`ml-2 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`} style={{ fontSize: '0.8em', color: '#FF5F00' }}>|</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 10 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-3 justify-center items-center transition-all duration-300"
              >
                {/* About Me Button */}
                <button
                  onClick={() => setIsAboutOpen(true)}
                  className="bg-[#FF5F00] text-white hover:bg-[#EB001B] active:bg-[#D10019] transition-all duration-150 flex items-center justify-center gap-1.5 sm:gap-2 font-light rounded-sm shadow-sm hover:shadow-md px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base"
                  style={{ 
                    boxShadow: '0 1.6px 3.6px rgba(0,0,0,.132), 0 .3px .9px rgba(0,0,0,.108)',
                    minHeight: '32px',
                    fontWeight: 300
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                  <span>About Me</span>
                </button>

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
                  <span>Email</span>
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

      {/* Blog Posts Section - Minimalist */}
      <section id="blog-section" className="min-h-screen snap-start flex flex-col items-center justify-start py-12 sm:py-16 md:py-20 px-6 sm:px-8 bg-white">
        <div className="max-w-3xl w-full">
          {/* Simple list of posts */}
          <div className="space-y-8">
            {[
              {
                title: "Building Data Pipelines at Scale",
                date: "2024-11-15",
                excerpt: "Lessons learned from processing millions of events per day. How we designed fault-tolerant pipelines that handle peak traffic without breaking.",
                tag: "Big Data"
              },
              {
                title: "AI in Production: Beyond the Hype",
                date: "2024-11-08",
                excerpt: "Real-world challenges of deploying machine learning models. From training to monitoring, what actually matters in production systems.",
                tag: "AI/ML"
              },
              {
                title: "The Hidden Cost of Technical Debt",
                date: "2024-10-28",
                excerpt: "Why that quick fix from 2 years ago is now costing you millions. A framework for measuring and managing technical debt in growing teams.",
                tag: "Engineering"
              },
              {
                title: "From Developer to Engineering Manager",
                date: "2024-10-20",
                excerpt: "The transition nobody tells you about. What I wish I knew before taking my first management role and the mistakes I made along the way.",
                tag: "Management"
              },
              {
                title: "Web3 Gaming: Promises vs Reality",
                date: "2024-10-12",
                excerpt: "After 3 years building blockchain games, here's what actually works and what's still just hype. Lessons from millions of on-chain transactions.",
                tag: "Web3"
              },
              {
                title: "Digital Transformation in Government",
                date: "2024-09-30",
                excerpt: "Why government tech projects fail (and how to fix them). 7 years of lessons from modernizing legacy systems in public sector.",
                tag: "Gov Tech"
              },
              {
                title: "The Economics of Virtual Goods",
                date: "2024-09-22",
                excerpt: "How in-game economies mirror real markets. Designing sustainable virtual economies that players actually enjoy and don't exploit.",
                tag: "Gaming"
              },
              {
                title: "Building Teams That Ship",
                date: "2024-09-15",
                excerpt: "Culture eats strategy for breakfast. How to build engineering teams that consistently deliver without burning out.",
                tag: "Management"
              },
              {
                title: "When to NOT Use Microservices",
                date: "2024-09-08",
                excerpt: "The monolith isn't dead. Why we moved back from microservices and what we learned about architectural decisions.",
                tag: "Architecture"
              },
              {
                title: "Data Privacy in the Age of AI",
                date: "2024-09-01",
                excerpt: "Balancing innovation with privacy. Practical approaches to building AI systems that respect user data and comply with regulations.",
                tag: "Data"
              }
            ].map((post, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group border-b border-[#E1DFDD] pb-8 last:border-b-0"
              >
                <Link href={`/notes/${post.title.toLowerCase().replace(/\s+/g, '-')}`} className="block">
                  {/* Tag and Date */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-medium text-[#FF5F00] uppercase tracking-wider">
                      {post.tag}
                    </span>
                    <span className="text-xs text-[#8A8886]">
                      {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl font-light text-[#323130] mb-3 group-hover:text-[#FF5F00] transition-colors duration-200"
                      style={{ fontWeight: 300, letterSpacing: '-0.01em' }}>
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-base text-[#605E5C] font-light leading-relaxed" style={{ fontWeight: 300 }}>
                    {post.excerpt}
                  </p>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#323130] text-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Column 1: About */}
            <div>
              <h3 className="text-xl font-light mb-4" style={{ fontWeight: 400 }}>AnhND</h3>
              <p className="text-[#E1DFDD] font-light leading-relaxed text-sm" style={{ fontWeight: 300 }}>
                Engineer & Master of Applied Mathematics. 
                10+ years journey from gov digital transformation to Big Data & AI.
                Building intelligent systems with mathematical rigor and practical wisdom.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-xl font-light mb-4" style={{ fontWeight: 400 }}>Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-[#E1DFDD] hover:text-[#FF5F00] transition-colors duration-200 font-light text-sm" style={{ fontWeight: 300 }}>
                    About
                  </a>
                </li>
                <li>
                  <a href="#blog-section" className="text-[#E1DFDD] hover:text-[#FF5F00] transition-colors duration-200 font-light text-sm" style={{ fontWeight: 300 }}>
                    Blog
                  </a>
                </li>
                <li>
                  <Link href="/notes" className="text-[#E1DFDD] hover:text-[#FF5F00] transition-colors duration-200 font-light text-sm" style={{ fontWeight: 300 }}>
                    Notes
                  </Link>
                </li>
                <li>
                  <a href="mailto:hi@anhnd.com" className="text-[#E1DFDD] hover:text-[#FF5F00] transition-colors duration-200 font-light text-sm" style={{ fontWeight: 300 }}>
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Connect */}
            <div>
              <h3 className="text-xl font-light mb-4" style={{ fontWeight: 400 }}>Connect</h3>
              <div className="flex gap-4">
                <a
                  href="https://linkedin.com/in/anhngd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-[#605E5C] hover:bg-[#FF5F00] rounded-full transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/anhnd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-[#605E5C] hover:bg-[#FF5F00] rounded-full transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="mailto:hi@anhnd.com"
                  className="w-10 h-10 flex items-center justify-center bg-[#605E5C] hover:bg-[#FF5F00] rounded-full transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-[#605E5C] pt-8 text-center">
            <p className="text-[#E1DFDD] font-light text-sm" style={{ fontWeight: 300 }}>
              © {new Date().getFullYear()} AnhND. All rights reserved. Built with Next.js & Tailwind CSS.
            </p>
          </div>
        </div>
      </footer>

      {/* About Me Modal */}
      <Modal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} title="About Me">
        <div className="space-y-6 text-[#323130]">
          <div className="space-y-4 text-base sm:text-lg font-light leading-relaxed" style={{ fontWeight: 300 }}>
            <p>
              My journey spans <span className="font-medium">12+ years</span> across distinct domains that shaped how I build systems today:
            </p>
            
            <div className="pl-4 border-l-2 border-[#FF5F00] space-y-2">
              <p>
                <span className="font-medium text-[#FF5F00]">7+ years</span> transforming government agencies and enterprises through digital initiatives — 
                where I learned that the hardest problems aren't technical, they're organizational.
              </p>
              <p>
                <span className="font-medium text-[#0078D4]">5+ years</span> in the gaming industry across online games, Web3 Gaming, and gaming data analytics — 
                where real-time systems, player psychology, virtual economies, and blockchain convergence taught me to think at scale.
              </p>
            </div>

            <p>
              Currently diving deep into <span className="font-medium">Big Data</span>, <span className="font-medium">AI</span>, 
              and <span className="font-medium">management</span> — because solving problems at scale requires 
              both technical depth and strategic thinking. Sometimes you need algorithms, sometimes you need people skills, 
              often you need both (plus coffee ☕).
            </p>
          </div>

          <div className="pt-6 border-t border-[#E1DFDD]">
            <h3 className="text-xl sm:text-2xl font-light mb-4" style={{ fontWeight: 400 }}>
              Education
            </h3>
            <div className="space-y-3 font-light" style={{ fontWeight: 300 }}>
              <div>
                <p className="text-base sm:text-lg font-medium">
                  Master of Science (MSc)
                </p>
                <p className="text-sm sm:text-base text-[#605E5C]">
                  Applied Mathematics
                </p>
              </div>
              <div>
                <p className="text-base sm:text-lg font-medium">
                  Bachelor of Engineering
                </p>
                <p className="text-sm sm:text-base text-[#605E5C]">
                  Mathematics and Informatics
                </p>
              </div>
              <p className="text-sm text-[#605E5C] pt-2">
                Hanoi University of Science and Technology (HUST/BKHN)
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E1DFDD]">
            <h3 className="text-xl sm:text-2xl font-light mb-4" style={{ fontWeight: 400 }}>
              Contact Me
            </h3>
            <div className="space-y-4 font-light" style={{ fontWeight: 300 }}>
              <p className="text-base text-[#605E5C] mb-4">
                Let's connect! Feel free to reach out through any of these channels:
              </p>
              
              <div className="grid gap-3">
                {/* Email */}
                <a
                  href="mailto:hi@anhnd.com"
                  className="group flex items-center gap-3 p-4 bg-[#F3F2F1] hover:bg-[#E1DFDD] rounded-lg transition-all duration-200 border border-transparent hover:border-[#FF5F00]"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center group-hover:bg-[#FF5F00] transition-all duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#323130] group-hover:text-white transition-all duration-200">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm text-[#605E5C] font-light">Email</p>
                    <p className="text-base text-[#323130] font-medium">hi@anhnd.com</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#605E5C] group-hover:text-[#FF5F00] transition-all duration-200">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/in/anhngd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-4 bg-[#F3F2F1] hover:bg-[#E1DFDD] rounded-lg transition-all duration-200 border border-transparent hover:border-[#0078D4]"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center group-hover:bg-[#0078D4] transition-all duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-[#323130] group-hover:text-white transition-all duration-200">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm text-[#605E5C] font-light">LinkedIn</p>
                    <p className="text-base text-[#323130] font-medium">linkedin.com/in/anhngd</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#605E5C] group-hover:text-[#0078D4] transition-all duration-200">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      </main>
  )
} 
