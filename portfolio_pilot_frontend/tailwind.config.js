/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dashboard: {
          main: '#0a0e17',      //  first background
          card: '#151a21',      // Cards background
          accent: '#3b82f6',   
          purple: '#8b5cf6',   
          text: '#e2e8f0',      // Primary text
          muted: '#64748b'      // Secondary text
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif', 'Arial'],
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' }, // Moves half because we duplicated the list
        },
      }
    },
  },
  plugins: [],
}