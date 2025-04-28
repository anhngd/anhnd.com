import type { Metadata } from 'next'
import { Lexend } from 'next/font/google'
import './globals.css'
import GoogleAnalytics from './components/GoogleAnalytics'

const lexend = Lexend({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "I'm AnhND",
  description: 'Personal website of AnhND, a Full-stack Developer & UI/UX Enthusiast based in Hanoi, Vietnam.',
  keywords: ['AnhND', 'Full-stack Developer', 'UI/UX', 'Hanoi', 'Vietnam', 'Web Development', 'Digital Transformation'],
  authors: [{ name: 'AnhND' }],
  openGraph: {
    title: 'AnhND - Applied Mathematician & Technology Enthusiast',
    description: 'Personal website of AnhND, showcasing professional journey and expertise in applied mathematics and technology.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnhND - Applied Mathematician & Technology Enthusiast',
    description: 'Personal website of AnhND, showcasing professional journey and expertise in applied mathematics and technology.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={lexend.className}>
      <body className="antialiased">
        <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
        {children}
      </body>
    </html>
  )
} 