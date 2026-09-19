import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { SHOW_BLOG } from '@/lib/site'

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

/**
 * Runs before first paint so a visitor who chose a theme never sees a flash of the other one.
 * With no saved choice the CSS follows the OS setting on its own.
 */
const themeScript = `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}`

export const metadata: Metadata = {
  metadataBase: new URL('https://anhnd.com'),
  title: {
    template: '%s | Anh Nguyen',
    default: 'Anh Nguyen — Technical Manager & Builder',
  },
  description: 'Personal site of Anh Nguyen — technical manager and solo founder based in Vietnam. I build products, lead small teams, and make small useful tools.',
  keywords: [
    'Anh Nguyen', 'AnhND', 'Technical Manager', 'Solo Founder',
    'Big Data', 'AI', 'Machine Learning', 'Full-stack Developer',
    'Engineering Management', 'Leadership', 'Digital Transformation', 'Password Generator',
    'Vietnam', 'HUST', 'Applied Mathematics',
  ],
  authors: [{ name: 'Anh Nguyen', url: 'https://anhnd.com' }],
  creator: 'Anh Nguyen',
  publisher: 'Anh Nguyen',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Anh Nguyen — Technical Manager & Builder',
    description: 'I build products, lead small teams, and make small useful tools — like a platform-aware password generator.',
    url: 'https://anhnd.com',
    siteName: 'Anh Nguyen',
    images: [
      {
        url: 'https://anhnd.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Anh Nguyen — Technical Manager & Builder',
        type: 'image/png',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anh Nguyen — Technical Manager & Builder',
    description: 'I build products, lead small teams, and make small useful tools.',
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
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAFA' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0B' },
  ],
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
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
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