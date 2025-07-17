'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function TypographyTemplate() {
  return (
    <main className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-bg dark:from-bg-dark to-bg/95 dark:to-bg-dark/95">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <Link href="/" className="flex items-center text-text/60 dark:text-text-dark/60 hover:text-[#FF5F00] transition-colors mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-4 h-4 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className="font-cormorant text-lg tracking-wide font-light">Home</span>
          </Link>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-playfair text-4xl md:text-5xl font-medium text-text dark:text-text-dark mb-4 tracking-wide"
          >
            Typography Template
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-cormorant text-xl text-text/70 dark:text-text-dark/70 tracking-wide font-light max-w-3xl"
          >
            This page showcases all typography elements used in blog posts for consistent styling reference.
          </motion.p>
        </div>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <div className="border-b border-text/10 dark:border-text-dark/10 pb-4 mb-6">
            <h2 className="font-playfair text-2xl font-medium text-text dark:text-text-dark">Headings</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <span className="text-xs text-text/40 dark:text-text-dark/40 font-mono block mb-2">h1 - font-playfair text-4xl md:text-5xl font-medium tracking-wide</span>
              <h1 className="font-playfair text-4xl md:text-5xl font-medium text-text dark:text-text-dark tracking-wide">Typography for Modern Interfaces</h1>
            </div>
            
            <div>
              <span className="text-xs text-text/40 dark:text-text-dark/40 font-mono block mb-2">h2 - font-playfair text-2xl font-medium tracking-wide</span>
              <h2 className="font-playfair text-2xl font-medium text-text dark:text-text-dark tracking-wide">Section Heading Example</h2>
            </div>
            
            <div>
              <span className="text-xs text-text/40 dark:text-text-dark/40 font-mono block mb-2">h3 - font-playfair text-xl font-medium tracking-wide</span>
              <h3 className="font-playfair text-xl font-medium text-text dark:text-text-dark tracking-wide">Subsection Heading Example</h3>
            </div>
            
            <div>
              <span className="text-xs text-text/40 dark:text-text-dark/40 font-mono block mb-2">h4 - font-playfair text-lg font-medium tracking-wide</span>
              <h4 className="font-playfair text-lg font-medium text-text dark:text-text-dark tracking-wide">Minor Section Heading</h4>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <div className="border-b border-text/10 dark:border-text-dark/10 pb-4 mb-6">
            <h2 className="font-playfair text-2xl font-medium text-text dark:text-text-dark">Body Text</h2>
          </div>
          
          <div className="space-y-8">
            <div>
              <span className="text-xs text-text/40 dark:text-text-dark/40 font-mono block mb-2">p - font-cormorant text-base tracking-wide leading-relaxed font-light</span>
              <p className="font-cormorant text-base tracking-wide leading-relaxed font-light text-text dark:text-text-dark">
                Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. 
                The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing, and letter-spacing, and adjusting 
                the space between pairs of letters. Type design is a closely related craft, sometimes considered part of typography.
              </p>
            </div>
            
            <div>
              <span className="text-xs text-text/40 dark:text-text-dark/40 font-mono block mb-2">p (larger) - font-cormorant text-xl tracking-wide font-light</span>
              <p className="font-cormorant text-xl tracking-wide font-light text-text/70 dark:text-text-dark/70">
                In contemporary use, the practice and study of typography is very broad, covering all aspects of letter design and application.
              </p>
            </div>
          </div>
        </motion.section>
        
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-16"
        >
          <div className="border-b border-text/10 dark:border-text-dark/10 pb-4 mb-6">
            <h2 className="font-playfair text-2xl font-medium text-text dark:text-text-dark">Lists</h2>
          </div>
          
          <div className="space-y-10">
            <div>
              <span className="text-xs text-text/40 dark:text-text-dark/40 font-mono block mb-4">Unordered List - prose-ul:my-4 prose-li:my-1 prose-li:font-light prose-li:text-base prose-li:tracking-wide prose-li:leading-relaxed</span>
              
              <div className="prose dark:prose-invert max-w-none font-cormorant">
                <ul>
                  <li>Typography includes the selection of typefaces</li>
                  <li>Point size, leading, tracking, and kerning are essential considerations</li>
                  <li>Proper hierarchy improves readability and user experience</li>
                  <li>Font pairing creates visual interest while maintaining coherence</li>
                </ul>
              </div>
            </div>
            
            <div>
              <span className="text-xs text-text/40 dark:text-text-dark/40 font-mono block mb-4">Ordered List - same styles as unordered list</span>
              
              <div className="prose dark:prose-invert max-w-none font-cormorant">
                <ol>
                  <li>Analyze the content's purpose and audience</li>
                  <li>Select appropriate typefaces for headings and body text</li>
                  <li>Establish a clear typographic hierarchy</li>
                  <li>Test readability across different screen sizes</li>
                </ol>
              </div>
            </div>
          </div>
        </motion.section>
        
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-16"
        >
          <div className="border-b border-text/10 dark:border-text-dark/10 pb-4 mb-6">
            <h2 className="font-playfair text-2xl font-medium text-text dark:text-text-dark">Inline Elements</h2>
          </div>
          
          <div className="space-y-6 font-cormorant text-base tracking-wide leading-relaxed font-light">
            <div>
              <span className="text-xs text-text/40 dark:text-text-dark/40 font-mono block mb-2">strong - prose-strong:text-text dark:prose-strong:text-text-dark prose-strong:font-medium</span>
              <p>Typography includes the thoughtful application of <strong>font styles</strong> and <strong>text formatting</strong> to improve communication.</p>
            </div>
            
            <div>
              <span className="text-xs text-text/40 dark:text-text-dark/40 font-mono block mb-2">em - (default italic style)</span>
              <p>The right typeface selection <em>dramatically affects</em> how content is perceived.</p>
            </div>
            
            <div>
              <span className="text-xs text-text/40 dark:text-text-dark/40 font-mono block mb-2">a - prose-a:text-[#FF5F00] prose-a:no-underline hover:prose-a:underline</span>
              <div className="prose dark:prose-invert">
                <p>Learn more about <a href="#">typography principles</a> and <a href="#">modern font stacks</a>.</p>
              </div>
            </div>
            
            <div>
              <span className="text-xs text-text/40 dark:text-text-dark/40 font-mono block mb-2">code - (inline code styling)</span>
              <div className="prose dark:prose-invert">
                <p>Use <code>font-family: system-ui</code> for a native font stack that adapts to the user's operating system.</p>
              </div>
            </div>
          </div>
        </motion.section>
        
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-16"
        >
          <div className="border-b border-text/10 dark:border-text-dark/10 pb-4 mb-6">
            <h2 className="font-playfair text-2xl font-medium text-text dark:text-text-dark">Blockquote</h2>
          </div>
          
          <span className="text-xs text-text/40 dark:text-text-dark/40 font-mono block mb-4">blockquote - styled with prose</span>
          
          <div className="prose dark:prose-invert max-w-none font-cormorant">
            <blockquote>
              <p>Typography is what language looks like. Good typography is measured by how well it reinforces the meaning of the text, not by some abstract scale of aesthetics.</p>
              <cite>— Robert Bringhurst</cite>
            </blockquote>
          </div>
        </motion.section>
        
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mb-16"
        >
          <div className="border-b border-text/10 dark:border-text-dark/10 pb-4 mb-6">
            <h2 className="font-playfair text-2xl font-medium text-text dark:text-text-dark">Code Block</h2>
          </div>
          
          <span className="text-xs text-text/40 dark:text-text-dark/40 font-mono block mb-4">pre {'>'} code - styled with prose</span>
          
          <div className="prose dark:prose-invert max-w-none font-cormorant">
            <pre><code>{`// Typography style in Tailwind CSS
const typography = {
  h1: 'font-playfair text-4xl md:text-5xl font-medium tracking-wide',
  p: 'font-cormorant text-base tracking-wide leading-relaxed font-light'
};`}</code></pre>
          </div>
        </motion.section>
        
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="border-b border-text/10 dark:border-text-dark/10 pb-4 mb-6">
            <h2 className="font-playfair text-2xl font-medium text-text dark:text-text-dark">Special Elements</h2>
          </div>
          
          <div className="space-y-10">
            <div>
              <span className="text-xs text-text/40 dark:text-text-dark/40 font-mono block mb-4">Category Label</span>
              <div className="text-xs text-text/40 dark:text-text-dark/40 px-2 py-1 tracking-wide font-light inline-block">
                Design
              </div>
            </div>
            
            <div>
              <span className="text-xs text-text/40 dark:text-text-dark/40 font-mono block mb-4">Date Display</span>
              <time className="font-cormorant text-sm text-text/40 dark:text-text-dark/40 tracking-wide font-light">
                July 17, 2025
              </time>
            </div>
            
            <div>
              <span className="text-xs text-text/40 dark:text-text-dark/40 font-mono block mb-4">Button/Link Styling</span>
              <div className="space-y-4">
                <button className="px-4 py-1.5 rounded-md border border-[#FF5F00] text-[#FF5F00] text-sm font-light tracking-wide hover:bg-[#FF5F00]/5 transition-colors">
                  Primary Action
                </button>
                
                <div>
                  <button className="px-3 py-1.5 border rounded-md text-sm transition-colors border-[#FF5F00] bg-[#FF5F00]/5 text-[#FF5F00]">
                    Selected Filter
                  </button>
                </div>
                
                <div>
                  <button className="px-3 py-1.5 border rounded-md text-sm transition-colors border-text/10 dark:border-text-dark/10 text-text/70 dark:text-text-dark/70 hover:border-[#FF5F00]/30">
                    Unselected Filter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  )
}
