import { MetadataRoute } from 'next'
import { getSortedNotesData } from '@/lib/markdown'
import { SHOW_BLOG, SITE, tools } from '@/lib/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE.url, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE.url}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE.url}/tools`, changeFrequency: 'monthly', priority: 0.8 },
    ...tools.map((tool) => ({
      url: `${SITE.url}${tool.href}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  if (!SHOW_BLOG) return staticRoutes

  const blogRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/notes`, changeFrequency: 'weekly', priority: 0.8 },
    ...getSortedNotesData().map((note) => ({
      url: `${SITE.url}/notes/${note.id}`,
      lastModified: new Date(note.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]

  return [...staticRoutes, ...blogRoutes]
}
