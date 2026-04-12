import type { Metadata, Viewport } from 'next'
import { Space_Grotesk } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap'
})

export const metadata: Metadata = {
  metadataBase: new URL('https://anhnd.com'),
  title: {
    template: '%s | Anh Nguyen',
    default: 'Anh Nguyen — Engineer, Builder, Writer',
  },
  description: 'Personal site of Anh Nguyen — software engineer, solo founder, and writer. I build products, lead small teams, and write about engineering, management, and the craft of making things.',
  keywords: [
    'Anh Nguyen', 'AnhND', 'Software Engineer', 'Solo Founder',
    'Big Data', 'AI', 'Machine Learning', 'Full-stack Developer',
    'Engineering Management', 'Leadership', 'Digital Transformation',
    'Vietnam', 'HUST', 'Applied Mathematics',
  ],
  authors: [{ name: 'Anh Nguyen', url: 'https://anhnd.com' }],
  creator: 'Anh Nguyen',
  publisher: 'Anh Nguyen',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Anh Nguyen — Engineer, Builder, Writer',
    description: 'I build products, lead small teams, and write about what I learn along the way. Notes on engineering, management, and building things that matter.',
    url: 'https://anhnd.com',
    siteName: 'Anh Nguyen',
    images: [
      {
        url: 'https://anhnd.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Anh Nguyen — Engineer, Builder, Writer',
        type: 'image/png',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anh Nguyen — Engineer, Builder, Writer',
    description: 'I build products, lead small teams, and write about what I learn along the way.',
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
  themeColor: '#ffffff',
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
    <html lang="en" className={`${spaceGrotesk.className} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#FF5F00" />
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