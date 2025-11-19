'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface BlogPost {
  id: string
  title: string
  date: string
  excerpt: string
  category: string
}

interface BlogListProps {
  posts: BlogPost[]
}

export default function BlogList({ posts }: BlogListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 5

  const totalPosts = posts.length
  const totalPages = Math.ceil(totalPosts / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const currentPosts = posts.slice(startIndex, endIndex)

  return (
    <>
      <div className="space-y-6 sm:space-y-8">
        {currentPosts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group border-b border-[#E1DFDD] pb-6 sm:pb-8 last:border-b-0"
          >
            <Link href={`/notes/${post.id}`} className="block">
              {/* Tag and Date */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <span className="text-xs font-medium text-[#FF5F00] uppercase tracking-wider">
                  {post.category}
                </span>
                <span className="text-[#E1DFDD]">•</span>
                <time className="text-xs sm:text-sm text-[#605E5C] font-light" style={{ fontWeight: 300 }}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </time>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-[#323130] mb-2 sm:mb-3 group-hover:text-[#FF5F00] transition-all duration-200" style={{ fontWeight: 300, letterSpacing: '-0.02em' }}>
                {post.title}
              </h2>

              {/* Excerpt */}
              <p className="text-sm sm:text-base text-[#605E5C] font-light leading-relaxed" style={{ fontWeight: 300 }}>
                {post.excerpt}
              </p>

              {/* Read More Link */}
              <div className="mt-3 sm:mt-4 flex items-center gap-2 text-sm font-medium text-[#323130] group-hover:text-[#FF5F00] transition-all duration-200">
                <span>Read more</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          className="flex items-center justify-center gap-2 mt-8 sm:mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 sm:px-4 sm:py-2 text-sm rounded-lg border border-[#E1DFDD] text-[#323130] hover:bg-[#F3F2F1] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Previous
          </button>

          <div className="flex items-center gap-1 sm:gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 sm:w-10 sm:h-10 text-sm rounded-lg transition-all duration-200 ${
                  currentPage === page
                    ? 'bg-[#FF5F00] text-white'
                    : 'border border-[#E1DFDD] text-[#323130] hover:bg-[#F3F2F1]'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 sm:px-4 sm:py-2 text-sm rounded-lg border border-[#E1DFDD] text-[#323130] hover:bg-[#F3F2F1] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Next
          </button>
        </motion.div>
      )}
    </>
  )
}

