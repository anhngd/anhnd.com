# anhnd.com — Personal Website

## Project Overview

Personal website and blog for Anh Nguyen (anhnd.com). Static site built with Next.js, deployed as static export.

## Tech Stack

- **Framework:** Next.js 16 (App Router, static export) with React 19
- **Styling:** Tailwind CSS 4 driven by design tokens in `app/globals.css` (light + dark themes)
- **Content:** Markdown files in `content/notes/` with gray-matter frontmatter
- **Fonts:** Google Sans (UI) and Google Sans Code (code, passwords), via next/font, with the Vietnamese subset
- **Package manager:** Yarn 4.9

TypeScript stays on 6.x: TypeScript 7 is outside the range typescript-eslint accepts
(`>=4.8.4 <6.1.0`) and Yarn's builtin TS patch cannot apply to it yet.

## Project Structure

```
app/
├── page.tsx              ← Home: the whole personal site (masthead, profile, background,
│                         what I do, education, contact). There is no /about page.
├── layout.tsx            ← Root layout, metadata, fonts
├── globals.css           ← Global styles, CSS variables
├── not-found.tsx         ← 404 page
├── components/
│   ├── Nav.tsx           ← Quiet top bar: name + theme switch (Notes only when SHOW_BLOG)
│   ├── Footer.tsx        ← Shared footer; the only link to the tools lives here
│   ├── Section.tsx       ← The page rhythm: hairline rule, numbered label in the left margin
│   ├── ToolIcon.tsx      ← macOS-style gradient app icon (glyph + data-tint)
│   ├── FadeIn.tsx        ← Fade-in-on-scroll wrapper (client); content stays visible without JS
│   ├── ThemeToggle.tsx   ← System / Light / Dark switch (saved in localStorage 'theme')
│   ├── tools/            ← Shared tool building blocks: ToolPage (macOS window shell + metadata),
│   │                        ui.tsx (CopyButton, Segmented, Notice), toolStyles.ts, useNow.ts
│   └── StructuredData.tsx← JSON-LD for SEO
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
scripts/og-image.html     ← Source of public/og-image.png; re-render it with headless Chrome
```

## Blog (currently hidden)

`SHOW_BLOG` in `lib/site.ts` is `false`. While off: no Notes link, no home section, notes are
left out of the sitemap, RSS serves an empty feed, and `/notes` and `/notes/[id]` redirect to `/`.
Content in `content/notes/` is untouched. Set it to `true` to restore everything.

## Tools

Add a tool: create `app/tools/<slug>/page.tsx` using `ToolPage` + `toolMetadata`, put the UI in a
`'use client'` component beside it, keep the logic in `lib/tools/` (no React, so it can be tested in
plain Node), then add the tool to `tools` in `lib/site.ts` with a `short` label, an `icon` glyph (see
`app/components/ToolIcon.tsx`) and a `tint` (feeds the Tools page, home page, window header and sitemap).
`ToolPage` renders the tool as a macOS window: traffic lights and the name in the title bar, the icon,
heading and tagline in the toolbar, the tool in the content area, and the privacy note in the status bar.
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

Minimal and professional for the site; macOS for the tools. The site pages carry little content, so
they lean on typography, whitespace and hairline rules rather than cards: near-white surfaces, a very
soft color wash (`.aurora`) behind hero sections, definition lists split into two columns, orange used
only for links and accents. The tools keep the window chrome: generous corners (windows 14px, fields
and buttons 8–10px), soft layered shadows, gradient app icons.

The home page is the whole personal site — a type-only masthead (no photo), then numbered sections
(`Section`) whose labels sit in the left margin. Tools are not advertised there: the single entry
point is the small `Tools` link in the footer (and `/tools` itself). Keep the chrome and the content
on the same grid: page padding goes *outside* the measured `max-w-4xl` column, exactly as `Section`
does it, otherwise the nav and footer drift away from the text.

**Colors come only from tokens** defined in `app/globals.css` (`:root` for light, `[data-theme="dark"]`
and a `prefers-color-scheme` block for dark) and exposed as Tailwind utilities. Never write a hex color
in a component; use the token so both themes stay correct. The gradient app-icon palette
(`[data-tint="…"]`) lives in the same file and is the one place raw gradient colors are allowed.

| Role | Utilities / tokens |
| --- | --- |
| Surfaces | `bg-page` (app background), `bg-card`, `bg-sunken`, `bg-sunken-2`, `bg-win` (window content) |
| Borders | `border-line`, `border-line-strong`, `border-chrome-line` |
| Text | `text-ink` (primary), `text-ink-2`, `text-ink-3` (muted), `text-ink-4` (decorative only) |
| Accent | `bg-brand` + `text-on-brand` (fills), `text-brand-ink` (accent text), `bg-brand-soft` + `text-brand-soft-ink` |
| Inverted surface | `bg-invert` + `text-on-invert`; accent text on it: `text-brand-on-invert` |
| Status | `ok-*`, `warn-*`, `danger-*` (`-bg`, `-line`, `-ink`) |
| Password strength | `--tier-1` to `--tier-5` |
| Depth | `--shadow-card`, `--shadow-lift`, `--shadow-window`, `--shadow-control` |

Component classes (Tailwind `components` layer, so utilities still override them):

| Class | Use |
| --- | --- |
| `.soft-card`, `.soft-card-hover` | The standard white card, and its lift-on-hover variant |
| `.glass-bar` | Translucent blurred bar (the nav capsule) |
| `.mac-window`, `.mac-titlebar`, `.mac-statusbar`, `.traffic-light` | The window shell used by every tool |
| `.mac-field`, `.mac-push`, `.mac-primary`, `.mac-segment` (+ `.mac-segment-item`) | macOS controls; `app/components/tools/toolStyles.ts` wraps them for the tools |
| `.icon-tile` + `data-tint` | Gradient app icon (via `ToolIcon`) |
| `.aurora` (+ `.aurora-3`) | The soft, masked background wash behind hero sections |

Text contrast is checked against WCAG AA (4.5:1) for every text/background pair in both themes. If you
change a token, recheck the pairs. Theme: **light by default**, whatever the OS says; dark applies only
when the visitor picks it with the toggle, which sets `data-theme="dark"` and stores `theme=dark`. A
small inline script in `layout.tsx` applies that choice before first paint.

Font weights: 400 body, 500 labels and small titles, 600 headings. Google Sans is used for everything,
including article prose; Google Sans Code for code, passwords and other monospace values.

## SEO

The home page is a personal profile, and the markup says so: `ProfilePage` wraps the `Person`
(`#person`), `WebSite` points at the same node, and Open Graph uses `type: profile`. The `Person`
node carries image, email, address, `alumniOf` and `knowsAbout` (generated from `focusAreas`), so
keep it in step when that copy changes. Tool pages add `WebApplication` + `BreadcrumbList`.

Things that are easy to break, so check them after touching metadata:

- `trailingSlash: true`, so every canonical and every sitemap URL ends with `/`. They must match.
- The canonical lives on each page, never in the root layout — a root canonical is inherited by
  `/status` and the 404 page and tells Google they are the home page.
- Every page needs its own `openGraph.images`: a page that sets `openGraph` replaces the root's,
  image included. `toolMetadata()` handles this for the tools.
- `/status`, the 404 page and (while `SHOW_BLOG` is false) `/notes` are `noindex`.
- `public/og-image.png` is generated from `scripts/og-image.html`; regenerate it when the headline
  copy changes, and keep `public/site.webmanifest` in step with the site name and theme color.

## Rules

- Static export only — no server-side features (API routes, SSR, middleware). Tools run fully client-side; never send or store user input
- Google Sans everywhere (UI and prose), Google Sans Code for monospace — no other font families
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
