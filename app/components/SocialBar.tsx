'use client'

import { motion } from 'framer-motion'

export default function SocialBar() {
  const socialLinks = [
    {
      name: 'Email',
      href: 'mailto:me@anhnd.com',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
      ),
      color: '#FF5F00'
    }
  ]

  return (
    <div className="fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8">
      <motion.div
        className="flex flex-col gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {/* Email Link */}
        {socialLinks.map((link, index) => (
          <motion.a
            key={link.name}
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="group flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#323130] shadow-md ring-1 ring-[#E1DFDD] transition-all duration-300 hover:shadow-lg hover:ring-2 sm:h-14 sm:w-14"
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
              delay: 0.2 + index * 0.1,
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

