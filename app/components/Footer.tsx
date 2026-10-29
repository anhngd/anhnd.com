import Link from 'next/link'
import { SHOW_BLOG, SITE } from '@/lib/site'

export default function Footer({ wide = false }: { wide?: boolean }) {
  return (
    <footer role="contentinfo" className="mt-auto border-t border-line px-5 sm:px-6">
      <div
        className={`${wide ? 'max-w-5xl' : 'max-w-4xl'} mx-auto py-7 flex flex-col sm:flex-row items-center justify-between gap-3`}
      >
        <p className="text-sm text-ink-3" style={{ fontWeight: 400 }}>
          © {new Date().getFullYear()} {SITE.name}
        </p>

        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-ink-3">
          {SHOW_BLOG && <Link href="/notes" className="hover:text-ink transition-colors">Notes</Link>}
          <a href={SITE.my} target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">My</a>
          <Link href="/tools" className="hover:text-ink transition-colors">Tools</Link>
          <a href={`mailto:${SITE.email}`} className="hover:text-ink transition-colors">Email</a>
          <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  )
}
