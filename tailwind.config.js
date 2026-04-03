/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Headings: editorial, confident
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        // Body: clean, modern, highly legible
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        // Monospace: dates, counts
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        // True neutral — no warm/cool bias, just crisp grays
        g: {
          0:   '#ffffff',
          50:  '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d1d1d6',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
        // Single accent — confident indigo, not too bright
        indigo: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
      },
      boxShadow: {
        'card':       '0 1px 2px rgba(0,0,0,0.05)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.08)',
        'modal':      '0 24px 64px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.06)',
        'ring':       '0 0 0 3px rgba(99,102,241,0.15)',
      },
      animation: {
        'fade-in':  'fadeIn 0.18s ease-out',
        'slide-up': 'slideUp 0.22s cubic-bezier(0.16,1,0.3,1)',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' },                              to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      letterSpacing: {
        tight2: '-0.03em',
      },
    },
  },
  plugins: [],
}
