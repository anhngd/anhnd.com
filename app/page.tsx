'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ThemeProvider from './components/ThemeProvider'
import ThemeSwitch from './components/ThemeSwitch'
import Modal from './components/Modal'
import { motion } from 'framer-motion'

export default function Home() {
  const [activeModal, setActiveModal] = useState<'about' | 'contact' | 'blog' | null>(null)
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)
  const [showText, setShowText] = useState(false)
  const [showAvatar, setShowAvatar] = useState(false)
  const [showRest, setShowRest] = useState(false)
  const [displayedText, setDisplayedText] = useState('')

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
      <main className="h-screen flex flex-col overflow-hidden bg-gradient-to-b from-[var(--bg-color)] to-[var(--bg-color)]/95">
        {/* Theme Switch */}
        <div className="absolute top-4 right-8 md:right-16 lg:right-24 z-10">
          <ThemeSwitch />
        </div>

        {/* Main Content */}
        <section className="flex-1 flex flex-col items-center justify-center px-8 md:px-16 lg:px-24">
          <div className="max-w-7xl mx-auto w-full">
            {/* Avatar and Name */}
            <div className="flex flex-col items-center space-y-4 sm:space-y-6 mb-8 sm:mb-12">
              {/* Avatar */}
              <motion.div
                className="relative w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: showAvatar ? 1 : 0, scale: showAvatar ? 1 : 0.9 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-color)]/10 to-[var(--secondary-color)]/10 rounded-full transform rotate-6 transition-transform duration-500 group-hover:rotate-12"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-color)]/5 to-[var(--secondary-color)]/5 rounded-full transform -rotate-6 transition-transform duration-500 group-hover:-rotate-12"></div>
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
                className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-[var(--text-color)] tracking-tight leading-tight text-center min-h-[2.5em] sm:min-h-[3.5em]"
                initial={{ opacity: 0 }}
                animate={{ opacity: showText ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block text-3xl md:text-4xl lg:text-5xl opacity-90">
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
                {/* Place any additional content here if needed */}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Bottom Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: showRest ? 1 : 0, y: showRest ? 0 : 30 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="fixed bottom-0 left-0 right-0 bg-[var(--bg-color)]/80 backdrop-blur-sm border-t border-[var(--primary-color)]/10"
        >
          <div className="flex justify-center">
            <div className="grid grid-cols-3 w-full">
              <button
                onClick={() => setActiveModal('about')}
                onMouseEnter={() => setHoveredButton('about')}
                onMouseLeave={() => setHoveredButton(null)}
                className="group h-20 w-full bg-[var(--bg-color)] hover:bg-[var(--primary-color)]/5 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-[var(--primary-color)]/10 border-r border-[var(--primary-color)]/10 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-color)]/0 via-[var(--primary-color)]/0 to-[var(--primary-color)]/0 group-hover:from-[var(--primary-color)]/5 group-hover:via-[var(--primary-color)]/10 group-hover:to-[var(--primary-color)]/5 transition-all duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%]" />
                <span className={`relative text-xl font-[var(--font-cormorant)] text-[var(--text-color)] tracking-wider transition-all duration-300 ${hoveredButton === 'about' ? 'text-[var(--primary-color)]' : ''}`}>About</span>
              </button>

              <button
                onClick={() => setActiveModal('contact')}
                onMouseEnter={() => setHoveredButton('contact')}
                onMouseLeave={() => setHoveredButton(null)}
                className="group h-20 w-full bg-[var(--bg-color)] hover:bg-[var(--primary-color)]/5 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-[var(--primary-color)]/10 border-r border-[var(--primary-color)]/10 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-color)]/0 via-[var(--primary-color)]/0 to-[var(--primary-color)]/0 group-hover:from-[var(--primary-color)]/5 group-hover:via-[var(--primary-color)]/10 group-hover:to-[var(--primary-color)]/5 transition-all duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%]" />
                <span className={`relative text-xl font-[var(--font-cormorant)] text-[var(--text-color)] tracking-wider transition-all duration-300 ${hoveredButton === 'contact' ? 'text-[var(--primary-color)]' : ''}`}>Contact</span>
              </button>

              <button
                onClick={() => setActiveModal('blog')}
                onMouseEnter={() => setHoveredButton('blog')}
                onMouseLeave={() => setHoveredButton(null)}
                className="group h-20 w-full bg-[var(--bg-color)] hover:bg-[var(--primary-color)]/5 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-[var(--primary-color)]/10 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-color)]/0 via-[var(--primary-color)]/0 to-[var(--primary-color)]/0 group-hover:from-[var(--primary-color)]/5 group-hover:via-[var(--primary-color)]/10 group-hover:to-[var(--primary-color)]/5 transition-all duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%]" />
                <span className={`relative text-xl font-[var(--font-cormorant)] text-[var(--text-color)] tracking-wider transition-all duration-300 ${hoveredButton === 'blog' ? 'text-[var(--primary-color)]' : ''}`}>Blog</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Modals */}
        <Modal
          isOpen={activeModal === 'about'}
          onClose={() => setActiveModal(null)}
          title="About Me"
        >
          <div className="space-y-8 text-secondary text-lg leading-relaxed tracking-wide font-[var(--font-lora)]">
            <p>
              My name is Anh. My background is in Applied Mathematics and Computer Science. With an engineering degree and a Master of Science in Applied Mathematics from Hanoi University of Science and Technology, I've built a strong academic foundation, a systematic mindset, and the ability to work through complex, uncertain problems.
            </p>
            <p>
              I spent over six years working on digital transformation projects for government agencies – from central ministries to local departments. Through those projects, I realized that technology only creates real value when we understand how people and systems actually work.
            </p>
            <p>
              Since 2020, I've been in the gaming industry. I've worked on both traditional online games and GameFi projects – where gaming meets blockchain technology. These days, I focus on applying data and AI to real-world use cases, especially in business operations and product development.
            </p>
            <p>
              Lately, I've also been learning about management – not to become a boss (at least not yet), but to better understand how people work together: in teams, in projects, and in the everyday flow of work.
            </p>
            <p>
              This website is where I quietly write down what I've learned, built, and been curious about. A way to look back at the journey – with clarity and honesty.
            </p>
          </div>
        </Modal>

        <Modal
          isOpen={activeModal === 'contact'}
          onClose={() => setActiveModal(null)}
          title="Contact"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-20">
            {/* Left: Contact Info */}
            <div className="flex-1 min-w-[260px] max-w-md">
              <p className="mb-8 text-secondary text-base md:text-lg font-[var(--font-cormorant)]">Feel free to reach out — I'm always open to new connections, collaborations, or just a friendly chat.</p>
              <ul className="space-y-6 text-[var(--text-color)]">
                <li className="flex items-center gap-4">
                  <span className="inline-flex items-center justify-center w-7 h-7">
                    {/* LinkedIn SVG */}
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#0077b5]">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </span>
                  <a href="https://linkedin.com/in/anhngd" target="_blank" rel="noopener" className="underline hover:text-[var(--primary-color)] transition-colors">LinkedIn: anhngd</a>
                </li>
                <li className="flex items-center gap-4">
                  <span className="inline-flex items-center justify-center w-7 h-7">
                    {/* Email SVG */}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[var(--primary-color)]">
                      <rect x="3" y="5" width="18" height="14" rx="2" fill="none"/>
                      <path d="M3 7l9 6 9-6" />
                    </svg>
                  </span>
                  <a href="mailto:me@anhnd.com" className="underline hover:text-[var(--primary-color)] transition-colors">me@anhnd.com</a>
                </li>
              </ul>
            </div>
            {/* Right: Illustration */}
            <div className="flex-1 flex justify-center items-center">
              <Image
                src="/contact-hello.svg"
                alt="Contact illustration"
                width={260}
                height={200}
                className="w-[220px] md:w-[260px] h-auto"
                priority
              />
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={activeModal === 'blog'}
          onClose={() => setActiveModal(null)}
          title="Blog"
        >
          <div className="text-center py-12">
            <p className="text-secondary text-xl font-[var(--font-cormorant)]">Coming soon...</p>
          </div>
        </Modal>
      </main>
    </>
  )
} 