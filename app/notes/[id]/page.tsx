import NoteContent from './NoteContent'
import { getAllNoteIds, getNoteData, getSortedNotesData } from '@/lib/markdown'

// Define note type
type Note = {
  id: string
  title: string
  date: string
  excerpt: string
  category: string
  content: string
  contentHtml: string
  segments?: string[]
}

// Generate static params for static site generation
export async function generateStaticParams() {
  const noteIds = getAllNoteIds()
  return noteIds.map((note) => ({
    id: note.id,
  }))
}

export default async function NotePage({ params }: { params: { id: string } }) {
  const id = params.id

  // Get note data from markdown file
  const noteData = await getNoteData(id)
  const allNotes = getSortedNotesData()

  if (!noteData) {
    return <NoteContent note={null} allNotes={allNotes} />
  }

  // Split content into segments for swipe navigation
  const { splitContentIntoSegments } = await import('@/lib/markdown')
  const segments = splitContentIntoSegments(noteData.contentHtml)

  const note: Note = {
    id: noteData.id,
    title: noteData.title,
    date: noteData.date,
    excerpt: noteData.excerpt,
    category: noteData.category,
    content: noteData.content,
    contentHtml: noteData.contentHtml,
    segments
  }

  return <NoteContent note={note} allNotes={allNotes} />
}
