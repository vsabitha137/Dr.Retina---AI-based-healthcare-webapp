/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        retina: {
          blue: '#0284c7',
          cyan: '#06b6d4',
          teal: '#0d9488',
          emerald: '#059669',
          amber: '#d97706',
          rose: '#e11d48',
          slate: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
        'card': '0 10px 30px -5px rgba(13, 148, 136, 0.06), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 25px -5px rgba(20, 184, 166, 0.3)',
      }
    },
  },
  plugins: [],
}
