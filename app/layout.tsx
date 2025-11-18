import type { Metadata, Viewport } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'
import GoogleAnalytics from './components/GoogleAnalytics'
import 'katex/dist/katex.min.css'
import ThemeProvider from './components/ThemeProvider'
import Script from 'next/script'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap'
})

export const metadata: Metadata = {
  metadataBase: new URL('https://anhnd.com'),
  title: {
    template: '%s | AnhND',
    default: `AnhND - a developer. | Big Data & AI Lead`,
  },
  description: 'Engineer & Master of Applied Mathematics from HUST. 10+ years in IT: from government digital transformation, enterprise solutions, gaming, Web3, to Big Data & AI. Based in Vietnam.',
  keywords: 'AnhND, Applied Mathematics, HUST, Big Data, AI, Machine Learning, Digital Transformation, Web3, Blockchain, Gaming, System Architecture, Data Engineering, Management, Vietnam, Software Engineer, Tech Lead',
  authors: [{ name: 'AnhND', url: 'https://anhnd.com' }],
  creator: 'AnhND',
  publisher: 'AnhND',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `AnhND - a developer. | Big Data & AI Lead`,
    description: 'Engineer & Master of Applied Mathematics from HUST. 10+ years: Digital Transformation → Gaming → Web3 → Big Data & AI. Building intelligent systems at scale.',
    url: 'https://anhnd.com',
    siteName: 'AnhND',
    images: [
      {
        url: 'https://anhnd.com/og-image.png', // Optimized social sharing image
        width: 1200,
        height: 630,
        alt: 'AnhND - Big Data & AI Lead | 10+ Years in Tech',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `AnhND - a developer.`,
    description: '10+ years: Gov DX → Enterprise → Gaming → Web3 → Big Data & AI. Math background, tech execution, strategic thinking.',
    creator: '@anhnd',
    images: ['https://anhnd.com/og-image.png'],
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
    <html lang="en" className={`${spaceGrotesk.className} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://anhnd.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* Prevent flash of unstyled content - preload theme */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            document.documentElement.setAttribute('data-theme', 'light');
            document.documentElement.style.setProperty('color-scheme', 'light');
            document.documentElement.classList.add('theme-ready');
          })()
        ` }} />
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