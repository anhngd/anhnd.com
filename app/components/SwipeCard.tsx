'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, PanInfo, useSpring } from 'framer-motion'

interface SwipeCardProps {
  segments: string[]
  currentSegment: number
  onSegmentChange: (index: number) => void
  onNextPost?: () => void
  onPrevPost?: () => void
}

export default function SwipeCard({
  segments,
  currentSegment,
  onSegmentChange,
  onNextPost,
  onPrevPost
}: SwipeCardProps) {
  const [dragOffset, setDragOffset] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Motion values for smooth animations
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Transform drag to rotate and scale
  const rotate = useTransform(x, [-300, 0, 300], [-30, 0, 30])
  const scale = useTransform(x, [-300, 0, 300], [0.9, 1, 0.9])

  // Handle horizontal drag (left/right for segments)
  const handleDragEnd = (event: any, info: PanInfo) => {
    const { offset, velocity } = info

    // Horizontal swipe threshold
    const swipeThreshold = 100
    const velocityThreshold = 500

    if (Math.abs(offset.x) > swipeThreshold || Math.abs(velocity.x) > velocityThreshold) {
      if (offset.x > 0) {
        // Swipe right - previous segment
        const prevIndex = currentSegment - 1
        if (prevIndex >= 0) {
          onSegmentChange(prevIndex)
        }
      } else {
        // Swipe left - next segment
        const nextIndex = currentSegment + 1
        if (nextIndex < segments.length) {
          onSegmentChange(nextIndex)
        }
      }
    }

    // Vertical swipe for post navigation
    if (Math.abs(offset.y) > swipeThreshold || Math.abs(velocity.y) > velocityThreshold) {
      if (offset.y > 0 && onPrevPost) {
        // Swipe down - previous post
        onPrevPost()
      } else if (offset.y < 0 && onNextPost) {
        // Swipe up - next post
        onNextPost()
      }
    }

    // Reset position
    x.set(0)
    y.set(0)
  }

  // Animation variants for card transitions
  const cardVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
  }

  const swipeDirection = useRef(1)

  useEffect(() => {
    swipeDirection.current = 1
  }, [currentSegment])

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Progress indicators */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex space-x-2">
          {segments.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSegment
                  ? 'bg-[#FF5F00]'
                  : 'bg-[#E1DFDD]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation hints */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex items-center space-x-4 text-[#8A8886] text-sm font-light">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span>Swipe</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>Next post</span>
          </div>
        </div>
      </div>

      {/* Swipeable card */}
      <div
        ref={containerRef}
        className="h-full flex items-center justify-center"
      >
        <motion.div
          key={currentSegment}
          style={{
            x,
            y,
            rotate,
            scale,
          }}
          variants={cardVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
            scale: { duration: 0.2 }
          }}
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.7}
          onDragEnd={handleDragEnd}
          className="w-full max-w-2xl mx-auto h-full flex items-center justify-center p-6 cursor-grab active:cursor-grabbing"
        >
          <div
            className="w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-[#E1DFDD]/50 p-8 h-full overflow-y-auto"
            style={{
              fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div
              className="article-content prose prose-sm sm:prose-base lg:prose-lg max-w-none
                         text-[#323130] leading-relaxed font-light
                         [&>h1]:text-2xl [&>h1]:sm:text-3xl [&>h1]:font-light [&>h1]:text-[#323130] [&>h1]:mb-4 [&>h1]:leading-tight
                         [&>h2]:text-xl [&>h2]:sm:text-2xl [&>h2]:font-light [&>h2]:text-[#323130] [&>h2]:mt-6 [&>h2]:mb-3 [&>h2]:leading-tight
                         [&>h3]:text-lg [&>h3]:sm:text-xl [&>h3]:font-light [&>h3]:text-[#323130] [&>h3]:mt-4 [&>h3]:mb-2 [&>h3]:leading-tight
                         [&>p]:mb-4 [&>p]:leading-relaxed
                         [&>ul]:my-4 [&>ul]:space-y-2
                         [&>li]:leading-relaxed
                         [&>strong]:font-medium [&>strong]:text-[#323130]
                         [&>a]:text-[#FF5F00] [&>a]:underline [&>a]:decoration-1 [&>a]:underline-offset-2
                         [&>a:hover]:text-[#EB001B] [&>a:hover]:decoration-2
                         [&>blockquote]:border-l-2 [&>blockquote]:border-[#E1DFDD] [&>blockquote]:pl-4 [&>blockquote]:my-4
                         [&>blockquote]:italic [&>blockquote]:text-[#605E5C]
                         [&>code]:bg-[#F3F2F1] [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-xs [&>code]:font-mono [&>code]:text-[#323130]
                         [&>pre]:bg-[#323130] [&>pre]:text-white [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:my-4 [&>pre]:overflow-x-auto [&>pre]:text-xs [&>pre]:leading-relaxed"
              style={{ fontWeight: 300 }}
              dangerouslySetInnerHTML={{ __html: segments[currentSegment] }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
