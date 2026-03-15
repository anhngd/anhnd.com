import Link from 'next/link'
import { getSortedNotesData } from '@/lib/markdown'

export const metadata = {
  title: 'Notes | AnhND',
  description: 'Thoughts, learnings, and explorations by AnhND.',
}

export default function NotesPage() {
  const notes = getSortedNotesData()

  return (
    <main className="min-h-screen py-16 px-4 sm:px-6 lg:px-8"
          style={{ fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif' }}>
      <div className="max-w-2xl mx-auto">
        <header className="mb-12">
          <Link href="/" className="inline-flex items-center mb-8 text-[#605E5C] hover:text-[#323130] transition-colors group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className="text-sm font-light">Home</span>
          </Link>
          <h1 className="text-3xl font-light text-[#201F1E]" style={{ fontWeight: 300 }}>Notes</h1>
          <p className="mt-2 text-sm text-[#605E5C] font-light">
            Thoughts, learnings, and explorations.
          </p>
        </header>

        {notes.length === 0 ? (
          <p className="text-[#605E5C] font-light text-sm">No notes published yet. Check back soon.</p>
        ) : (
          <div className="space-y-0">
            {notes.map((note) => (
              <article key={note.id} className="border-b border-[#E1DFDD] py-5">
                <Link href={`/notes/${note.id}`} className="group block">
                  <div className="flex items-baseline justify-between gap-4 mb-1">
                    <h2 className="text-base font-light text-[#201F1E] group-hover:text-[#FF5F00] transition-colors leading-snug"
                        style={{ fontWeight: 400 }}>
                      {note.title}
                    </h2>
                    <time className="text-xs text-[#8A8886] shrink-0 font-light">
                      {new Date(note.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </time>
                  </div>
                  {note.excerpt && (
                    <p className="text-sm text-[#605E5C] font-light leading-relaxed line-clamp-2">
                      {note.excerpt}
                    </p>
                  )}
                  {note.category && (
                    <span className="inline-block mt-2 text-xs text-[#8A8886] font-light">
                      {note.category}
                    </span>
                  )}
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
