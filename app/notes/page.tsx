import Link from 'next/link'
import { redirect } from 'next/navigation'
import Nav from '../components/Nav'
import { getSortedNotesData } from '@/lib/markdown'
import { SHOW_BLOG } from '@/lib/site'

export default function NotesPage() {
  if (!SHOW_BLOG) redirect('/')

  const notes = getSortedNotesData()

  return (
    <main className="min-h-screen bg-page">
      <Nav />
      <div className="max-w-3xl mx-auto py-12 sm:py-16 px-4 sm:px-6">
        <header className="mb-10 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl text-ink mb-2" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
              Notes
            </h1>
            <p className="text-sm text-ink-3" style={{ fontWeight: 400 }}>
              Thoughts on engineering, management, and building things.
            </p>
          </div>
          <a
            href="/feed.xml"
            className="inline-flex items-center gap-1.5 text-xs text-ink-3 hover:text-brand-ink transition-colors shrink-0 mt-1"
            style={{ fontWeight: 400 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5v3.75a11.25 11.25 0 0111.25 11.25H19.5a15.75 15.75 0 00-15-15zM4.5 12v3.75a3.75 3.75 0 013.75 3.75h3.75c0-4.142-3.358-7.5-7.5-7.5z" />
              <circle cx="6" cy="18" r="1.5" fill="currentColor" stroke="none" />
            </svg>
            RSS
          </a>
        </header>

        {notes.length === 0 ? (
          <p className="text-sm text-ink-3 py-12 text-center" style={{ fontWeight: 400 }}>
            No notes yet. Stay tuned.
          </p>
        ) : (
          <div className="space-y-0">
            {notes.map((note) => (
              <article key={note.id} className="group border-b border-line last:border-b-0">
                <Link
                  href={`/notes/${note.id}`}
                  className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-5 hover:bg-card -mx-3 px-3 rounded-lg transition-colors"
                >
                  <time
                    dateTime={note.date}
                    className="text-xs text-ink-4 shrink-0 sm:w-28 tabular-nums"
                    style={{ fontWeight: 400 }}
                  >
                    {new Date(note.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </time>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base sm:text-lg text-ink group-hover:text-brand-ink transition-colors leading-snug mb-1"
                        style={{ fontWeight: 600 }}>
                      {note.title}
                    </h2>
                    {note.excerpt && (
                      <p className="text-sm text-ink-3 leading-relaxed line-clamp-2" style={{ fontWeight: 400 }}>
                        {note.excerpt}
                      </p>
                    )}
                    <span className="inline-block mt-1.5 text-[10px] text-brand-ink uppercase tracking-wider font-medium">
                      {note.category}
                    </span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                       className="w-4 h-4 text-ink-4 group-hover:text-brand-ink transition-colors shrink-0 hidden sm:block self-center" aria-hidden="true">
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
