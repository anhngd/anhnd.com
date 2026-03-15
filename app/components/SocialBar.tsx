'use client'

export default function SocialBar() {
  const socialLinks = [
    {
      name: 'Email',
      href: 'mailto:me@anhnd.com',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
      ),
      color: '#FF5F00'
    }
  ]

  return (
    <div className="fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8">
      <div className="flex flex-col gap-3">
        {/* Email Link */}
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="group flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#323130] shadow-md ring-1 ring-[#E1DFDD] transition-colors hover:ring-[#FF5F00] sm:h-14 sm:w-14"
            aria-label={link.name}
          >
            <div 
              className="transition-colors"
              style={{
                color: `${link.color}`
              }}
            >
              {link.icon}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

