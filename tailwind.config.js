/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: '#8B5CF6',
        secondary: '#A78BFA',
        accent: '#DDD6FE',
        dark: '#4C1D95',
        light: '#F5F3FF',
      },
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'floatSlow 4s ease-in-out infinite',
        'float-delayed': 'floatDelayed 3.5s ease-in-out infinite 0.5s',
        'float-gentle': 'floatGentle 5s ease-in-out infinite 1s',
        'pulse-subtle': 'pulseShadow 3s ease-in-out infinite',
        'badge-pulse': 'badgePulse 2s ease-in-out infinite',
        'icon-bounce': 'iconBounce 0.6s ease',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        },
        floatDelayed: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-15px) scale(1.02)' },
        },
        floatGentle: {
          '0%, 100%': { transform: 'translateX(0px) translateY(0px)' },
          '25%': { transform: 'translateX(5px) translateY(-5px)' },
          '75%': { transform: 'translateX(-5px) translateY(5px)' },
        },
        pulseShadow: {
          '0%, 100%': { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
          '50%': { boxShadow: '0 20px 25px -5px rgba(139, 92, 246, 0.15)' },
        },
        badgePulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(139, 92, 246, 0.4)', transform: 'scale(1)' },
          '50%': { boxShadow: '0 0 20px 5px rgba(139, 92, 246, 0.3)', transform: 'scale(1.02)' },
        },
        iconBounce: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '25%': { transform: 'scale(1.2) rotate(-10deg)' },
          '50%': { transform: 'scale(1.1) rotate(10deg)' },
          '75%': { transform: 'scale(1.15) rotate(-5deg)' },
        }
      }
    },
  },
  plugins: [],
}
