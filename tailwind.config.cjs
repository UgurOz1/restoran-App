/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem',
      },
      colors: {
        primary: {
          DEFAULT: '#111827',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
      },
      boxShadow: {
        card: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)'
      }
    },
  },
  plugins: [require('tailwindcss-animate')],
}
