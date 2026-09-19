# anhnd.com — Personal Website

## Project Overview

Personal website and blog for Anh Nguyen (anhnd.com). Static site built with Next.js, deployed as static export.

## Tech Stack

- **Framework:** Next.js 16 (App Router, static export)
- **Styling:** Tailwind CSS 4 with custom config
- **Content:** Markdown files in `content/notes/` with gray-matter frontmatter
- **Font:** Space Grotesk (via next/font)
- **Package manager:** Yarn 4.9

## Project Structure

```
app/
├── page.tsx              ← Home (hero, facts, what I do, tools, contact)
├── layout.tsx            ← Root layout, metadata, fonts
├── globals.css           ← Global styles, CSS variables
├── not-found.tsx         ← 404 page
├── components/
│   ├── Nav.tsx           ← Sticky top nav (Notes link only when SHOW_BLOG)
│   ├── Footer.tsx        ← Shared footer
│   ├── FadeIn.tsx        ← Fade-in-on-scroll wrapper (client)
│   └── StructuredData.tsx← JSON-LD for SEO
├── about/                ← About page
├── tools/
│   ├── page.tsx          ← Tools index
│   └── password-generator/
│       ├── page.tsx      ← Server page + metadata
│       └── PasswordGenerator.tsx ← Client UI
├── notes/                ← Blog (hidden, see below)
└── status/               ← Server status dashboard (unlisted)

content/notes/            ← Markdown blog posts (frontmatter + body)
lib/site.ts               ← Site constants, SHOW_BLOG flag, shared copy, tools list
lib/passwords.ts          ← Platform presets, generator, rule checks, strength grading
lib/markdown.ts           ← Markdown processing (gray-matter + remark)
public/                   ← Static assets (og-image, icons, manifest)
```

## Blog (currently hidden)

`SHOW_BLOG` in `lib/site.ts` is `false`. While off: no Notes link, no home section, notes are
left out of the sitemap, RSS serves an empty feed, and `/notes` and `/notes/[id]` redirect to `/`.
Content in `content/notes/` is untouched. Set it to `true` to restore everything.

## Tools

Add a tool: create `app/tools/<slug>/page.tsx`, then add it to `tools` in `lib/site.ts`
(that feeds the Tools page, home teaser and sitemap).

1Click Password Generation (`/tools/password-generator`): every preset in `lib/passwords.ts` has a `basis` — `official` (platform docs),
`typical` (platform only publishes recommendations) or `guidance` (ours). Only mark a preset
`official` if the rule is on the platform's own page, and keep `sourceUrl` current. Generation uses
Web Crypto with rejection sampling; keep it that way (no `Math.random`).

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

- Static export only — no server-side features (API routes, SSR, middleware). Tools run fully client-side; never send or store user input
- No dark mode — single light theme
- Keep dependencies minimal — avoid adding new packages unless necessary
- Blog posts in English
- Accessibility: proper aria labels, reduced-motion support, semantic HTML
- Run `yarn build` before marking work as done to verify static export works

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
