import Link from 'next/link'

// Generate mock notes data (same as used in the notes listing page)
function generateMockNotes() {
  const categories = ['Design', 'Development', 'Productivity', 'Career', 'Life', 'Technology']
  const notes = []
  
  for (let i = 1; i <= 100; i++) {
    const titleIndex = i % 10
    const titles = [
      'The Art of Simplicity',
      'Building with Next.js',
      'The Future of Web Development',
      'Color Theory for Digital Interfaces',
      'Typography in Modern Design',
      'Optimizing Performance in React Apps',
      'Designing for Accessibility',
      'The Role of Animation in UX',
      'From Concept to Deployment',
      'Creating Effective Design Systems'
    ]
    
    const categoryIndex = i % categories.length
    const date = new Date(2025, 6, Math.max(1, 30 - i % 30))
    
    // Generate an excerpt from the content based on title
    let excerpt = ''
    switch (titleIndex) {
      case 0:
        excerpt = 'Exploring how simplicity in design creates more effective and enjoyable user experiences.'
        break
      case 1:
        excerpt = 'A deep dive into the benefits and features of the Next.js framework for React applications.'
        break
      case 2:
        excerpt = 'Examining trends and technologies shaping the future of web development and user experiences.'
        break
      case 3:
        excerpt = 'Understanding how color influences user perception and how to create effective color schemes.'
        break
      case 4:
        excerpt = 'The impact of typography choices on readability, brand perception, and user engagement.'
        break
      case 5:
        excerpt = 'Strategies and techniques for building high-performance React applications that users love.'
        break
      case 6:
        excerpt = 'Creating inclusive designs that work for everyone, regardless of ability or circumstance.'
        break
      case 7:
        excerpt = 'How thoughtful animation can enhance user experience and guide interaction.'
        break
      case 8:
        excerpt = 'The journey of taking a project from initial idea through to final deployment.'
        break
      case 9:
        excerpt = 'Building and maintaining design systems that scale across products and teams.'
        break
      default:
        excerpt = 'Exploring ideas and concepts in design and development.'
    }
    
    // Create the full content based on the title
    let content = ''
    if (titleIndex === 0) {
      content = `
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
    } else if (titleIndex === 1) {
      content = `
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
      
      <p>Whether you're building a blog, e-commerce site, or complex web application, Next.js provides the tools needed to create performant, scalable solutions.</p>
      
      <h2>Getting Started</h2>
      
      <p>Setting up a new Next.js project is straightforward:</p>
      
      <pre><code>npx create-next-app@latest my-project
cd my-project
npm run dev</code></pre>
      
      <p>This creates a new project with a sensible default configuration, allowing you to focus on building your application rather than setting up infrastructure.</p>
    `
    } else {
      content = `
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget ultricies aliquam, quam libero ultricies nisl, eget ultricies nisl nunc eget nisl.</p>
      
      <h2>Key Points</h2>
      
      <p>Here are some important considerations:</p>
      
      <ul>
        <li><strong>Point One</strong> - Description of the first main point with relevant details.</li>
        <li><strong>Point Two</strong> - Explanation of the second concept and its implications.</li>
        <li><strong>Point Three</strong> - Discussion of the third element and why it matters.</li>
      </ul>
      
      <p>When we consider these factors together, we can develop more effective approaches and solutions.</p>
      
      <h2>Looking Ahead</h2>
      
      <p>The future in this area looks promising, with several emerging trends:</p>
      
      <ol>
        <li>Trend one and its potential impact</li>
        <li>Second major development to watch</li>
        <li>Third significant shift in the landscape</li>
      </ol>
      
      <p>By staying informed and adaptable, we can leverage these changes for better outcomes.</p>
      
      <p>Remember that continuous learning and experimentation are key to mastery in this domain.</p>
    `
    }
    
    notes.push({
      id: String(i),
      title: titles[titleIndex],
      date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      category: categories[categoryIndex],
      excerpt,
      content
    })
  }
  
  return notes
}

// Generate the mock notes data
const notesData = generateMockNotes()

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
