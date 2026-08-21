import { MetadataRoute } from 'next'
import { getSortedNotesData } from '@/lib/markdown'

export const dynamic = 'force-static'

const baseUrl = 'https://anhnd.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const notes = getSortedNotesData()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/notes`, changeFrequency: 'weekly', priority: 0.8 },
  ]

  const noteRoutes: MetadataRoute.Sitemap = notes.map((note) => ({
    url: `${baseUrl}/notes/${note.id}`,
    lastModified: new Date(note.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...noteRoutes]
}
