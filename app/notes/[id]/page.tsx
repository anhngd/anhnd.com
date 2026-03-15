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

export default async function NotePage({ params }: { params: { id: string } }) {
  const allNotes = getSortedNotesData()
  const noteData =
    params.id === PLACEHOLDER_NOTE_ID ? null : await getNoteData(params.id)

  return <NoteContent note={noteData} allNotes={allNotes} />
}
