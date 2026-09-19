'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import { SHOW_BLOG } from '@/lib/site'

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/tools', label: 'Tools' },
  ...(SHOW_BLOG ? [{ href: '/notes', label: 'Notes' }] : []),
]

export default function Nav({ wide = false }: { wide?: boolean }) {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-30 bg-page/80 backdrop-blur-md border-b border-line">
      <div className="px-4 sm:px-6">
      <div className={`${wide ? 'max-w-4xl' : 'max-w-3xl'} mx-auto h-14 flex items-center justify-between`}>
        <Link
          href="/"
          className="text-[15px] text-ink tracking-tight"
          style={{ fontWeight: 600 }}
        >
          Anh<span className="text-brand-ink">ND</span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map((link) => {
            const isActive =
              link.href === '/' ? pathname === '/' : pathname?.startsWith(link.href)

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  isActive
                    ? 'text-ink bg-sunken'
                    : 'text-ink-2 hover:text-ink'
                }`}
                style={{ fontWeight: isActive ? 500 : 400 }}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            )
          })}
          <span className="w-px h-4 bg-line-strong mx-1.5" aria-hidden="true" />
          <ThemeToggle />
        </div>
      </div>
      </div>
    </nav>
  )
}
