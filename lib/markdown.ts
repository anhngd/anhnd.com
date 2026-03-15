import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { cache } from 'react'
import { remark } from 'remark'
import html from 'remark-html'
import remarkGfm from 'remark-gfm'

const notesDirectory = path.join(process.cwd(), 'content/notes')

export interface NoteMetadata {
  id: string
  title: string
  date: string
  excerpt: string
  category: string
  tags?: string[]
}

export interface Note extends NoteMetadata {
  content: string
  contentHtml: string
}

export const getAllNoteIds = cache(function getAllNoteIds() {
  if (!fs.existsSync(notesDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(notesDirectory)
  return fileNames
    .filter(fileName => fileName.endsWith('.md') && fileName !== 'README.md')
    .map(fileName => ({
      id: fileName.replace(/\.md$/, '')
    }))
})

export const getSortedNotesData = cache(function getSortedNotesData(): NoteMetadata[] {
  if (!fs.existsSync(notesDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(notesDirectory)
  const allNotesData = fileNames
    .filter(fileName => fileName.endsWith('.md') && fileName !== 'README.md')
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
        tags: matterResult.data.tags || []
      }
    })

  return allNotesData.sort((a, b) => (a.date < b.date ? 1 : -1))
})

export const getNoteData = cache(async function getNoteData(id: string): Promise<Note | null> {
  const fullPath = path.join(notesDirectory, `${id}.md`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContents)

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
    tags: matterResult.data.tags || [],
    content: matterResult.content,
    contentHtml
  }
})
