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

export const tools = [
  {
    href: '/tools/password-generator',
    name: 'Password Generator',
    description:
      'Pick a platform and get a password that follows its rules, graded from Weak to Very strong.',
  },
] as const
