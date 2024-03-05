/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        131: '1fr 3fr 1fr',
      },
      borderWidth: {
        1: '1px',
      },
      fontSize: {
        '2xs': ['12px', '16px'],
      },
      boxShadow: {
        x: '0px 0px 16px 1px rgba(0,0,0,0.45)',
      },
      colors: {
        'ebony-clay': {
          50: '#f5f6f9',
          100: '#e7e9f2',
          200: '#d5d9e8',
          300: '#b8c0d8',
          400: '#95a0c5',
          500: '#7c85b5',
          600: '#6a6fa6',
          700: '#5e6097',
          800: '#50517d',
          900: '#434465',
          950: '#282839',
        },
        'shuttle-gray': {
          50: '#f5f6f6',
          100: '#e4e6e9',
          200: '#ccd1d5',
          300: '#a9b1b7',
          400: '#7e8892',
          500: '#636d77',
          600: '#5a626c',
          700: '#494f55',
          800: '#40434a',
          900: '#393b40',
          950: '#232529',
        },
        wire: {
          50: '#616F8E',
          100: '#5D6A88',
          200: '#535E79',
          300: '#465067',
          400: '#3C4458',
          500: '#323949',
          600: '#272D3A',
          700: '#1D212A',
          800: '#15181E',
          900: '#0A0C0F',
          950: '#040506',
        },
      },
    },
  },
  plugins: [],
};
