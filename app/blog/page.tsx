'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
// Theme is already provided in the root layout
import ThemeSwitch from '../components/ThemeSwitch'
import { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

interface BlogPost {
  id: string
  title: string
  date: string
  excerpt: string
  content: string
  tags: string[]
  coverImage?: string
}

// Sample blog posts data with Markdown, images, and math formulas
const samplePosts: BlogPost[] = [
  {
    id: '1',
    title: 'My thoughts on modern web development',
    date: 'May 27, 2025',
    excerpt: 'Exploring the current landscape of web development tools and frameworks...',
    content: `
# Modern Web Development

Web development has evolved significantly over the past few years. Let's explore some of the key trends and technologies.

## Frontend Frameworks

React, Vue, and Angular continue to dominate the frontend landscape. Each has its own strengths:

- **React**: Great ecosystem, flexible, used by many large companies
- **Vue**: Easy to learn, great documentation
- **Angular**: Full-featured, good for large enterprise applications

Here's a simple React component:

\`\`\`jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
\`\`\`

## Backend Technologies

Node.js remains popular, but Deno and Bun are gaining traction as alternatives.

![Web Development Stack](/images/web-stack.jpg)

## Performance Considerations

When optimizing web applications, remember that:

1. Network requests are expensive
2. JavaScript parsing takes time
3. Rendering can block the main thread

## Conclusion

The web development landscape continues to evolve rapidly. Staying updated with the latest tools and best practices is essential for building modern, performant web applications.
    `,
    tags: ['Web Development', 'React', 'NextJS']
  },
  {
    id: '2',
    title: 'Understanding mathematical concepts in computer science',
    date: 'May 20, 2025',
    excerpt: 'Exploring how mathematical concepts apply to computer science and programming...',
    content: `
# Mathematics in Computer Science

Mathematics forms the foundation of computer science. Let's explore some key mathematical concepts and their applications.

## Linear Algebra

Linear algebra is essential for many areas of computer science, including:

- Graphics programming
- Machine learning
- Data analysis

For example, a matrix multiplication can be represented as:

$$
\\begin{pmatrix} 
a & b \\\\
c & d 
\\end{pmatrix}
\\begin{pmatrix} 
e & f \\\\
g & h 
\\end{pmatrix} =
\\begin{pmatrix} 
ae + bg & af + bh \\\\
ce + dg & cf + dh 
\\end{pmatrix}
$$

## Probability and Statistics

Probability theory is crucial for:

- Machine learning algorithms
- Data analysis
- Network reliability

The probability of an event $A$ given $B$ is:

$$P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}$$

## Algorithms and Complexity

Big O notation helps us understand algorithm efficiency:

- $O(1)$ - Constant time
- $O(\\log n)$ - Logarithmic time
- $O(n)$ - Linear time
- $O(n \\log n)$ - Linearithmic time
- $O(n^2)$ - Quadratic time
- $O(2^n)$ - Exponential time

![Algorithm Complexity Chart](/images/algorithm-complexity.jpg)

## Discrete Mathematics

Discrete math concepts like graph theory are fundamental to many algorithms:

\`\`\`python
# A simple graph representation
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}
\`\`\`

Understanding these mathematical foundations helps build more efficient and robust software systems.
    `,
    tags: ['Mathematics', 'Computer Science', 'Algorithms'],
    coverImage: '/images/math-cs.jpg'
  },
  {
    id: '3',
    title: 'The art of UI/UX design',
    date: 'May 15, 2025',
    excerpt: 'Principles and practices for creating beautiful and functional user interfaces...',
    content: `
# The Art of UI/UX Design

Creating effective user interfaces requires both artistic sensibility and scientific understanding of human behavior.

## Design Principles

Good design follows several key principles:

1. **Clarity**: Eliminate ambiguity
2. **Consistency**: Use familiar patterns
3. **Feedback**: Provide clear responses to user actions
4. **Efficiency**: Minimize steps to complete tasks

![UI Design Principles](/images/ui-design.jpg)

## Color Theory

Colors evoke emotions and guide user attention:

- **Red**: Urgency, importance
- **Blue**: Trust, security
- **Green**: Success, growth
- **Yellow**: Warning, optimism

## Typography

Typography plays a crucial role in readability and brand identity:

\`\`\`css
body {
  font-family: 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  font-size: 16px;
}

h1, h2, h3 {
  font-family: 'Georgia', serif;
  font-weight: 700;
}
\`\`\`

## User Research

Understanding your users is fundamental to good design. Methods include:

- Interviews
- Surveys
- Usability testing
- Analytics

By combining these elements effectively, we can create interfaces that are both beautiful and functional.
    `,
    tags: ['UI/UX', 'Design', 'Web Development']
  }
]

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  
  // Filter posts based on search term and active tag
  const filteredPosts = samplePosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesTag = activeTag ? post.tags.includes(activeTag) : true
    
    return matchesSearch && matchesTag
  })
  
  // Get all unique tags from posts
  const allTags = Array.from(new Set(samplePosts.flatMap(post => post.tags)))
  
  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-[var(--bg-color)] to-[var(--bg-color)]/95 text-[var(--text-color)] relative">
        {/* Header with back button and theme switch */}
        <header className="sticky top-0 z-10 backdrop-blur-md bg-[var(--bg-color)]/80 border-b border-[var(--primary-color)]/10 px-6 py-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 text-[var(--primary-color)] hover:text-[var(--primary-color)]/80 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              <span>Back to Home</span>
            </Link>
            <h1 className="text-2xl font-[var(--font-playfair)] hidden sm:block">AnhND's Notes</h1>
            <ThemeSwitch />
          </div>
        </header>
        
        <div className="max-w-6xl mx-auto px-4 py-8">
          {selectedPost ? (
            <BlogPostDetail post={selectedPost} onBack={() => setSelectedPost(null)} />
          ) : (
            <div className="space-y-8">
              {/* Blog intro */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h1 className="text-4xl md:text-5xl font-[var(--font-playfair)] mb-4">Personal Notes</h1>
                <p className="text-[var(--text-color)]/70 max-w-2xl mx-auto">
                  A collection of my thoughts, learnings, and reflections on technology, design, and life.
                </p>
              </motion.div>
              
              {/* Search and filter */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-[var(--bg-color)]/50 border border-[var(--primary-color)]/20 focus:border-[var(--primary-color)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--primary-color)]/30 placeholder-[var(--text-color)]/40"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute right-3 top-2.5 text-[var(--text-color)]/50">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                  <button
                    onClick={() => setActiveTag(null)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${!activeTag ? 'bg-[var(--primary-color)]/20 text-[var(--primary-color)]' : 'bg-[var(--bg-color)]/50 text-[var(--text-color)]/70 hover:bg-[var(--primary-color)]/10'}`}
                  >
                    All
                  </button>
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${activeTag === tag ? 'bg-[var(--primary-color)]/20 text-[var(--primary-color)]' : 'bg-[var(--bg-color)]/50 text-[var(--text-color)]/70 hover:bg-[var(--primary-color)]/10'}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Blog posts list */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      onClick={() => setSelectedPost(post)}
                      className="group cursor-pointer bg-[var(--bg-color)]/30 backdrop-blur-sm border border-[var(--primary-color)]/10 hover:border-[var(--primary-color)]/30 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[var(--primary-color)]/5 hover:-translate-y-1"
                    >
                      {post.coverImage && (
                        <div className="relative w-full h-40 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)] to-transparent opacity-40 z-10" />
                          <Image 
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-sm text-[var(--text-color)]/60">{post.date}</span>
                          <div className="h-8 w-8 rounded-full bg-[var(--primary-color)]/10 flex items-center justify-center text-[var(--primary-color)] opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                          </div>
                        </div>
                        <h2 className="text-xl font-[var(--font-playfair)] mb-2 group-hover:text-[var(--primary-color)] transition-colors">{post.title}</h2>
                        <p className="text-[var(--text-color)]/70 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map(tag => (
                            <span 
                              key={tag} 
                              className="text-xs px-2 py-1 rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)]"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTag(tag === activeTag ? null : tag);
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-[var(--text-color)]/60">No notes found matching your search criteria.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-[var(--primary-color)]/5 to-[var(--secondary-color)]/5 blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-[var(--primary-color)]/5 to-[var(--secondary-color)]/5 blur-3xl"></div>
        </div>
      </main>
    </>
  )
}

// Blog post detail component with Markdown support
function BlogPostDetail({ post, onBack }: { post: BlogPost, onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto"
    >
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-[var(--primary-color)] hover:text-[var(--primary-color)]/80 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        <span>Back to all notes</span>
      </button>
      
      <article className="bg-[var(--bg-color)]/30 backdrop-blur-sm border border-[var(--primary-color)]/10 rounded-xl overflow-hidden">
        {post.coverImage && (
          <div className="relative w-full h-64 md:h-80">
            <Image 
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)] to-transparent opacity-60" />
          </div>
        )}
        
        <div className="p-6 md:p-8">
          <div className="mb-8">
            <span className="text-sm text-[var(--text-color)]/60 block mb-2">{post.date}</span>
            <h1 className="text-3xl md:text-4xl font-[var(--font-playfair)] mb-4">{post.title}</h1>
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-1 rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="markdown-content prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkMath, remarkGfm]}
              rehypePlugins={[rehypeKatex, rehypeRaw]}
              components={{
                img: ({ node, ...props }) => (
                  <div className="my-8 relative">
                    <img {...props} className="rounded-lg w-full" />
                  </div>
                ),
                // @ts-ignore - ReactMarkdown's typings are incomplete
                code: ({ node, inline, className, children, ...props }) => {
                  if (inline) {
                    return <code className="px-1 py-0.5 rounded bg-[var(--primary-color)]/10 text-[var(--primary-color)]" {...props}>{children}</code>
                  }
                  return (
                    <div className="my-6 overflow-hidden rounded-lg">
                      <pre className="p-4 bg-[var(--bg-color)]/50 border border-[var(--primary-color)]/10 overflow-x-auto">
                        <code className="text-[var(--text-color)]" {...props}>{children}</code>
                      </pre>
                    </div>
                  )
                },
                h1: ({ node, ...props }) => <h1 className="text-3xl font-[var(--font-playfair)] mt-8 mb-4" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-2xl font-[var(--font-playfair)] mt-6 mb-3" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-xl font-[var(--font-playfair)] mt-5 mb-2" {...props} />,
                p: ({ node, ...props }) => <p className="text-[var(--text-color)]/90 leading-relaxed my-4" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-4 space-y-2" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-4 space-y-2" {...props} />,
                li: ({ node, ...props }) => <li className="text-[var(--text-color)]/90" {...props} />,
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-[var(--primary-color)]/30 pl-4 italic my-6 text-[var(--text-color)]/80" {...props} />
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>
      </article>
    </motion.div>
  )
}
