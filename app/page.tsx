'use client'

import Image from 'next/image'
import Link from 'next/link'
import ThemeProvider from './components/ThemeProvider'
import ThemeSwitch from './components/ThemeSwitch'
import AnimatedSection from './components/AnimatedSection'
import AnimatedContent from './components/AnimatedContent'

export default function Home() {
  return (
    <>
      <ThemeProvider />
      <main className="min-h-screen">
        {/* Navigation Bar */}
        <nav className="fixed top-0 left-0 right-0 z-50 py-4 md:py-12 px-8 md:px-16 lg:px-24 nav-bg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-12">
              <Link 
                href="#home" 
                className="text-secondary hover:text-[var(--primary-color)] transition-all duration-300 transform hover:scale-105 text-base font-normal tracking-wide"
              >
                Home
              </Link>
              <Link 
                href="#about" 
                className="text-secondary hover:text-[var(--primary-color)] transition-all duration-300 transform hover:scale-105 text-base font-normal tracking-wide"
              >
                About
              </Link>
            </div>
            <ThemeSwitch />
          </div>
        </nav>

        {/* Hero Section with Google-style Layout */}
        <section id="home" className="flex flex-col md:flex-row items-center justify-between min-h-screen px-8 md:px-16 lg:px-24 max-w-7xl mx-auto pt-32 md:pt-0">
          {/* Avatar Image - First on Mobile */}
          <AnimatedContent 
            className="flex-1 flex justify-center md:justify-end order-1 md:order-2"
            delay={0.2}
          >
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 mb-8 sm:mb-12 md:mb-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-color)]/10 to-[var(--secondary-color)]/10 rounded-full transform rotate-6"></div>
              <Image
                src="/avatar.png"
                alt="AnhND"
                fill
                className="object-cover rounded-full relative z-10 shadow-2xl"
                priority
              />
            </div>
          </AnimatedContent>

          {/* Text Content - Second on Mobile */}
          <AnimatedContent 
            className="flex-1 space-y-12 text-center md:text-left order-2 md:order-1"
            delay={0}
          >
            <div className="max-w-2xl animate-fade-in">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-[var(--text-color)] tracking-tight leading-tight">
                <span className="inline-block text-5xl md:text-6xl lg:text-7xl">Hello,</span><br />
                <span className="inline-flex items-center">
                  <span className="text-[var(--primary-color)] inline-block typing-animation text-6xl md:text-7xl lg:text-8xl">I'm AnhND</span>
                </span>
              </h1>
              {/* Buttons - Third on Mobile */}
              <div className="flex flex-col md:flex-row gap-8 justify-center md:justify-start mt-16 order-3">
                <Link
                  href="#contact" 
                  className="px-10 py-4 text-white bg-[var(--primary-color)] rounded-full hover:bg-[var(--secondary-color)] transition-all duration-300 transform hover:scale-105 text-base font-normal tracking-wide shadow-lg hover:shadow-xl"
                >
                  Get in Touch
                </Link>
                <Link
                  href="#projects" 
                  className="px-10 py-4 text-[var(--primary-color)] border-2 border-[var(--primary-color)] rounded-full hover:bg-[var(--primary-color)]/10 transition-all duration-300 transform hover:scale-105 text-base font-normal tracking-wide"
                >
                  View Projects
                </Link>
              </div>
            </div>
          </AnimatedContent>
        </section>

        {/* About Section */}
        <AnimatedSection id="about" className="py-40 bg-section">
          <div className="max-w-5xl mx-auto px-8">
            <AnimatedContent delay={0.2}>
              <h2 className="text-5xl font-light text-[var(--text-color)] mb-20 font-[var(--font-playfair)]">
                About Me
              </h2>
            </AnimatedContent>
            <AnimatedContent delay={0.4}>
              <div className="space-y-10 text-secondary text-lg leading-relaxed tracking-wide font-[var(--font-cormorant)]">
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
            </AnimatedContent>
          </div>
        </AnimatedSection>

        {/* Contact Section */}
        <AnimatedSection id="contact" className="py-40">
          <div className="max-w-5xl mx-auto px-8">
            <AnimatedContent delay={0.2}>
              <h2 className="text-5xl font-light text-[var(--text-color)] mb-20">
                Let's Connect
              </h2>
            </AnimatedContent>
            <AnimatedContent delay={0.4}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Left Column - Text */}
                <div className="md:col-span-2 space-y-8">
                  <div>
                    <h3 className="text-3xl font-light text-[var(--text-color)] mb-6">Get in Touch</h3>
                    <p className="text-secondary leading-relaxed text-lg tracking-wide font-[var(--font-cormorant)]">
                      I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions. Let's create something amazing together!
                    </p>
                  </div>
                </div>

                {/* Right Column - Contact Info */}
                <div className="space-y-6">
                  <div className="group flex items-center space-x-6 p-8 rounded-3xl bg-[var(--bg-color)] hover:bg-[var(--primary-color)]/10 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-[var(--primary-color)]/10">
                    <span className="text-4xl group-hover:text-[var(--primary-color)] transition-colors duration-300">📧</span>
                    <div>
                      <p className="text-secondary text-lg tracking-wide">Email</p>
                      <a href="mailto:me@anhnd.com" className="text-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors duration-300 text-xl">me@anhnd.com</a>
                    </div>
                  </div>
                  <div className="group flex items-center space-x-6 p-8 rounded-3xl bg-[var(--bg-color)] hover:bg-[var(--primary-color)]/10 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-[var(--primary-color)]/10">
                    <Link 
                      href="https://linkedin.com/in/anhngd" 
                      className="text-4xl group-hover:text-[var(--primary-color)] transition-colors duration-300"
                    >
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </Link>
                    <div>
                      <p className="text-secondary text-lg tracking-wide">LinkedIn</p>
                      <Link 
                        href="https://linkedin.com/in/anhngd" 
                        className="text-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors duration-300 text-xl"
                      >
                        anhngd
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedContent>
          </div>
        </AnimatedSection>

        {/* Footer */}
        <footer className="py-8 px-8 text-center md:text-left">
          <div className="max-w-5xl mx-auto">
            <div className="text-secondary text-sm">
              <p>© {new Date().getFullYear()} AnhND. All rights reserved.</p>
              <p className="mt-2">Built with Next.js and Tailwind CSS</p>
              <p className="mt-2">Version 1.0.0</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
} 