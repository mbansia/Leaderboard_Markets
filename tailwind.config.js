/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(56,189,248,0.15), 0 8px 30px rgba(15,23,42,0.6)',
      },
    },
  },
  plugins: [],
}
