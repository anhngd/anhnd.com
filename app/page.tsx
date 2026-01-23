import HomeClient from './HomeClient'
import { getSortedNotesData } from '@/lib/markdown'

export default function Home() {
  // Get all notes data from markdown files
  const notesData = getSortedNotesData()
  
  return <HomeClient notesData={notesData} />
}
