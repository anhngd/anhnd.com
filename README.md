# anhnd.com

Personal website of AnhND - a developer, a solo founder, and more.

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
│   └── StructuredData.tsx  # SEO structured data
├── notes/              # Blog/Notes pages
├── page.tsx            # Home page
├── layout.tsx          # Root layout
├── not-found.tsx       # 404 page
└── globals.css         # Global styles
```

## 🎨 Key Components

- **Hero Section**: Typing animation with cycling phrases
- **Blog List**: Paginated blog posts (5 per page)
- **About Modal**: Full-screen modal with smooth transitions
- **Responsive Navigation**: Sticky header that collapses on scroll

## 📝 Content Updates

- Personal info: Update in `app/page.tsx`
- Blog posts: Add/edit in `app/notes/[id]/page.tsx`
- Metadata: Update in `app/layout.tsx`
- Styling: Customize in `tailwind.config.ts`

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
