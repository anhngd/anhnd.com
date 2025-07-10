'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ThemeSwitch from './components/ThemeSwitch'
import { motion } from 'framer-motion'
import StructuredData from './components/StructuredData'
import { Metadata } from 'next'

export default function Home() {
  // Use Mastercard orange as primary color - already configured in tailwind.config.ts
  const [text, setText] = useState('')
  const [fullText] = useState('Hello, I\'m AnhND.')
  const [index, setIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const [showRest, setShowRest] = useState(false)

  // Typing effect
  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setText(prevText => prevText + fullText[index])
        setIndex(prevIndex => prevIndex + 1)
      }, index === 23 ? 500 : Math.random() * 120 + 30) // Longer pause after first line

      return () => clearTimeout(timeout)
    } else {
      // Show the rest of the content after typing is complete
      setTimeout(() => {
        setShowRest(true)
      }, 500)
    }
  }, [fullText, index])

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(cursor => !cursor)
    }, 530)

    return () => clearInterval(interval)
  }, [])

  return (
    <main className="h-screen flex flex-col overflow-hidden bg-gradient-to-b from-bg dark:from-bg-dark to-bg/95 dark:to-bg-dark/95 relative">
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
      {/* Theme Switch */}
      <div className="absolute top-4 right-8 md:right-16 lg:right-24 z-10">
        <ThemeSwitch />
      </div>

      {/* Main Content */}
      <section className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="max-w-5xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-8 space-y-10">
              <h1 className="text-5xl lg:text-7xl font-playfair font-light text-text dark:text-text-dark tracking-wider">
                {text}
                <span className={`ml-1 font-light ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100 text-primary`}>_</span>
              </h1>
              
              {showRest && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-10"
                >
                  <div className="flex flex-wrap gap-8 text-2xl font-cormorant font-light text-text/80 dark:text-text-dark/80 tracking-wide">
                    <a href="mailto:me@anhnd.com" className="flex items-center gap-3 hover:text-primary transition-colors group">
                      <span className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-5 h-5 text-primary">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                        </svg>
                      </span>
                      <span className="font-light tracking-wider">me@anhnd.com</span>
                    </a>
                    
                    <span className="text-text/20 dark:text-text-dark/20">•</span>
                    
                    <a href="https://linkedin.com/in/anhngd" target="_blank" rel="noopener" className="flex items-center gap-3 hover:text-primary transition-colors group">
                      <span className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-primary">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </span>
                      <span className="font-light tracking-wider">anhngd</span>
                    </a>
                    
                    <span className="text-text/20 dark:text-text-dark/20">•</span>
                    
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
            
            {showRest && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="md:col-span-4"
              >
                <div className="relative w-[280px] h-[280px] rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5 rounded-full blur-xl"></div>
                  <Image
                    src="/avatar.png"
                    alt="AnhND"
                    width={220}
                    height={220}
                    className="rounded-full"
                    priority
                  />
                </div>
              </motion.div>
            )}
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
          className="group w-14 h-14 rounded-full bg-bg/80 dark:bg-bg-dark/80 backdrop-blur-sm hover:bg-primary/10 border border-primary/20 flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 relative overflow-hidden"
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
          className="group w-14 h-14 rounded-full bg-bg/80 dark:bg-bg-dark/80 backdrop-blur-sm hover:bg-primary/10 border border-primary/20 flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 relative overflow-hidden"
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
