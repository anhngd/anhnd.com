import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF5F00',
          light: '#FF7F33',
          dark: '#FF7F33',
        },
        secondary: {
          DEFAULT: '#EB001B',
          dark: '#FF3333',
        },
        text: {
          DEFAULT: '#1a1a1a',
          light: '#1a1a1a',
          dark: '#f3f4f6',
          secondary: '#4b5563',
          'secondary-dark': '#9ca3af',
        },
        bg: {
          DEFAULT: '#ffffff',
          light: '#ffffff',
          dark: '#0f172a',
          section: '#f8f9fa',
          'section-dark': '#1e293b',
        },
      },
      fontFamily: {
        playfair: ['var(--font-playfair)'],
        cormorant: ['var(--font-cormorant)'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.1' },
          '50%': { opacity: '0.2' },
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        blink: {
          '50%': { borderColor: 'transparent' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
        'typing': 'typing 1.2s steps(20, end)',
        'blink': 'blink 0.8s step-end infinite',
      },
      screens: {
        'xs': '480px',
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true, // Chỉ kích hoạt hover trên các thiết bị hỗ trợ
  },
}
export default config