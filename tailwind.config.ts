import type { Config } from 'tailwindcss'

// Design-Tokens identisch zum LAEMU-Frontend, damit das Team-Backend optisch
// zur Mitglieder-App passt.
const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F0F0F0',
        surface: '#FFFFFF',
        'text-primary': '#0A0A0A',
        'text-secondary': '#5A5A5A',
        'accent-gold': '#C4973A',
        'accent-warm': '#D4A84B',
        'accent-yellow': '#EDD84B',
        border: '#DCDCDC',
        'border-dark': '#B0B0B0',
        dark: '#0A0A0A',
        'dark-secondary': '#1A1A1A',
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        serif: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
