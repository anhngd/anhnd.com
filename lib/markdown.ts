import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import remarkGfm from 'remark-gfm'
import * as cheerio from 'cheerio'

const notesDirectory = path.join(process.cwd(), 'content/notes')

export interface NoteMetadata {
  id: string
  title: string
  date: string
  excerpt: string
  category: string
  readingTime?: string
  author?: string
  tags?: string[]
}

export interface Note extends NoteMetadata {
  content: string
  contentHtml: string
}

// Get all note IDs for static generation
export function getAllNoteIds() {
  // Check if directory exists
  if (!fs.existsSync(notesDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(notesDirectory)
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      return {
        id: fileName.replace(/\.md$/, '')
      }
    })
}

// Get sorted notes data for listing
export function getSortedNotesData(): NoteMetadata[] {
  // Check if directory exists
  if (!fs.existsSync(notesDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(notesDirectory)
  const allNotesData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const id = fileName.replace(/\.md$/, '')
      const fullPath = path.join(notesDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const matterResult = matter(fileContents)

      return {
        id,
        title: matterResult.data.title || 'Untitled',
        date: matterResult.data.date || new Date().toISOString(),
        excerpt: matterResult.data.excerpt || '',
        category: matterResult.data.category || 'General',
        readingTime: matterResult.data.readingTime,
        author: matterResult.data.author,
        tags: matterResult.data.tags || []
      }
    })

  // Sort by date
  return allNotesData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

// Get single note data
export async function getNoteData(id: string): Promise<Note | null> {
  const fullPath = path.join(notesDirectory, `${id}.md`)

  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContents)

  // Use remark to convert markdown to HTML
  const processedContent = await remark()
    .use(remarkGfm)
    .use(html, { sanitize: false })
    .process(matterResult.content)
  
  const contentHtml = processedContent.toString()

  return {
    id,
    title: matterResult.data.title || 'Untitled',
    date: matterResult.data.date || new Date().toISOString(),
    excerpt: matterResult.data.excerpt || '',
    category: matterResult.data.category || 'General',
    readingTime: matterResult.data.readingTime,
    author: matterResult.data.author,
    tags: matterResult.data.tags || [],
    content: matterResult.content,
    contentHtml
  }
}

// Split content into swipe-able segments
export function splitContentIntoSegments(contentHtml: string): string[] {
  const $ = cheerio.load(contentHtml)
  const segments: string[] = []

  // Get all top-level elements
  const children = $('body').children()

  if (children.length === 0) {
    // If no structured elements, split by paragraphs or length
    const paragraphs = contentHtml.split(/(<\/p>|<br\s*\/?>)/i)
    let currentSegment = ''
    let segmentLength = 0

    for (const part of paragraphs) {
      currentSegment += part
      segmentLength += part.length

      // Create a new segment when we have enough content
      if (segmentLength > 800 && currentSegment.trim()) {
        segments.push(currentSegment.trim())
        currentSegment = ''
        segmentLength = 0
      }
    }

    // Add remaining content
    if (currentSegment.trim()) {
      segments.push(currentSegment.trim())
    }
  } else {
    // Split by headings and create segments
    let currentSegment = ''
    let hasHeading = false

    children.each((index, element) => {
      const tagName = element.tagName.toLowerCase()
      const elementHtml = $.html(element)

      // Start new segment at headings (h1, h2, h3)
      if (tagName.match(/^h[1-3]$/)) {
        if (currentSegment.trim() && hasHeading) {
          segments.push(currentSegment.trim())
          currentSegment = ''
        }
        currentSegment += elementHtml
        hasHeading = true
      } else {
        currentSegment += elementHtml

        // Check if segment is getting too long
        if (currentSegment.length > 1200 && hasHeading) {
          segments.push(currentSegment.trim())
          currentSegment = ''
          hasHeading = false
        }
      }
    })

    // Add remaining content
    if (currentSegment.trim()) {
      segments.push(currentSegment.trim())
    }
  }

  // Ensure we have at least one segment
  if (segments.length === 0) {
    segments.push(contentHtml)
  }

  return segments
}

// Calculate reading time from content
export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} min read`
}

