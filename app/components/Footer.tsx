import Link from 'next/link'
import { SHOW_BLOG, SITE } from '@/lib/site'

const links = [
  { href: '/about', label: 'About' },
  { href: '/tools', label: 'Tools' },
  ...(SHOW_BLOG ? [{ href: '/notes', label: 'Notes' }] : []),
]

export default function Footer({ wide = false }: { wide?: boolean }) {
  return (
    <footer
      role="contentinfo"
      className="mt-auto py-10 px-4 sm:px-6 border-t border-line bg-page"
    >
      <div className={`${wide ? 'max-w-4xl' : 'max-w-3xl'} mx-auto flex flex-col sm:flex-row items-center justify-between gap-4`}>
        <p className="text-sm text-ink-4" style={{ fontWeight: 400 }}>
          © {new Date().getFullYear()} anhnd.com
        </p>

        <nav aria-label="Footer" className="flex items-center gap-5 text-sm text-ink-3">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-brand-ink transition-colors">
              {link.label}
            </Link>
          ))}
          <a href={`mailto:${SITE.email}`} className="hover:text-brand-ink transition-colors">
            Email
          </a>
          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-ink transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  )
}
