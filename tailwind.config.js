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
        xxs: ['12px', '16px'],
      },
    },
  },
  plugins: [],
};
