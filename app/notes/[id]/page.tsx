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

export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const allNotes = getSortedNotesData()
  const noteData =
    id === PLACEHOLDER_NOTE_ID ? null : await getNoteData(id)

  return <NoteContent note={noteData} allNotes={allNotes} />
}
