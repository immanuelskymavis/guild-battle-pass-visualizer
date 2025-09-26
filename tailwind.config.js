/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'axie-primary': '#4A90E2',
        'axie-secondary': '#7ED321',
        'axie-accent': '#9013FE',
        'axie-dark': '#1e2139',
        'axie-navy': '#252746',
      },
      fontFamily: {
        'game': ['Orbitron', 'monospace'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-glow': 'pulse-glow 1.5s ease-in-out infinite alternate',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        'pulse-glow': {
          from: { opacity: 0.5, transform: 'scale(1)' },
          to: { opacity: 1, transform: 'scale(1.05)' }
        },
        'shake': {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        }
      }
    },
  },
  plugins: [],
}