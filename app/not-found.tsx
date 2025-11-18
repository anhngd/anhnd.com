'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function NotFound() {
  const [mounted, setMounted] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (!mounted) return null

  return (
    <main 
      className="min-h-screen bg-white flex items-center justify-center p-6 overflow-hidden relative"
      style={{ fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif' }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-5"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, #FF5F00 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, #EB001B 0%, transparent 50%)',
            'radial-gradient(circle at 50% 80%, #FF5F00 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, #EB001B 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* 404 Number with parallax effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            x: mousePosition.x,
            y: mousePosition.y,
          }}
          transition={{ 
            opacity: { duration: 0.6 },
            scale: { duration: 0.6 },
            x: { duration: 0.3 },
            y: { duration: 0.3 },
          }}
          className="mb-8 sm:mb-12"
        >
          <h1 
            className="text-[120px] sm:text-[180px] md:text-[240px] lg:text-[300px] font-light leading-none tracking-tight"
            style={{ 
              fontWeight: 300,
              background: 'linear-gradient(135deg, #FF5F00 0%, #EB001B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            404
          </h1>
        </motion.div>

        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-[#323130] mb-4 sm:mb-6 font-light" style={{ fontWeight: 300 }}>
            Page Not Found
          </h2>
          <p className="text-base sm:text-lg text-[#605E5C] max-w-2xl mx-auto leading-relaxed font-light" style={{ fontWeight: 300 }}>
            The page you're looking for doesn't exist or has been moved. 
            <br className="hidden sm:block" />
            Perhaps it's exploring the metaverse? 🚀
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
        >
          <Link
            href="/"
            className="bg-[#FF5F00] text-white hover:bg-[#EB001B] active:bg-[#D10019] transition-all duration-150 flex items-center justify-center gap-2 font-light rounded-sm shadow-sm hover:shadow-md px-8 py-3 text-base w-full sm:w-auto"
            style={{ 
              boxShadow: '0 1.6px 3.6px rgba(0,0,0,.132), 0 .3px .9px rgba(0,0,0,.108)',
              fontWeight: 300
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <span>Back to Home</span>
          </Link>

          <Link
            href="/#blog-section"
            className="bg-white border border-[#8A8886] text-[#323130] hover:bg-[#F3F2F1] active:bg-[#EDEBE9] transition-all duration-150 flex items-center justify-center gap-2 font-light rounded-sm px-8 py-3 text-base w-full sm:w-auto"
            style={{ fontWeight: 300 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <span>Browse Notes</span>
          </Link>
        </motion.div>

        {/* Fun floating elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: i % 2 === 0 ? '#FF5F00' : '#EB001B',
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </main>
  )
}

