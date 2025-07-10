'use client'

import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

// More sophisticated page transitions
const variants = {
  hidden: { opacity: 0, x: 0, y: 20 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: -20 },
}

// Custom page transitions based on route
const getTransition = (pathname: string) => {
  // Notes page - slower, more elegant transition
  if (pathname.includes('/notes')) {
    return { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
  
  // Blog page - standard transition
  if (pathname.includes('/blog')) {
    return { duration: 0.4, ease: 'easeInOut' }
  }
  
  // Default transition
  return { duration: 0.3, ease: 'easeOut' }
}

export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  
  return (
    <div className="page-transition-wrapper overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial="hidden"
          animate="enter"
          exit="exit"
          variants={variants}
          transition={getTransition(pathname)}
          className="min-h-[calc(100vh-80px)]"
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  )
}
