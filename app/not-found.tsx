'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <main 
      className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden relative"
      style={{ fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif' }}
    >
      <div
        className="absolute inset-0 opacity-5"
        style={{
          background: 'radial-gradient(circle at 20% 50%, #FF5F00 0%, transparent 50%), radial-gradient(circle at 80% 50%, #EB001B 0%, transparent 50%)',
        }}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
        <div className="mb-6 sm:mb-8 md:mb-12">
          <h1 
            className="text-[100px] sm:text-[140px] md:text-[200px] lg:text-[280px] font-light leading-none tracking-tight"
            style={{ 
              fontWeight: 300,
              background: 'linear-gradient(135deg, #FF5F00 0%, #EB001B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            404
          </h1>
        </div>

        {/* Text content */}
        <div className="mb-6 sm:mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#323130] mb-3 sm:mb-4 md:mb-6 font-light" style={{ fontWeight: 300 }}>
            Page Not Found
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#605E5C] max-w-2xl mx-auto leading-relaxed font-light px-4" style={{ fontWeight: 300 }}>
            The page you're looking for doesn't exist or has been moved. 
            <br className="hidden sm:block" />
            Perhaps it's exploring the metaverse? 🚀
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-md sm:max-w-none mx-auto">
          <Link
            href="/"
            className="bg-[#FF5F00] text-white hover:bg-[#EB001B] active:bg-[#D10019] transition-colors flex items-center justify-center gap-2 font-light rounded-lg shadow-sm px-6 sm:px-8 py-3 text-sm sm:text-base"
            style={{ 
              boxShadow: '0 1.6px 3.6px rgba(0,0,0,.132), 0 .3px .9px rgba(0,0,0,.108)',
              fontWeight: 300
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <span>Back to Home</span>
          </Link>

          <Link
            href="/#blog-section"
            className="bg-white border border-[#8A8886] text-[#323130] hover:bg-[#F3F2F1] active:bg-[#EDEBE9] transition-colors flex items-center justify-center gap-2 font-light rounded-lg px-6 sm:px-8 py-3 text-sm sm:text-base"
            style={{ fontWeight: 300 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <span>Browse Notes</span>
          </Link>
        </div>
      </div>
    </main>
  )
}


