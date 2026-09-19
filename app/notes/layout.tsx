import { Metadata } from 'next'
import { SHOW_BLOG } from '@/lib/site'

const visibleMetadata: Metadata = {
  title: 'Notes',
  description: 'Thoughts on engineering, management, and the craft of building things — by Anh Nguyen.',
  openGraph: {
    title: 'Notes — Anh Nguyen',
    description: 'Thoughts on engineering, management, and the craft of building things.',
    url: 'https://anhnd.com/notes',
    siteName: 'Anh Nguyen',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Notes — Anh Nguyen',
    description: 'Thoughts on engineering, management, and the craft of building things.',
  },
  alternates: {
    canonical: 'https://anhnd.com/notes',
  }
}

export const metadata: Metadata = SHOW_BLOG
  ? visibleMetadata
  : { robots: { index: false, follow: false } }

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
