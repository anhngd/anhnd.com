import type { Metadata, Viewport } from 'next'
import { Google_Sans, Google_Sans_Code } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { SHOW_BLOG } from '@/lib/site'

const googleSans = Google_Sans({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  variable: '--font-google-sans',
  display: 'swap',
})

const googleSansCode = Google_Sans_Code({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  variable: '--font-google-sans-code',
  display: 'swap',
})

/**
 * Runs before first paint so a visitor who chose dark never sees a flash of light.
 * The site is light by default, so only the 'dark' choice is applied here.
 */
const themeScript = `try{if(localStorage.getItem('theme')==='dark')document.documentElement.setAttribute('data-theme','dark')}catch(e){}`

export const metadata: Metadata = {
  metadataBase: new URL('https://anhnd.com'),
  title: {
    template: '%s | Anh Nguyen',
    default: 'Anh Nguyen — Builder of products and lean teams',
  },
  description: 'Personal site of Anh Nguyen. I build products, lead lean teams, and turn ambitious ideas into meaningful impact.',
  keywords: [
    'Anh Nguyen', 'AnhND', 'Big Data', 'AI', 'Machine Learning',
    'Full-stack Developer', 'Digital Transformation', 'Developer Tools',
    'Password Generator', 'JSON Formatter', 'JWT Decoder',
    'Vietnam', 'HUST', 'Applied Mathematics',
  ],
  authors: [{ name: 'Anh Nguyen', url: 'https://anhnd.com' }],
  creator: 'Anh Nguyen',
  publisher: 'Anh Nguyen',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Anh Nguyen — Builder of products and lean teams',
    description: 'I build products, lead lean teams, and turn ambitious ideas into meaningful impact.',
    url: 'https://anhnd.com',
    siteName: 'Anh Nguyen',
    images: [
      {
        url: 'https://anhnd.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Anh Nguyen — Builder of products and lean teams',
        type: 'image/png',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anh Nguyen — Builder of products and lean teams',
    description: 'I build products, lead lean teams, and turn ambitious ideas into meaningful impact.',
    creator: '@anhnd',
    images: ['https://anhnd.com/og-image.png'],
    site: '@anhnd',
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
  category: 'technology',
  applicationName: 'Anh Nguyen',
  appleWebApp: {
    title: 'Anh Nguyen',
    statusBarStyle: 'default',
    capable: true,
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  manifest: '/site.webmanifest',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
  },
}

// Viewport metadata
export const viewport: Viewport = {
  // The site is light by default, so the browser chrome matches it.
  themeColor: '#F7F8FC',
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
    <html lang="en" className={`${googleSans.variable} ${googleSansCode.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        {SHOW_BLOG && (
          <link rel="alternate" type="application/rss+xml" title="Anh Nguyen — Notes" href="/feed.xml" />
        )}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-E9EETHCYCL"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('consent', 'default', {
              analytics_storage: 'granted'
            });
            gtag('config', 'G-E9EETHCYCL');
          `}
        </Script>
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}