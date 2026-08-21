import { getSortedNotesData } from '@/lib/markdown'

export const dynamic = 'force-static'

const baseUrl = 'https://anhnd.com'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const notes = getSortedNotesData()

  const items = notes
    .map(
      (note) => `
    <item>
      <title>${escapeXml(note.title)}</title>
      <link>${baseUrl}/notes/${note.id}</link>
      <guid isPermaLink="true">${baseUrl}/notes/${note.id}</guid>
      <pubDate>${new Date(note.date).toUTCString()}</pubDate>
      <description>${escapeXml(note.excerpt)}</description>
      <category>${escapeXml(note.category)}</category>
    </item>`
    )
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Anh Nguyen — Notes</title>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Thoughts on engineering, management, and building things — by Anh Nguyen.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>
`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
