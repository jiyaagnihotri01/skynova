/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ba: {
          navy: '#00205B',
          darknavy: '#0A192F',
          red: '#EB2226',
          darkred: '#C8102E',
          sky: '#0EA5E9',
          slate: '#F8FAFC',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 20px 40px -15px rgba(0, 32, 91, 0.07), 0 0 15px 0 rgba(0, 0, 0, 0.03)',
        'glass-hover': '0 25px 50px -12px rgba(235, 34, 38, 0.12), 0 0 20px 0 rgba(0, 32, 91, 0.08)',
      }
    },
  },
  plugins: [],
}
