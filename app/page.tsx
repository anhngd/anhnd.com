// Minimal landing page — blank white page showing only "AnhND.com".
// The full homepage lives in HomeClient.tsx (kept intact); restore by
// rendering <HomeClient notesData={getSortedNotesData()} /> again.
export default function Home() {
  return (
    <main
      className="min-h-screen flex items-center justify-center bg-white px-6"
      style={{ fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif' }}
    >
      <h1
        className="text-4xl sm:text-5xl text-[#1A1A1A]"
        style={{ fontWeight: 400, letterSpacing: '-0.03em' }}
      >
        Anh<span className="text-[#FF5F00]">ND</span><span className="text-[#8A8886]">.com</span>
      </h1>
    </main>
  )
}
