# anhnd.com

PERSONAL PAGE OF ANHND - Full-stack Developer, Solo Founder, and MSc. in Applied Mathematics.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Deployment**: Static Export

## ✨ Features

- Minimalist, professional design with smooth animations
- Responsive layout (mobile, tablet, desktop optimized)
- SEO optimized with structured data (JSON-LD)
- Accessibility-focused (WCAG AA+, keyboard navigation, ARIA labels)
- Blog/Notes section with:
  - Category grouping with interactive cards
  - Category filtering
  - Pagination
  - Dynamic table of contents (TOC)
  - Two-column layout on blog posts
- About Me modal with education background
- Hardware-accelerated animations for smooth performance

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
├── components/         # Reusable components
│   ├── Modal.tsx       # About Me modal
│   ├── SocialBar.tsx   # Social icons (fixed position)
│   └── StructuredData.tsx  # SEO structured data (JSON-LD)
├── notes/              # Blog/Notes pages
│   └── [id]/           # Dynamic blog post routes
│       ├── page.tsx    # Blog post page (Server Component)
│       └── NoteContent.tsx  # Two-column layout with TOC (Client)
├── page.tsx            # Home page (Server Component - data fetching)
├── HomeClient.tsx      # Home page UI with categories & blog list
├── layout.tsx          # Root layout with SEO metadata
├── not-found.tsx       # 404 page
└── globals.css         # Global styles and animations
content/
└── notes/              # Markdown blog posts
    ├── welcome-to-my-blog.md
    └── markdown-syntax-guide.md
lib/
└── markdown.ts         # Markdown processing utilities
```

## 🎨 Key Components

- **Hero Section**: Professional introduction with expertise tags and smooth animations
- **Category Cards**: Large, interactive cards grouping posts by topic with hover effects
- **Blog List**: Filterable, paginated blog posts with category badges
- **About Modal**: Full-screen modal with education (MSc. + Engineer) and experience
- **Two-Column Blog Layout**: 
  - Left sidebar: Back link, article title, dynamic TOC with active tracking, other articles
  - Right content: Optimized prose styling for readability
- **SocialBar**: Fixed bottom-right position with email link
- **Responsive Design**: Mobile-first with optimized layouts for all screen sizes

## 📝 Content Updates

- **Personal info**: Update in `app/HomeClient.tsx` (Hero section and About Me modal)
- **Blog posts**: Add markdown files in `content/notes/` directory (see `BLOG-GUIDE.md`)
- **Metadata**: Update in `app/layout.tsx` for SEO
- **Styling**: Customize in `tailwind.config.ts` and `globals.css`

## 📚 Documentation

- **BLOG-GUIDE.md**: Complete guide for writing blog posts with Markdown

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
