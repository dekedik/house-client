/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8ebef',
          100: '#c5ced9',
          200: '#9fafbf',
          300: '#798fa5',
          400: '#5c7791',
          500: '#3f5f7d',
          600: '#1f3145',
          700: '#1a2838',
          800: '#151f2b',
          900: '#0f1520',
        },
        accent: {
          50: '#f9f7f3',
          100: '#f2ede4',
          200: '#e4d9c8',
          300: '#d1c0a6',
          400: '#b8a177',
          500: '#a68f5f',
          600: '#8b7549',
          700: '#6b5a38',
          800: '#4a3e26',
          900: '#2a2315',
        },
      },
    },
  },
  plugins: [],
}



