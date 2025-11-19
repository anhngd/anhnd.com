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
          DEFAULT: '#FF7700', // Orange
          light: '#FF9E45',
        },
        secondary: {
          DEFAULT: '#FF9E45', // Lighter orange
        },
        text: {
          DEFAULT: '#000000', // Black
          secondary: '#666666', // Gray
        },
        bg: {
          DEFAULT: '#ffffff', // White
          section: '#f4f4f4', // Light gray
        },
        gray: {
          DEFAULT: '#666666', // Medium gray
          light: '#CCCCCC', // Light gray
          dark: '#333333', // Dark gray
        },
      },
      fontFamily: {
        jakarta: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'sans-serif'],
        sans: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'sans-serif'],
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