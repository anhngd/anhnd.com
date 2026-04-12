import Link from 'next/link'
import { getSortedNotesData } from '@/lib/markdown'

export default function NotesPage() {
  const notes = getSortedNotesData()

  return (
    <main className="min-h-screen bg-[#FAFAF9] py-12 sm:py-16 px-4 sm:px-6"
          style={{ fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif' }}>
      <div className="max-w-3xl mx-auto">
        <header className="mb-10">
          <Link href="/" className="inline-flex items-center mb-6 text-sm text-[#8A8886] hover:text-[#1A1A1A] transition-colors gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Home
          </Link>
          <h1 className="text-2xl sm:text-3xl text-[#1A1A1A] mb-2" style={{ fontWeight: 400, letterSpacing: '-0.02em' }}>
            Notes
          </h1>
          <p className="text-sm text-[#8A8886]" style={{ fontWeight: 300 }}>
            Thoughts on engineering, management, and building things.
          </p>
        </header>

        {notes.length === 0 ? (
          <p className="text-sm text-[#8A8886] py-12 text-center" style={{ fontWeight: 300 }}>
            No notes yet. Stay tuned.
          </p>
        ) : (
          <div className="space-y-0">
            {notes.map((note) => (
              <article key={note.id} className="group border-b border-[#F0EEEC] last:border-b-0">
                <Link
                  href={`/notes/${note.id}`}
                  className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-5 hover:bg-white -mx-3 px-3 rounded-lg transition-colors"
                >
                  <time
                    dateTime={note.date}
                    className="text-xs text-[#B4B2AF] shrink-0 sm:w-28 tabular-nums"
                    style={{ fontWeight: 300 }}
                  >
                    {new Date(note.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </time>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base sm:text-lg text-[#1A1A1A] group-hover:text-[#FF5F00] transition-colors leading-snug mb-1"
                        style={{ fontWeight: 400 }}>
                      {note.title}
                    </h2>
                    {note.excerpt && (
                      <p className="text-sm text-[#8A8886] leading-relaxed line-clamp-2" style={{ fontWeight: 300 }}>
                        {note.excerpt}
                      </p>
                    )}
                    <span className="inline-block mt-1.5 text-[10px] text-[#FF5F00] uppercase tracking-wider font-medium">
                      {note.category}
                    </span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                       className="w-4 h-4 text-[#D1D0CE] group-hover:text-[#FF5F00] transition-colors shrink-0 hidden sm:block self-center" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
