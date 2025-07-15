import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import GoogleAnalytics from './components/GoogleAnalytics'
import 'katex/dist/katex.min.css'
import ThemeProvider from './components/ThemeProvider'
import Script from 'next/script'

const jakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap' // Improve performance with font display swap
})

export const metadata: Metadata = {
  metadataBase: new URL('https://anhnd.com'),
  title: {
    template: '%s | AnhND',
    default: `I'm AnhND - Full-stack Developer`,
  },
  description: 'Personal website of AnhND, a Full-stack Developer with expertise in UI/UX, digital transformation, and gaming industry. Based in Vietnam.',
  keywords: 'AnhND, Full-stack Developer, UI/UX, Digital Transformation, Gaming Industry, Vietnam, Applied Mathematics, Computer Science, Software Engineer',
  authors: [{ name: 'AnhND', url: 'https://anhnd.com' }],
  creator: 'AnhND',
  publisher: 'AnhND',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `I'm AnhND - Full-stack Developer`,
    description: 'Personal website of AnhND, a Full-stack Developer with expertise in UI/UX, digital transformation, and gaming industry. Based in Vietnam.',
    url: 'https://anhnd.com',
    siteName: 'AnhND',
    images: [
      {
        url: 'https://anhnd.com/og-image.png', // Optimized social sharing image
        width: 1200,
        height: 630,
        alt: 'AnhND - Full-stack Developer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `I'm AnhND`,
    description: 'Technology-driven, data-centered, and AI-powered – that’s how I build value."',
    creator: '@anhnd',
    images: ['https://anhnd.com/avatar.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1
    },
  },
  verification: {
    google: 'your-google-site-verification',
  },
  category: 'technology',
  applicationName: 'AnhND Personal Website',
  appleWebApp: {
    title: 'AnhND',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
  manifest: '/site.webmanifest',
  archives: ['https://anhnd.com/notes'],
  assets: ['https://anhnd.com/assets'],
  bookmarks: ['https://anhnd.com/notes'],
  itunes: {
    appId: 'myAppStoreID',
    appArgument: 'https://anhnd.com',
  },
}

// Viewport metadata
// Enhance viewport settings for better mobile experience
export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#ffffff' }, { media: '(prefers-color-scheme: dark)', color: '#0f172a' }],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${jakartaSans.className} ${jakartaSans.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://anhnd.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider>
          {children}
          <GoogleAnalytics />
        </ThemeProvider>
      </body>
    </html>
  )
}