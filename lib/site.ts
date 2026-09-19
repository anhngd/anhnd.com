export const SITE = {
  name: 'Anh Nguyen',
  url: 'https://anhnd.com',
  email: 'me@anhnd.com',
  github: 'https://github.com/anhnd',
  role: 'Technical Manager & Solo Founder',
  intro:
    'Technical Manager and solo founder based in Vietnam. I build products, lead small teams, and think a lot about how small teams can do big things.',
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
    description: 'Turning ideas into products, and small teams into ones that punch above their weight.',
  },
] as const

export const facts = [
  { value: '15+', label: 'Years of experience' },
  { value: 'Gaming · GovTech · Enterprise', label: 'Industries' },
  { value: 'MSc. Applied Math', label: 'HUST, Hanoi' },
  { value: 'Vietnam', label: 'Based in' },
] as const

export const education = [
  { degree: 'MSc. Applied Mathematics', school: 'HUST, Hanoi' },
  { degree: 'Engineer, Applied Mathematics and Informatics', school: 'HUST, Hanoi' },
] as const

export type ToolCategory = 'Security' | 'Developer'

export interface ToolInfo {
  href: string
  name: string
  description: string
  category: ToolCategory
  /** Shown as the large card on the home page. */
  featured?: boolean
}

export const toolCategories: ToolCategory[] = ['Security', 'Developer']

export const tools: readonly ToolInfo[] = [
  {
    href: '/tools/password-generator',
    name: '1Click Password Generation',
    description:
      'Pick a platform, get a password that follows its rules — graded from Weak to Very strong, copied in one click.',
    category: 'Security',
    featured: true,
  },
  {
    href: '/tools/json',
    name: 'JSON Formatter & Diff',
    description: 'Validate, pretty-print or minify JSON with exact error locations, and compare two documents.',
    category: 'Developer',
  },
  {
    href: '/tools/base64-url',
    name: 'Base64 & URL Encoder',
    description: 'Encode and decode Base64 (with a URL-safe mode) and percent-encoded URLs. Safe for any language.',
    category: 'Developer',
  },
  {
    href: '/tools/jwt-decoder',
    name: 'JWT Decoder',
    description: 'Inspect a token’s header, payload and expiry. Decoded locally, never uploaded.',
    category: 'Security',
  },
  {
    href: '/tools/timestamp',
    name: 'Unix Timestamp Converter',
    description: 'Turn epoch seconds or milliseconds into dates in any time zone, and dates back into timestamps.',
    category: 'Developer',
  },
  {
    href: '/tools/regex-tester',
    name: 'Regex Tester',
    description: 'Test JavaScript regular expressions with live highlighting, capture groups and a replace preview.',
    category: 'Developer',
  },
  {
    href: '/tools/cron-explainer',
    name: 'Cron Explainer',
    description: 'Turn a cron expression into plain English and see exactly when it will run next.',
    category: 'Developer',
  },
]
