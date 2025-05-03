import type { Metadata } from 'next'
import { Lexend, Cormorant_Garamond, Playfair_Display } from 'next/font/google'
import './globals.css'
import GoogleAnalytics from './components/GoogleAnalytics'

const lexend = Lexend({ subsets: ['latin'] })
const cormorant = Cormorant_Garamond({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant'
})
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair'
})

export const metadata: Metadata = {
  title: `I'm AnhND`,
  description: 'Personal website of AnhND, a Full-stack Developer with expertise in digital transformation, gaming industry, and management. Based in Vietnam.',
  keywords: 'AnhND, Full-stack Developer, UI/UX, Digital Transformation, Gaming Industry, Vietnam, Applied Mathematics, Computer Science',
  authors: [{ name: 'AnhND' }],
  creator: 'AnhND',
  publisher: 'AnhND',
  openGraph: {
    title: `I'm AnhND`,
    description: 'Personal website of AnhND, a Full-stack Developer with expertise in digital transformation, gaming industry, and management.',
    url: 'https://anhnd.com',
    siteName: 'AnhND',
    images: [
      {
        url: 'https://anhnd.com/avatar.png',
        width: 800,
        height: 800,
        alt: 'AnhND',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `I'm AnhND`,
    description: 'Personal website of AnhND, a Full-stack Developer with expertise in digital transformation, gaming industry, and management.',
    images: ['https://anhnd.com/avatar.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${lexend.className} ${cormorant.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://anhnd.com" />
      </head>
      <body>
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  )
} 