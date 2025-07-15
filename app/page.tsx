'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
// ThemeSwitch removed - only using light mode
import { motion } from 'framer-motion'
import StructuredData from './components/StructuredData'
import { Metadata } from 'next'

export default function Home() {
  // Use Mastercard orange as primary color - already configured in tailwind.config.ts
  const [helloText, setHelloText] = useState('')
  const [nameText, setNameText] = useState('')
  const [isTypingHello, setIsTypingHello] = useState(true)
  const [index, setIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const [showRest, setShowRest] = useState(false)

  const helloFullText = "Hello,"
  const nameFullText = "I am AnhND."

  // Typing effect
  useEffect(() => {
    if (isTypingHello && index < helloFullText.length) {
      const timeout = setTimeout(() => {
        setHelloText(prevText => prevText + helloFullText[index])
        setIndex(prevIndex => prevIndex + 1)
      }, Math.random() * 120 + 30)

      return () => clearTimeout(timeout)
    } else if (isTypingHello && index >= helloFullText.length) {
      // Switch to typing the name after a pause
      const timeout = setTimeout(() => {
        setIsTypingHello(false)
        setIndex(0) // Reset index for name typing
      }, 500)
      
      return () => clearTimeout(timeout)
    } else if (!isTypingHello && index < nameFullText.length) {
      const timeout = setTimeout(() => {
        setNameText(prevText => prevText + nameFullText[index])
        setIndex(prevIndex => prevIndex + 1)
      }, Math.random() * 120 + 30)

      return () => clearTimeout(timeout)
    } else if (!isTypingHello && index >= nameFullText.length) {
      // Show the rest of the content after typing is complete
      setTimeout(() => {
        setShowRest(true)
      }, 500)
    }
  }, [helloFullText, nameFullText, index, isTypingHello])

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(cursor => !cursor)
    }, 530)

    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen h-full flex flex-col overflow-hidden bg-gradient-to-b from-white to-[#f4f4f4] relative">
      <StructuredData 
        type="Person"
        data={{
          name: 'AnhND',
          jobTitle: 'Full-stack Developer',
          url: 'https://anhnd.com',
          sameAs: [
            'https://github.com/anhnd',
            'https://linkedin.com/in/anhnd'
          ]
        }}
      />
      {/* Theme Switch removed - only using light mode */}

      {/* Main Content */}
      <section className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 md:p-8 min-h-[600px]">
        <div className="max-w-5xl w-full py-3 sm:py-0 my-auto">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-12 items-center">
            {/* Avatar - On mobile it appears first, on desktop it appears last */}
            <motion.div
              className="sm:col-span-5 flex justify-center sm:justify-end items-center order-first sm:order-last mb-4 sm:mb-0 mt-6 sm:mt-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] md:w-[220px] md:h-[220px] lg:w-[240px] lg:h-[240px]">
                <Image
                  src="/avatar.png"
                  alt="AnhND"
                  fill
                  sizes="(max-width: 640px) 160px, (max-width: 768px) 200px, (max-width: 1024px) 220px, 240px"
                  className="rounded-full object-cover"
                  priority
                />
              </div>
            </motion.div>
            <div className="sm:col-span-7 space-y-4 sm:space-y-6 md:space-y-8 order-last sm:order-first px-2 sm:px-0">
              <div className="space-y-2 sm:space-y-3 md:space-y-4 pb-2">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-jakarta font-light text-black tracking-wide sm:tracking-widest leading-tight letter-spacing-[-.02em]">
                  {helloText}
                  {isTypingHello && <span className={`ml-1 font-light ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100 text-primary`}>_</span>}
                </h1>
                <h2 className="text-2xl sm:text-3xl lg:text-5xl font-jakarta font-light text-black tracking-wide letter-spacing-[-.01em]">
                  {nameText}
                  {!isTypingHello && <span className={`ml-1 font-light ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100 text-primary`}>_</span>}
                </h2>
              </div>
              
              {showRest && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-4 sm:mt-6"
                >
                  <div className="flex flex-wrap gap-4 sm:gap-6 items-center pt-2">
                    <a href="https://linkedin.com/in/anhngd" target="_blank" rel="noopener" className="flex items-center gap-3 hover:text-primary transition-colors group">
                      <span className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-primary">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </span>
                      <span className="font-light tracking-wider">anhngd</span>
                    </a>
                    
                    <span className="text-[#666666]/40">•</span>
                    
                    <a href="mailto:me@anhnd.com" className="flex items-center gap-3 hover:text-primary transition-colors group">
                      <span className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-5 h-5 text-primary">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                        </svg>
                      </span>
                      <span className="font-light tracking-wider">me@anhnd.com</span>
                    </a>
                    
                    <span className="text-[#666666]/40">•</span>
                    
                    <Link href="/notes" className="flex items-center gap-3 hover:text-primary transition-colors group">
                      <span className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-5 h-5 text-primary">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                        </svg>
                      </span>
                      <span className="font-light tracking-wider">Notes</span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] right-[-15%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-primary/5 to-secondary/5 blur-3xl"></div>
        <div className="absolute bottom-[-15%] left-[-15%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-primary/5 to-secondary/5 blur-3xl"></div>
      </div>

      {/* Floating Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: showRest ? 1 : 0, y: showRest ? 0 : 30 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="fixed bottom-8 right-8 flex flex-col gap-4 z-10"
      >
        <Link
          href="/notes"
          className="group w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm hover:bg-[#FF7700]/10 border border-[#FF7700]/20 flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/10 group-hover:to-primary/5 transition-all duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%]"></div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-6 h-6 text-primary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
        </Link>

        <a
          href="https://linkedin.com/in/anhngd"
          target="_blank"
          rel="noopener noreferrer"
          className="group w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm hover:bg-[#FF7700]/10 border border-[#FF7700]/20 flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/10 group-hover:to-primary/5 transition-all duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%]"></div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 text-primary">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
      </motion.div>
    </main>
  )
}
