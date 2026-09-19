import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Anh Nguyen — Technical Manager and solo founder based in Vietnam. I build products, lead small teams, and think a lot about how small teams can do big things.',
  openGraph: {
    title: 'About — Anh Nguyen',
    description: 'Technical Manager and solo founder based in Vietnam. I build products, lead small teams, and think a lot about how small teams can do big things.',
    url: 'https://anhnd.com/about',
    siteName: 'Anh Nguyen',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About — Anh Nguyen',
    description: 'Technical Manager and solo founder based in Vietnam. I build products, lead small teams, and think a lot about how small teams can do big things.',
  },
  alternates: {
    canonical: 'https://anhnd.com/about',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
