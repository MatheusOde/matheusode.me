/** Identity from the existing repository; publication checks live in planning/. */
export const site = {
  name: 'Matheus Odebrecht',
  url: 'https://matheusode.me',
  role: 'Full-stack software engineer',
  headline: 'I build full-stack applications and integrations for complex business needs.',
  description: 'Connecting applications, data, and operations through systems integration—with business needs at the center.',
  email: 'matheusode@gmail.com',
  linkedin: 'https://www.linkedin.com/in/matheus-odebrecht',
  github: 'https://github.com/MatheusOde',
  resume: null as string | null,
  socialImage: '/images/og/default.png',
  analytics: { enabled: false },
} as const;

export const navigation = [
  { href: '/#home', section: 'home', label: 'Home', icon: '⌂' },
  { href: '/#work', section: 'work', label: 'Work', icon: '▧' },
  { href: '/#writing', section: 'writing', label: 'Writing', icon: '≡' },
  { href: '/#about', section: 'about', label: 'About', icon: '◉' },
  { href: '/#contact', section: 'contact', label: 'Contact', icon: '↗' },
] as const;
