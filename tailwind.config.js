/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-maroon': '#F76C6C',
        'dark-maroon': '#24305E',
        'off-white': '#FAF0E6',
        'dark-maroonn': '#374785',
        'yellowish': '#A8D0E6',
        'blackishbg': '#111827',
        'blackishbginside':'#1F2937',
      },
      animation: {
        'fade-in-out': 'fadeInOut 2s ease-in-out',
        'scale-in': 'scaleIn 0.5s ease-out',
      },
      keyframes: {
        fadeInOut: {
          '0%, 100%': { opacity: 0 },
          '50%': { opacity: 1 },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
    },
  },
  },
  plugins: [],
}