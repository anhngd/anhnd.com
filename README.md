# anhnd.com

PERSONAL PAGE OF ANHND - Full-stack Developer, Solo Founder, and MSc. in Applied Mathematics.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Deployment**: Static Export

## ✨ Features

- Minimalist design with smooth animations
- Responsive layout (mobile, tablet, desktop optimized)
- SEO optimized with structured data
- Custom 404 page
- Blog/Notes section with pagination
- About Me modal
- Dark theme footer

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Export static site
npm run export
```

## 📁 Project Structure

```
app/
├── components/          # Reusable components
│   ├── Modal.tsx       # About Me modal
│   ├── ThemeProvider.tsx & ThemeSwitch.tsx
│   └── StructuredData.tsx  # SEO structured data
├── notes/              # Blog/Notes pages
│   └── [id]/           # Dynamic blog post routes
│       ├── page.tsx    # Blog post page (Server Component)
│       └── NoteContent.tsx  # Blog content & layout (Client Component)
├── page.tsx            # Home page (Server Component - data fetching)
├── HomeClient.tsx      # Home page UI (Client Component)
├── layout.tsx          # Root layout with metadata
├── not-found.tsx       # 404 page
└── globals.css         # Global styles
content/
└── notes/              # Markdown blog posts
    ├── welcome-to-my-blog.md
    └── markdown-syntax-guide.md
lib/
└── markdown.ts         # Markdown processing utilities
```

## 🎨 Key Components

- **Hero Section**: Professional introduction with smooth fade-in animations
- **Blog List**: Paginated blog posts with category display
- **About Modal**: Full-screen modal with education background and experience
- **Two-Column Blog Layout**: Left sidebar with TOC and other articles, right content area
- **Responsive Design**: Mobile-first approach with adaptive layouts

## 📝 Content Updates

- **Personal info**: Update in `app/HomeClient.tsx` (Hero section and About Me modal)
- **Blog posts**: Add markdown files in `content/notes/` directory
- **Metadata**: Update in `app/layout.tsx` for SEO
- **Styling**: Customize in `tailwind.config.ts` and `globals.css`

## 🌐 Deployment

This site is configured for static export. Deploy to:
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**
- Any static hosting service

## 📄 License

MIT License - feel free to use this as a template for your own site.

---

Built with ❤️ by AnhND
