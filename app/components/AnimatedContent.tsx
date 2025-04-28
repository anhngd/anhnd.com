'use client'

import { motion } from 'framer-motion'

interface AnimatedContentProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export default function AnimatedContent({ children, className, delay = 0 }: AnimatedContentProps) {
  return (
    <motion.div 
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  )
} 