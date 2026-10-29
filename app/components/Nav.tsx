'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SHOW_BLOG } from '@/lib/site'

// Tools are deliberately not here: the site leads with the person, and the only
// link to the tools lives in the footer.
const links = SHOW_BLOG ? [{ href: '/notes', label: 'Notes' }] : []

/** A quiet top bar for the inner pages: the name, and Notes when the blog is on. */
export default function Nav({ wide = false }: { wide?: boolean }) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-30 border-b border-line glass-bar px-5 sm:px-6">
      <nav
        aria-label="Main"
        className={`${wide ? 'max-w-5xl' : 'max-w-4xl'} mx-auto h-14 flex items-center justify-between`}
      >
        <Link href="/" className="text-[15px] text-ink tracking-tight hover:text-brand-ink transition-colors" style={{ fontWeight: 600 }}>
          Anh<span className="text-brand-ink">ND</span>
        </Link>

        <div className="flex items-center gap-0.5">
          {links.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname?.startsWith(link.href)

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  isActive ? 'text-ink' : 'text-ink-3 hover:text-ink'
                }`}
                style={{ fontWeight: isActive ? 500 : 400 }}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
