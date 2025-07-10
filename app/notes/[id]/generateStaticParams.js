// This file contains the static params for the notes dynamic routes
export async function generateStaticParams() {
  // Return all possible note IDs for static generation
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
  ]
}
