'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ThemeProvider from './components/ThemeProvider'
import ThemeSwitch from './components/ThemeSwitch'
import Modal from './components/Modal'
import { motion } from 'framer-motion'

export default function Home() {
  const [activeModal, setActiveModal] = useState<'about' | 'contact' | null>(null)
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)
  const [showText, setShowText] = useState(false)
  const [showAvatar, setShowAvatar] = useState(false)
  const [showRest, setShowRest] = useState(false)
  const [displayedText, setDisplayedText] = useState('')  
  const [activeSection, setActiveSection] = useState('home')

  // Full text for typing
  const fullText = "Hello, I'm AnhND"

  // Typing effect
  useEffect(() => {
    setShowText(false)
    setShowAvatar(false)
    setShowRest(false)
    setDisplayedText('')
    let timeout1: NodeJS.Timeout, timeout2: NodeJS.Timeout, timeout3: NodeJS.Timeout, pauseTimeout: NodeJS.Timeout
    let i = 0
    const helloPart = 'Hello,'
    function typeChar() {
      if (i <= helloPart.length) {
        setDisplayedText(fullText.slice(0, i))
        i++
        timeout1 = setTimeout(typeChar, 60)
      } else if (i === helloPart.length + 1) {
        // Pause after 'Hello,'
        pauseTimeout = setTimeout(() => {
          i++
          typeChar()
        }, 600)
      } else if (i <= fullText.length) {
        setDisplayedText(fullText.slice(0, i))
        i++
        timeout1 = setTimeout(typeChar, 60)
      } else {
        setShowAvatar(true)
        timeout2 = setTimeout(() => setShowRest(true), 500)
      }
    }
    setShowText(true)
    timeout3 = setTimeout(typeChar, 400)
    return () => {
      clearTimeout(timeout1)
      clearTimeout(timeout2)
      clearTimeout(timeout3)
      clearTimeout(pauseTimeout)
    }
  }, [])

  return (
    <>
      <ThemeProvider />
      <main className="h-screen flex flex-col overflow-hidden bg-gradient-to-b from-[var(--bg-color)] to-[var(--bg-color)]/95 relative">
        {/* Theme Switch */}
        <div className="absolute top-4 right-8 md:right-16 lg:right-24 z-10">
          <ThemeSwitch />
        </div>

        {/* Main Content */}
        <section className="flex-1 flex flex-col items-center justify-center px-8 md:px-16 lg:px-24 relative z-10">
          <div className="max-w-7xl mx-auto w-full">
            {/* Avatar and Name */}
            <div className="flex flex-col items-center space-y-4 sm:space-y-6 mb-8 sm:mb-12">
              {/* Avatar */}
              <motion.div
                className="relative w-28 h-28 xs:w-32 xs:h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: showAvatar ? 1 : 0, scale: showAvatar ? 1 : 0.9 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-color)]/20 to-[var(--secondary-color)]/20 rounded-full transform rotate-6 transition-transform duration-500 group-hover:rotate-12"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-color)]/10 to-[var(--secondary-color)]/10 rounded-full transform -rotate-6 transition-transform duration-500 group-hover:-rotate-12"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary-color)]/5 to-[var(--secondary-color)]/5 rounded-full blur-xl"></div>
                <Image
                  src="/avatar.png"
                  alt="AnhND"
                  fill
                  className="object-cover rounded-full relative z-10 shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              </motion.div>
              {/* Typing Text */}
              <motion.h1
                className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-[var(--text-color)] tracking-tight leading-tight text-center min-h-[2.5em] sm:min-h-[2em]"
                initial={{ opacity: 0 }}
                animate={{ opacity: showText ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block opacity-95 font-[var(--font-playfair)]">
                  <span className="typing-animation" style={{ borderRight: displayedText.length < fullText.length ? '3px solid var(--primary-color)' : 'none' }}>{displayedText}</span>
                </span>
              </motion.h1>
              {/* The rest of the content (only show after avatar) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showRest ? 1 : 0, y: showRest ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="w-full px-2 sm:px-0"
              >
                {/* Contact information line */}
                <div className="flex items-center justify-center gap-6 text-[var(--text-color)]/70 text-sm md:text-base">
                  <a href="mailto:me@anhnd.com" className="flex items-center gap-2 hover:text-[var(--primary-color)] transition-colors group">
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--primary-color)]/10 group-hover:bg-[var(--primary-color)]/20 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[var(--primary-color)]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                      </svg>
                    </span>
                    <span>me@anhnd.com</span>
                  </a>
                  <span className="text-[var(--text-color)]/20">•</span>
                  <a href="https://linkedin.com/in/anhngd" target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-[var(--primary-color)] transition-colors group">
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--primary-color)]/10 group-hover:bg-[var(--primary-color)]/20 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 text-[var(--primary-color)]">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </span>
                    <span>anhngd</span>
                  </a>
                  <span className="text-[var(--text-color)]/20">•</span>
                  <button onClick={() => window.location.href = '/blog'} className="flex items-center gap-2 hover:text-[var(--primary-color)] transition-colors group">
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--primary-color)]/10 group-hover:bg-[var(--primary-color)]/20 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[var(--primary-color)]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                      </svg>
                    </span>
                    <span>Blog</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-[var(--primary-color)]/5 to-[var(--secondary-color)]/5 blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-[var(--primary-color)]/5 to-[var(--secondary-color)]/5 blur-3xl"></div>
        </div>

        {/* Floating Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: showRest ? 1 : 0, y: showRest ? 0 : 30 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="fixed bottom-8 right-8 flex flex-col gap-4 sm:flex-row"
        >
          <button
            onClick={() => setActiveModal('about')}
            className="group w-14 h-14 rounded-full bg-[var(--bg-color)]/80 backdrop-blur-sm hover:bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/20 flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 relative overflow-hidden"
            aria-label="About"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-color)]/0 via-[var(--primary-color)]/0 to-[var(--primary-color)]/0 group-hover:from-[var(--primary-color)]/5 group-hover:via-[var(--primary-color)]/10 group-hover:to-[var(--primary-color)]/5 transition-all duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%]" />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[var(--primary-color)]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </button>
          
          <button
            onClick={() => setActiveModal('contact')}
            className="group w-14 h-14 rounded-full bg-[var(--bg-color)]/80 backdrop-blur-sm hover:bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/20 flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 relative overflow-hidden"
            aria-label="Contact"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-color)]/0 via-[var(--primary-color)]/0 to-[var(--primary-color)]/0 group-hover:from-[var(--primary-color)]/5 group-hover:via-[var(--primary-color)]/10 group-hover:to-[var(--primary-color)]/5 transition-all duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%]" />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[var(--primary-color)]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          </button>
          
          <button
            onClick={() => window.location.href = '/blog'}
            className="group w-14 h-14 rounded-full bg-[var(--bg-color)]/80 backdrop-blur-sm hover:bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/20 flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 relative overflow-hidden"
            aria-label="Blog"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-color)]/0 via-[var(--primary-color)]/0 to-[var(--primary-color)]/0 group-hover:from-[var(--primary-color)]/5 group-hover:via-[var(--primary-color)]/10 group-hover:to-[var(--primary-color)]/5 transition-all duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%]" />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[var(--primary-color)]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
          </button>
        </motion.div>

        {/* Modals */}
        <Modal
          isOpen={activeModal === 'contact'}
          onClose={() => setActiveModal(null)}
          title="Contact"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-20 py-6">
            {/* Left: Contact Info */}
            <div className="flex-1 min-w-[260px] max-w-md">
              <p className="mb-10 text-[var(--text-color)]/80 text-base md:text-lg font-light leading-relaxed">Feel free to reach out — I'm always open to new connections, collaborations, or just a friendly chat.</p>
              <ul className="space-y-8 text-[var(--text-color)]">
                <li className="flex items-center gap-5 group">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--primary-color)]/10 group-hover:bg-[var(--primary-color)]/20 transition-colors">
                    {/* LinkedIn SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 text-[var(--primary-color)]">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm text-[var(--text-color)]/60">LinkedIn</span>
                    <a href="https://linkedin.com/in/anhngd" target="_blank" rel="noopener" className="text-lg hover:text-[var(--primary-color)] transition-colors">linkedin.com/in/anhngd</a>
                  </div>
                </li>
                <li className="flex items-center gap-5 group">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--primary-color)]/10 group-hover:bg-[var(--primary-color)]/20 transition-colors">
                    {/* Email SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[var(--primary-color)]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm text-[var(--text-color)]/60">Email</span>
                    <a href="mailto:me@anhnd.com" className="text-lg hover:text-[var(--primary-color)] transition-colors">me@anhnd.com</a>
                  </div>
                </li>
              </ul>
            </div>
            {/* Right: Illustration */}
            <div className="flex-1 flex justify-center items-center">
              <div className="relative w-[260px] h-[260px] rounded-full bg-gradient-to-br from-[var(--primary-color)]/10 to-[var(--secondary-color)]/10 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary-color)]/5 to-[var(--secondary-color)]/5 rounded-full blur-xl"></div>
                <Image
                  src="/contact-hello.svg"
                  alt="Contact illustration"
                  width={200}
                  height={200}
                  className="w-[180px] h-auto relative z-10"
                  priority
                />
              </div>
            </div>
          </div>
        </Modal>


      </main>
    </>
  )
} 