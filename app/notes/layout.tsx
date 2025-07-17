import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Notes | Anh Nguyen',
  description: 'Collection of thoughts, insights, and notes on design, development, productivity, technology, career, and personal growth.',
  openGraph: {
    title: 'Notes | Anh Nguyen',
    description: 'Collection of thoughts, insights, and notes on design, development, productivity, technology, career, and personal growth.',
    url: 'https://anhnd.com/notes',
    siteName: 'Anh Nguyen',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Notes | Anh Nguyen',
    description: 'Collection of thoughts, insights, and notes on design, development, productivity, technology, career, and personal growth.',
  },
  alternates: {
    canonical: 'https://anhnd.com/notes',
  }
}

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
