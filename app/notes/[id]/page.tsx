import Link from 'next/link'

// Sample notes data - in a real app, this would come from a database or API
const notesData = [
  {
    id: '1',
    title: 'The Art of Simplicity',
    date: 'July 10, 2025',
    category: 'Design',
    content: `
      <p>In the realm of design, simplicity isn't just an aesthetic choice—it's a fundamental principle that can transform user experiences.</p>
      
      <p>Minimalist design strips away the unnecessary, focusing attention on what truly matters. This approach isn't about creating something plain or boring, but rather about achieving clarity and purpose in every element.</p>
      
      <h2>Key Principles of Minimalist Design</h2>
      
      <p>The power of minimalism comes from its focus on:</p>
      
      <ul>
        <li><strong>Intentional use of space</strong> - Allowing elements to breathe creates visual hierarchy and guides the user's eye.</li>
        <li><strong>Limited color palette</strong> - A restrained approach to color creates harmony and emphasizes important elements.</li>
        <li><strong>Typography as a central element</strong> - When distractions are removed, typography becomes a powerful design tool.</li>
        <li><strong>Functional aesthetics</strong> - Every element serves a purpose; nothing is included merely for decoration.</li>
      </ul>
      
      <p>When we embrace simplicity, we create interfaces that communicate clearly and function effortlessly. The user isn't distracted by unnecessary elements or confused by complex interactions.</p>
      
      <p>Remember: in design, what you remove is often more important than what you add.</p>
    `
  },
  {
    id: '2',
    title: 'Building with Next.js',
    date: 'July 8, 2025',
    category: 'Development',
    content: `
      <p>Next.js has revolutionized how we build React applications by providing a framework that addresses common challenges in web development.</p>
      
      <p>From server-side rendering to static site generation, Next.js offers flexible rendering options that optimize both performance and developer experience.</p>
      
      <h2>Why Next.js?</h2>
      
      <p>Next.js excels in several key areas:</p>
      
      <ul>
        <li><strong>Rendering flexibility</strong> - Choose between static generation, server-side rendering, or client-side rendering on a per-page basis.</li>
        <li><strong>Built-in routing</strong> - The file-system based router simplifies navigation and page creation.</li>
        <li><strong>Automatic code splitting</strong> - Only load the JavaScript needed for each page, improving initial load times.</li>
        <li><strong>API routes</strong> - Create backend functionality within the same project, simplifying full-stack development.</li>
      </ul>
      
      <p>The framework continues to evolve with features like the App Router, which brings component-level data fetching and more granular control over rendering.</p>
      
      <p>Whether you're building a blog, e-commerce site, or complex web application, Next.js provides a solid foundation that scales with your needs.</p>
    `
  },
  {
    id: '3',
    title: 'Typography in Digital Design',
    date: 'July 5, 2025',
    category: 'Design',
    content: `
      <p>Typography is often the unsung hero of digital design—it silently carries your message while shaping the entire mood of your interface.</p>
      
      <p>The right typeface choices can establish hierarchy, improve readability, and create emotional connections with users.</p>
      
      <h2>Type Fundamentals for Digital</h2>
      
      <p>When working with typography in digital spaces, consider:</p>
      
      <ul>
        <li><strong>Readability at various sizes</strong> - Text should be legible on both large monitors and small mobile screens.</li>
        <li><strong>Font loading and performance</strong> - Custom fonts impact page load times; use system fonts or optimize loading strategies.</li>
        <li><strong>Hierarchy and scanning patterns</strong> - Users scan content rather than read word-by-word; typography should guide this natural behavior.</li>
        <li><strong>Responsive considerations</strong> - Font sizes, line heights, and spacing need to adapt across different viewport sizes.</li>
      </ul>
      
      <p>The interplay between typeface, spacing, color, and size creates a typographic system that guides users through content while reflecting your brand's personality.</p>
      
      <p>Remember that great typography often goes unnoticed by the average user—it simply makes the experience feel right.</p>
    `
  },
  {
    id: '4',
    title: 'Color Theory for Digital Interfaces',
    date: 'June 28, 2025',
    category: 'Design',
    content: `
      <p>Color is one of the most powerful tools in a designer's toolkit, capable of influencing mood, directing attention, and communicating meaning without words.</p>
      
      <p>Understanding the psychology and principles behind color selection can dramatically improve your digital interfaces.</p>
      
      <h2>Color in Interface Design</h2>
      
      <p>When developing color systems for digital products:</p>
      
      <ul>
        <li><strong>Accessibility is non-negotiable</strong> - Ensure sufficient contrast ratios for text and interactive elements to meet WCAG standards.</li>
        <li><strong>Consistency builds trust</strong> - Establish clear meaning for colors (e.g., blue for links, red for errors) and apply them consistently.</li>
        <li><strong>Cultural context matters</strong> - Colors carry different meanings across cultures; research your audience before finalizing choices.</li>
        <li><strong>Dark mode considerations</strong> - Color palettes need to work in both light and dark environments without losing meaning or accessibility.</li>
      </ul>
      
      <p>A well-designed color system extends beyond primary brand colors to include functional colors for states like hover, active, disabled, and error conditions.</p>
      
      <p>The most successful color implementations are those that users hardly notice—they simply enhance the experience without calling attention to themselves.</p>
    `
  }
]

// This function is required for static site generation with dynamic routes
export function generateStaticParams() {
  return notesData.map(note => ({
    id: note.id
  }))
}

export default function NotePage({ params }: { params: { id: string } }) {
  const id = params.id
  const note = notesData.find(note => note.id === id)
  
  // Loading state no longer needed for static generation
  
  if (!note) {
    return (
      <main className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-bg dark:from-bg-dark to-bg/95 dark:to-bg-dark/95">
        <div className="max-w-4xl mx-auto text-center">
          <Link href="/notes" className="flex items-center justify-center mb-8 text-text/60 dark:text-text-dark/60 hover:text-[#FF5F00] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-4 h-4 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className="font-cormorant text-lg tracking-wide font-light">Back to Notes</span>
          </Link>
          
          <h1 className="font-playfair text-3xl font-medium text-text dark:text-text-dark mb-4 tracking-wide">
            Note Not Found
          </h1>
          <p className="font-cormorant text-xl text-text/70 dark:text-text-dark/70 mb-8 tracking-wide font-light">
            The note you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/notes" className="inline-flex items-center px-4 py-1.5 rounded-md border border-[#FF5F00] text-[#FF5F00] text-sm font-light tracking-wide hover:bg-[#FF5F00]/5 transition-colors">
            Return to Notes
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-bg dark:from-bg-dark to-bg/95 dark:to-bg-dark/95">
      <article className="max-w-4xl mx-auto">
        <Link href="/notes" className="flex items-center mb-8 text-text/60 dark:text-text-dark/60 hover:text-[#FF5F00] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-4 h-4 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span className="font-cormorant text-lg tracking-wide font-light">Back to Notes</span>
        </Link>
        
        <div>
          <header className="mb-10 border-b border-text/10 dark:border-text-dark/10 pb-6">
            <h1 className="font-playfair text-4xl md:text-5xl font-medium text-text dark:text-text-dark mb-3 tracking-wide">
              {note.title}
            </h1>
            <div className="flex justify-between items-center flex-wrap gap-y-4">
              <time className="font-cormorant text-sm text-text/40 dark:text-text-dark/40 tracking-wide font-light">
                {note.date}
              </time>
              
              <div className="text-xs text-text/40 dark:text-text-dark/40 px-2 py-1 tracking-wide font-light">
                {note.category}
              </div>
            </div>
          </header>
          
          <div 
            className="prose dark:prose-invert max-w-none font-cormorant 
                       prose-headings:font-playfair prose-p:text-base prose-p:tracking-wide prose-p:leading-relaxed 
                       prose-headings:text-text dark:prose-headings:text-text-dark prose-headings:tracking-wide prose-headings:font-medium
                       prose-p:font-light prose-li:font-light prose-li:text-base prose-li:tracking-wide prose-li:leading-relaxed
                       prose-a:text-[#FF5F00] prose-a:no-underline hover:prose-a:underline 
                       prose-strong:text-text dark:prose-strong:text-text-dark prose-strong:font-medium
                       prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
                       prose-ul:my-4 prose-li:my-1"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
        </div>
      </article>
    </main>
  )
}
