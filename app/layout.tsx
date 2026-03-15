import type { Metadata, Viewport } from 'next'
import { Space_Grotesk } from 'next/font/google'
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
    template: '%s | AnhND - Developer & Engineer',
    default: `AnhND - Developer, Engineer & MSc. in Applied Mathematics`,
  },
  description: 'AnhND - Professional Software Engineer and MSc. in Applied Mathematics from HUST with 10+ years of experience in enterprise digital transformation, gaming systems, Big Data, and AI. Specialized in full-stack development, system architecture, and technical leadership.',
  keywords: [
    // Core Identity
    'AnhND', 'Anh Nguyen', 'Software Engineer', 'Full-stack Developer',
    // Education
    'MSc Applied Mathematics', 'HUST', 'Hanoi University of Science and Technology',
    // Technical Skills
    'Big Data', 'Artificial Intelligence', 'Machine Learning', 'Data Engineering',
    'System Architecture', 'Full-stack Development', 'Software Development',
    // Domain Expertise  
    'Digital Transformation', 'Enterprise Solutions', 'Gaming Development',
    'Technical Leadership', 'Engineering Management',
    // Location
    'Vietnam', 'Hanoi', 'Southeast Asia'
  ],
  authors: [{ name: 'AnhND', url: 'https://anhnd.com' }],
  creator: 'AnhND',
  publisher: 'AnhND',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AnhND - Software Engineer & MSc. in Applied Mathematics',
    description: 'Professional Software Engineer with MSc. in Applied Mathematics from HUST. 10+ years of expertise in enterprise digital transformation, gaming systems, Big Data, and AI development. Specialized in building scalable, intelligent systems.',
    url: 'https://anhnd.com',
    siteName: 'AnhND - Developer & Engineer',
    images: [
      {
        url: 'https://anhnd.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AnhND - Software Engineer & MSc. in Applied Mathematics | 10+ Years in Tech',
        type: 'image/png',
      },
    ],
    locale: 'en_US',
    type: 'website',
    countryName: 'Vietnam',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnhND - Software Engineer & Applied Mathematics Expert',
    description: '10+ years: Enterprise Digital Transformation → Gaming Systems → Big Data & AI. MSc. in Applied Mathematics from HUST. Building intelligent, scalable systems.',
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
  applicationName: 'AnhND - Developer & Engineer',
  appleWebApp: {
    title: 'AnhND',
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
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}