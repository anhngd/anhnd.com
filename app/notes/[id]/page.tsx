import Link from 'next/link'
import { Metadata } from 'next'

// Define note type
type Note = {
  id: string
  title: string
  date: string
  excerpt: string
  category: string
  content: string
}

// Generate empty notes array for future real content
function generateMockNotes(): Note[] {
  return [];
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // For now with mock data, we'll return a generic metadata object
  // In the future when real data is implemented, dynamically generate metadata from the note
  return {
    title: 'Note | Anh Nguyen',
    description: 'Detailed note page with insights and information.',
    openGraph: {
      title: 'Note | Anh Nguyen',
      description: 'Detailed note page with insights and information.',
      url: `https://anhnd.com/notes/${params.id}`,
      siteName: 'Anh Nguyen',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Note | Anh Nguyen',
      description: 'Detailed note page with insights and information.',
    },
    alternates: {
      canonical: `https://anhnd.com/notes/${params.id}`,
    }
  }
}

// Generate the mock notes data
const notesData = generateMockNotes()

// This function is required for static site generation with dynamic routes
export function generateStaticParams() {
  // Return empty array since we have no notes
  // When real data is added, this should be updated to include all note IDs
  return []
}

function NotFoundUI() {
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
          No notes are available yet. Check back soon!
        </p>
        <Link href="/notes" className="inline-flex items-center px-4 py-1.5 rounded-md border border-[#FF5F00] text-[#FF5F00] text-sm font-light tracking-wide hover:bg-[#FF5F00]/5 transition-colors">
          Return to Notes
        </Link>
      </div>
    </main>
  )
}

export default function NotePage({ params }: { params: { id: string } }) {
  const id = params.id
  const note = notesData.find(note => note.id === id)
  
  // Since we have no notes, we'll always show the NotFoundUI
  if (!note) {
    return <NotFoundUI />
  }

  // This part would render a note if found
  // We keep it for when real data is added
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
