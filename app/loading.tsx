'use client'

import { motion } from 'framer-motion'

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-bg/50 dark:bg-bg-dark/50 backdrop-blur-sm z-50">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-t-2 border-b-2 border-[#FF5F00] animate-spin"></div>
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="h-8 w-8 rounded-full bg-[#FF5F00]/20"></div>
          </motion.div>
        </div>
        <motion.p 
          className="mt-4 text-xl font-light text-[#FF5F00] font-cormorant"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  )
}
