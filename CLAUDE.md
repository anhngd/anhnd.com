# anhnd.com — Personal Website

## Project Overview

Personal website and blog for Anh Nguyen (anhnd.com). Static site built with Next.js, deployed as static export.

## Tech Stack

- **Framework:** Next.js 16 (App Router, static export)
- **Styling:** Tailwind CSS 4 driven by design tokens in `app/globals.css` (light + dark themes)
- **Content:** Markdown files in `content/notes/` with gray-matter frontmatter
- **Fonts:** Inter (UI) and JetBrains Mono (code, passwords), via next/font, with the Vietnamese subset
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
│   ├── FadeIn.tsx        ← Fade-in-on-scroll wrapper (client); content stays visible without JS
│   ├── ThemeToggle.tsx   ← System / Light / Dark switch (saved in localStorage 'theme')
│   ├── tools/            ← Shared tool building blocks: ToolPage (page shell + metadata),
│   │                        ui.tsx (CopyButton, Segmented, Notice), toolStyles.ts, useNow.ts
│   └── StructuredData.tsx← JSON-LD for SEO
├── about/                ← About page
├── tools/
│   ├── page.tsx          ← Tools index (grouped by category)
│   └── <slug>/           ← one folder per tool: page.tsx (server, metadata) + <Name>Tool.tsx (client UI)
│       password-generator, json, base64-url, jwt-decoder, timestamp, regex-tester, cron-explainer
├── notes/                ← Blog (hidden, see below)
└── status/               ← Server status dashboard (unlisted)

content/notes/            ← Markdown blog posts (frontmatter + body)
lib/site.ts               ← Site constants, SHOW_BLOG flag, shared copy, tools list
lib/passwords.ts          ← Platform presets, generator, rule checks, strength grading
lib/tools/                ← Pure logic for the developer tools (json, encoding, jwt, time, cron, regex)
lib/markdown.ts           ← Markdown processing (gray-matter + remark)
public/                   ← Static assets (og-image, icons, manifest)
```

## Blog (currently hidden)

`SHOW_BLOG` in `lib/site.ts` is `false`. While off: no Notes link, no home section, notes are
left out of the sitemap, RSS serves an empty feed, and `/notes` and `/notes/[id]` redirect to `/`.
Content in `content/notes/` is untouched. Set it to `true` to restore everything.

## Tools

Add a tool: create `app/tools/<slug>/page.tsx` using `ToolPage` + `toolMetadata`, put the UI in a
`'use client'` component beside it, keep the logic in `lib/tools/` (no React, so it can be tested in
plain Node), then add the tool to `tools` in `lib/site.ts` (feeds the Tools page, home page and sitemap).
Tools must run entirely in the browser and never send or store what the user enters. The only exception is a tool whose purpose is a public lookup (My IP asks ipify.org and ipwho.is): it must disclose that through ToolPage's `note` prop, send no cookies or referrer, and store nothing.

Regex Tester runs patterns in a Blob Web Worker with a timeout, so catastrophic backtracking cannot
freeze the page. The worker source lives in `lib/tools/regex.ts` as a plain JS string.

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

Modern dev-tool look: neutral surfaces, 1px hairline borders, tight corners (cards 12px, inner boxes 8px,
buttons 6px), Inter with tight tracking on headings, orange used sparingly as the accent.

**Colors come only from tokens** defined in `app/globals.css` (`:root` for light, `[data-theme="dark"]`
and a `prefers-color-scheme` block for dark) and exposed as Tailwind utilities. Never write a hex color
in a component; use the token so both themes stay correct.

| Role | Utilities |
| --- | --- |
| Surfaces | `bg-page` (app background), `bg-card`, `bg-sunken`, `bg-sunken-2` |
| Borders | `border-line`, `border-line-strong` |
| Text | `text-ink` (primary), `text-ink-2`, `text-ink-3` (muted), `text-ink-4` (decorative only) |
| Accent | `bg-brand` + `text-on-brand` (fills), `text-brand-ink` (accent text), `bg-brand-soft` + `text-brand-soft-ink` |
| Primary button / featured card | `bg-invert` + `text-on-invert` (flips in dark mode); accent text on it: `text-brand-on-invert` |
| Status | `ok-*`, `warn-*`, `danger-*` (`-bg`, `-line`, `-ink`) |
| Password strength | `--tier-1` to `--tier-5` |

Text contrast is checked against WCAG AA (4.5:1) for every text/background pair in both themes. If you
change a token, recheck the pairs. Theme: follows the OS unless the visitor picks one with the toggle;
a small inline script in `layout.tsx` applies the saved choice before first paint.

Font weights: 400 body, 500 labels and small titles, 600 headings.

## Rules

- Static export only — no server-side features (API routes, SSR, middleware). Tools run fully client-side; never send or store user input
- Light and dark themes both supported; style with tokens only (see Design System)
- Keep dependencies minimal — avoid adding new packages unless necessary
- Blog posts in English
- Accessibility: proper aria labels, reduced-motion support, semantic HTML
- Run `yarn build` before marking work as done to verify static export works

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
