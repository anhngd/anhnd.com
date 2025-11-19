'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function SocialBar() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render until mounted to avoid SSR issues
  if (!mounted) {
    return null
  }

  const socialLinks = [
    {
      name: 'Email',
      href: 'mailto:hi@anhnd.com',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
      ),
      color: '#FF5F00'
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/in/anhngd',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      color: '#0078D4'
    }
  ]

  return (
    <div className="fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8">
      <motion.div
        className="flex flex-col gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, staggerChildren: 0.1 }}
      >
        {socialLinks.map((link, index) => (
          <motion.a
            key={link.name}
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="group flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#323130] shadow-md ring-1 ring-[#E1DFDD] transition-all duration-300 hover:shadow-lg hover:ring-2 dark:bg-[#252525] dark:text-[#E1DFDD] dark:ring-[#3B3A39] sm:h-14 sm:w-14"
            whileHover={{ 
              scale: 1.1, 
              y: -4,
              boxShadow: `0 10px 30px -10px ${link.color}50`
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: 0.3 + index * 0.1,
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
            aria-label={link.name}
          >
            <div 
              className="transition-all duration-300 group-hover:scale-110"
              style={{
                color: `${link.color}`
              }}
            >
              {link.icon}
            </div>
          </motion.a>
        ))}
      </motion.div>
    </div>
  )
}

