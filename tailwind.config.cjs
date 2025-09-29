/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'shadow-green': {
          50: '#f1fcfc',
          100: '#e0f6f4',
          200: '#9BC4C1',
          300: '#9ee2dd',
          400: '#75ccc7',
          500: '#64b3ae',
          600: '#4d908d',
          700: '#3f7471',
          800: '#345e5b',
          900: '#2f4e4c',
          950: '#1a3332',
        },
        'dove-gray': {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a1a1a1',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
      },
    },
  },
  plugins: [],
};