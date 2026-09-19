'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SHOW_BLOG } from '@/lib/site'

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/tools', label: 'Tools' },
  ...(SHOW_BLOG ? [{ href: '/notes', label: 'Notes' }] : []),
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-30 bg-[#FAFAF9]/80 backdrop-blur-md border-b border-[#F0EEEC]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm text-[#1A1A1A] tracking-tight"
          style={{ fontWeight: 500 }}
        >
          Anh<span style={{ color: '#FF5F00' }}>ND</span>
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
                    ? 'text-[#1A1A1A] bg-[#F3F2F1]'
                    : 'text-[#605E5C] hover:text-[#1A1A1A]'
                }`}
                style={{ fontWeight: isActive ? 500 : 400 }}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
