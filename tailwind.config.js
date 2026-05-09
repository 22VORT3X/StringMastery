/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter_400Regular', 'sans-serif'],
        serif: ['PlayfairDisplay_700Bold', 'serif'],
        'serif-medium': ['PlayfairDisplay_500Medium', 'serif'],
      },
      colors: {
        cream: {
          50: '#fdfaf5',
          100: '#f9f3e8',
          200: '#f2e6d0',
        },
        mahogany: {
          50: '#fdf4f0',
          100: '#fae3d8',
          200: '#f4c4a8',
          300: '#e89a72',
          400: '#d97245',
          500: '#c4522a',
          600: '#a63e1f',
          700: '#872f18',
          800: '#6b2414',
          900: '#521b0f',
        },
        forest: {
          50: '#f0f7f3',
          100: '#d8ede1',
          200: '#afd8be',
          300: '#7dbd98',
          400: '#52a073',
          500: '#348256',
          600: '#266843',
          700: '#1d5034',
        },
        gold: {
          50: '#fdfaeb',
          100: '#faf2c7',
          200: '#f5e48f',
          300: '#edd151',
          400: '#e3bc25',
          500: '#c9a118',
          600: '#a37e12',
          700: '#7d5e10',
        },
      },
    },
  },
  plugins: [],
};
