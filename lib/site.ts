export const SITE = {
  name: 'Anh Nguyen',
  url: 'https://anhnd.com',
  email: 'me@anhnd.com',
  github: 'https://github.com/anhnd',
  /** Personal dashboard on a subdomain; linked from the footer. */
  my: 'https://my.anhnd.com',
  intro: 'I build products, lead lean teams, and turn ambitious ideas into meaningful impact.',
} as const

// The blog is hidden. Flip to true to bring Notes back: nav link, home section,
// sitemap, RSS and the /notes routes (which otherwise redirect to the home page).
// No content is deleted — posts stay in content/notes/.
export const SHOW_BLOG = false

export const focusAreas = [
  {
    title: 'Big Data & AI Engineering',
    description: 'Data platforms and machine-learning systems that turn raw data into decisions.',
  },
  {
    title: 'Full-stack Development',
    description: 'From mobile apps to web platforms, built and shipped end to end.',
  },
  {
    title: 'Digital Transformation',
    description: 'Modernizing how organizations build, operate, and deliver software.',
  },
  {
    title: 'Product & Team Building',
    description: 'Turning ideas into products, and lean teams into ones that punch above their weight.',
  },
] as const

export const facts = [
  { label: 'Experience', value: '15+ years' },
  { label: 'Industries', value: 'Gaming · GovTech · Enterprise' },
  { label: 'Education', value: 'MSc. Applied Math, HUST' },
  { label: 'Based in', value: 'Hanoi, Vietnam' },
] as const

export const education = [
  { degree: 'MSc. Applied Mathematics', school: 'HUST, Hanoi' },
  { degree: 'Engineer, Applied Mathematics and Informatics', school: 'HUST, Hanoi' },
] as const

export type ToolCategory = 'Security' | 'Network' | 'Developer'

/** Gradient used by the app icon; the palette lives in app/globals.css. */
export type Tint = 'orange' | 'blue' | 'violet' | 'teal' | 'pink' | 'green' | 'indigo' | 'amber'

export interface ToolInfo {
  href: string
  name: string
  /** Two words at most — the label under the icon on a tile. */
  short: string
  description: string
  category: ToolCategory
  /** Glyph drawn inside the app icon; see app/components/ToolIcon.tsx. */
  icon: string
  tint: Tint
  /** Shown as the large card on the home page. */
  featured?: boolean
}

export const toolCategories: ToolCategory[] = ['Security', 'Network', 'Developer']

export const tools: readonly ToolInfo[] = [
  {
    href: '/tools/password-generator',
    name: '1Click Password Generation',
    short: '1Click Password',
    description:
      'Pick a platform, get a password that follows its rules — graded from Weak to Very strong, copied in one click.',
    category: 'Security',
    icon: 'key',
    tint: 'orange',
    featured: true,
  },
  {
    href: '/tools/json',
    name: 'JSON Formatter & Diff',
    short: 'JSON',
    description: 'Validate, pretty-print or minify JSON with exact error locations, and compare two documents.',
    category: 'Developer',
    icon: 'braces',
    tint: 'blue',
  },
  {
    href: '/tools/base64-url',
    name: 'Base64 & URL Encoder',
    short: 'Base64 & URL',
    description: 'Encode and decode Base64 (with a URL-safe mode) and percent-encoded URLs. Safe for any language.',
    category: 'Developer',
    icon: 'swap',
    tint: 'violet',
  },
  {
    href: '/tools/my-ip',
    name: 'My IP',
    short: 'My IP',
    description: 'See your public IPv4 and IPv6 address, approximate location, ISP and browser details — or look up any IP.',
    category: 'Network',
    icon: 'globe',
    tint: 'teal',
  },
  {
    href: '/tools/jwt-decoder',
    name: 'JWT Decoder',
    short: 'JWT',
    description: 'Inspect a token’s header, payload and expiry. Decoded locally, never uploaded.',
    category: 'Security',
    icon: 'badge',
    tint: 'pink',
  },
  {
    href: '/tools/timestamp',
    name: 'Unix Timestamp Converter',
    short: 'Timestamp',
    description: 'Turn epoch seconds or milliseconds into dates in any time zone, and dates back into timestamps.',
    category: 'Developer',
    icon: 'clock',
    tint: 'green',
  },
  {
    href: '/tools/regex-tester',
    name: 'Regex Tester',
    short: 'Regex',
    description: 'Test JavaScript regular expressions with live highlighting, capture groups and a replace preview.',
    category: 'Developer',
    icon: 'regex',
    tint: 'indigo',
  },
  {
    href: '/tools/cron-explainer',
    name: 'Cron Explainer',
    short: 'Cron',
    description: 'Turn a cron expression into plain English and see exactly when it will run next.',
    category: 'Developer',
    icon: 'calendar',
    tint: 'amber',
  },
]
