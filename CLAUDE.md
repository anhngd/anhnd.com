# anhnd.com — Personal Website

## Project Overview

Personal website and blog for Anh Nguyen (anhnd.com). Static site built with Next.js, deployed as static export.

## Tech Stack

- **Framework:** Next.js 14 (App Router, static export)
- **Styling:** Tailwind CSS 3.4 with custom config
- **Content:** Markdown files in `content/notes/` with gray-matter frontmatter
- **Font:** Space Grotesk (via next/font)
- **Package manager:** Yarn 4.9

## Project Structure

```
app/
├── page.tsx              ← Home (server component, loads notes)
├── HomeClient.tsx        ← Home UI (client component, hero + blog list)
├── layout.tsx            ← Root layout, metadata, fonts
├── globals.css           ← Global styles, CSS variables
├── not-found.tsx         ← 404 page
├── components/
│   ├── Modal.tsx         ← Full-screen modal (About Me)
│   ├── SocialBar.tsx     ← Fixed email icon bottom-right
│   └── StructuredData.tsx← JSON-LD for SEO
└── notes/
    ├── page.tsx          ← Notes listing
    ├── layout.tsx        ← Notes metadata
    └── [id]/
        ├── page.tsx      ← Note detail (SSG with generateStaticParams)
        └── NoteContent.tsx← Note UI (client, TOC, sidebar, article)

content/notes/            ← Markdown blog posts (frontmatter + body)
lib/markdown.ts           ← Markdown processing (gray-matter + remark)
public/                   ← Static assets (og-image, icons, manifest)
```

## Commands

```bash
yarn dev          # Start dev server (localhost:3000)
yarn build        # Build static export to out/
yarn lint         # ESLint
```

## Content System

Blog posts are Markdown files in `content/notes/`. Each file needs:

```yaml
---
title: "Post Title"
date: "YYYY-MM-DD"
excerpt: "1-2 sentence description"
category: "Category Name"
tags: ["tag1", "tag2"]
author: "AnhND"
---
```

- File name = URL slug (`my-post.md` → `/notes/my-post`)
- Posts auto-sort by date (newest first)
- Categories auto-generate from post frontmatter

## Design System

- **Brand color:** #FF5F00 (orange)
- **Background:** #FAFAF9 (off-white), #FFFFFF (content sections)
- **Text:** #1A1A1A (primary), #605E5C (secondary), #8A8886 (muted)
- **Borders:** #F0EEEC (light), #E1DFDD (medium)
- **Font weights:** 300 (light/body), 400 (normal/headings), 500 (medium/buttons)
- **Style:** Minimal, clean, light effects (dot pattern, fade-in on scroll). No dark mode.

## Rules

- Static export only — no server-side features (API routes, SSR, middleware)
- No dark mode — single light theme
- Keep dependencies minimal — avoid adding new packages unless necessary
- Blog posts in English
- Accessibility: proper aria labels, reduced-motion support, semantic HTML
- Run `yarn build` before marking work as done to verify static export works
