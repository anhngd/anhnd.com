import { MetadataRoute } from 'next'
import { getSortedNotesData } from '@/lib/markdown'
import { SHOW_BLOG, SITE, tools } from '@/lib/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  // Static export: the build time is the best "last changed" signal available.
  const lastModified = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE.url}/tools/`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    ...tools.map((tool) => ({
      url: `${SITE.url}${tool.href}/`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  if (!SHOW_BLOG) return staticRoutes

  const blogRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/notes/`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    ...getSortedNotesData().map((note) => ({
      url: `${SITE.url}/notes/${note.id}/`,
      lastModified: new Date(note.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]

  return [...staticRoutes, ...blogRoutes]
}
