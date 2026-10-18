/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./popup/index.html",
    "./popup/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nexora: {
          dark: '#0B0F19',
          card: '#111827',
          border: '#1F2937',
        },
      },
    },
  },
  plugins: [],
}