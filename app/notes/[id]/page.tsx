import { Metadata } from 'next'
import NoteContent from './NoteContent'
import { getAllNoteIds, getNoteData, getSortedNotesData } from '@/lib/markdown'

const PLACEHOLDER_NOTE_ID = '__placeholder__'

export async function generateStaticParams() {
  const noteIds = getAllNoteIds()
  if (noteIds.length === 0) {
    return [{ id: PLACEHOLDER_NOTE_ID }]
  }

  return noteIds.map((note) => ({
    id: note.id,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const note = id === PLACEHOLDER_NOTE_ID ? null : await getNoteData(id)

  if (!note) {
    return {
      title: 'Note not found',
    }
  }

  const url = `https://anhnd.com/notes/${note.id}`

  return {
    title: note.title,
    description: note.excerpt,
    authors: [{ name: 'Anh Nguyen', url: 'https://anhnd.com' }],
    keywords: note.tags,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: note.title,
      description: note.excerpt,
      url,
      siteName: 'Anh Nguyen',
      type: 'article',
      publishedTime: note.date,
      authors: ['Anh Nguyen'],
      tags: note.tags,
      images: [
        {
          url: 'https://anhnd.com/og-image.png',
          width: 1200,
          height: 630,
          alt: note.title,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: note.title,
      description: note.excerpt,
      images: ['https://anhnd.com/og-image.png'],
    },
  }
}

export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const allNotes = getSortedNotesData()
  const noteData =
    id === PLACEHOLDER_NOTE_ID ? null : await getNoteData(id)

  return <NoteContent note={noteData} allNotes={allNotes} />
}
