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
      className="mt-auto py-10 px-4 sm:px-6 border-t border-[#F0EEEC] bg-[#FAFAF9]"
    >
      <div className={`${wide ? 'max-w-4xl' : 'max-w-3xl'} mx-auto flex flex-col sm:flex-row items-center justify-between gap-4`}>
        <p className="text-sm text-[#B4B2AF]" style={{ fontWeight: 300 }}>
          © {new Date().getFullYear()} anhnd.com
        </p>

        <nav aria-label="Footer" className="flex items-center gap-5 text-sm text-[#8A8886]">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-[#FF5F00] transition-colors">
              {link.label}
            </Link>
          ))}
          <a href={`mailto:${SITE.email}`} className="hover:text-[#FF5F00] transition-colors">
            Email
          </a>
          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#FF5F00] transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  )
}
