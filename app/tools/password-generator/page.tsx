import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import StructuredData from '../../components/StructuredData'
import PasswordGenerator from './PasswordGenerator'
import { SITE } from '@/lib/site'

const title = 'Password Generator by Platform'
const description =
  'Pick a platform — Google, Apple, GitHub, Wi-Fi and more — and get a random password that follows its rules, graded from Weak to Very strong. Generated in your browser.'
const url = `${SITE.url}/tools/password-generator`

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title: `${title} — Anh Nguyen`, description, url, siteName: SITE.name, type: 'website' },
  twitter: { card: 'summary_large_image', title: `${title} — Anh Nguyen`, description },
}

export default function PasswordGeneratorPage() {
  return (
    <main
      className="min-h-screen flex flex-col bg-[#FAFAF9]"
      style={{ fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif' }}
    >
      <StructuredData
        type="WebApplication"
        data={{
          name: title,
          description,
          url,
          applicationCategory: 'SecurityApplication',
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          author: { '@id': `${SITE.url}/#person` },
        }}
      />

      <Nav />

      <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-20">
        <header className="mb-12">
          <nav aria-label="Breadcrumb" className="text-sm text-[#8A8886] mb-5" style={{ fontWeight: 300 }}>
            <Link href="/tools" className="hover:text-[#FF5F00] transition-colors">Tools</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-[#605E5C]" aria-current="page">Password generator</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl text-[#1A1A1A] mb-4" style={{ fontWeight: 300, letterSpacing: '-0.03em' }}>
            Password generator, <span className="text-[#FF5F00]">by platform</span>
          </h1>
          <p className="text-base sm:text-lg text-[#605E5C] leading-relaxed max-w-xl" style={{ fontWeight: 300 }}>
            Most generators follow one generic rule. Choose where the password will live and get one that fits that
            platform, graded from Weak to Very strong.
          </p>
        </header>

        <PasswordGenerator />
      </div>

      <Footer />
    </main>
  )
}
