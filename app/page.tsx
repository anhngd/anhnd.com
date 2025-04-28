'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 right-0 z-50 p-6">
        <div className="flex space-x-6">
          <Link href="#home" className="text-gray-600 hover:text-[#FF5F00] transition-colors duration-300">
            Home
          </Link>
          <Link href="#about" className="text-gray-600 hover:text-[#FF5F00] transition-colors duration-300">
            About
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex flex-col md:flex-row items-center justify-center px-4 md:px-8 py-20 md:py-40">
        <div className="flex flex-col items-center md:items-start space-y-8 md:space-y-12 order-2 md:order-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Hello, I'm <span className="text-[#FF5F00]">AnhND</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
              Full-stack Developer & UI/UX Enthusiast
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4"
          >
            <Link
              href="#about"
              className="px-6 py-3 bg-[#FF5F00] text-white rounded-lg hover:bg-[#FF5F00]/90 transition-colors duration-300 text-center"
            >
              Learn More
            </Link>
            <Link
              href="mailto:me@anhnd.com"
              className="px-6 py-3 border border-[#FF5F00] text-[#FF5F00] rounded-lg hover:bg-[#FF5F00]/10 transition-colors duration-300 text-center"
            >
              Contact Me
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative w-64 h-64 md:w-80 md:h-80 mb-12 md:mb-0 order-1 md:order-2"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF5F00] to-[#FF5F00]/20 rounded-full blur-3xl opacity-20 animate-pulse" />
          <Image
            src="/avatar.png"
            alt="AnhND"
            fill
            className="rounded-full object-cover"
            priority
          />
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-40 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center"
          >
            About Me
          </motion.h2>
          <div className="space-y-6 text-gray-600">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              I am a Full-stack Developer with a strong background in Applied Mathematics and Computer Science. My journey in technology began with a passion for solving complex problems and creating innovative solutions.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              With over 5 years of experience in digital transformation projects, I have worked with various technologies and frameworks to build scalable and efficient applications. My expertise spans across both frontend and backend development, with a particular focus on creating seamless user experiences.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Currently, I am working in the gaming industry, where I combine my technical skills with creative problem-solving to develop engaging gaming experiences. I am particularly interested in the intersection of technology and user experience, constantly exploring new ways to make digital interactions more intuitive and enjoyable.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            >
              Outside of coding, I am passionate about management and leadership. I believe in the power of effective communication and collaboration to drive successful projects and build strong teams.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 md:py-40 px-4 md:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center"
          >
            Get in Touch
          </motion.h2>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex items-center space-x-4"
            >
              <div className="w-10 h-10 bg-[#FF5F00]/10 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-[#FF5F00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <a href="mailto:me@anhnd.com" className="text-gray-900 hover:text-[#FF5F00] transition-colors duration-300">me@anhnd.com</a>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex items-center space-x-4"
            >
              <div className="w-10 h-10 bg-[#FF5F00]/10 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-[#FF5F00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="text-gray-900">Vietnam</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex items-center space-x-4"
            >
              <div className="w-10 h-10 bg-[#FF5F00]/10 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-[#FF5F00]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">LinkedIn</p>
                <a href="https://linkedin.com/in/anhngd" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-[#FF5F00] transition-colors duration-300">anhngd</a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
} 