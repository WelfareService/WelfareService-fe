/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#08090F',
        'panel-dark': '#111429',
        'panel-muted': '#1b1f3a',
        'card-muted': '#1e244a',
        'accent-blue': '#4f82ff',
      },
      boxShadow: {
        glow: '0 10px 40px rgba(79, 130, 255, 0.15)',
      },
    },
  },
  plugins: [],
}
