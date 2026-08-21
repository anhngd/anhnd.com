import HomeClient from './HomeClient'
import { getSortedNotesData } from '@/lib/markdown'

export default function Home() {
  const notesData = getSortedNotesData()
  return <HomeClient notesData={notesData} />
}
