/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f9',
          100: '#d9f2f2',
          200: '#b3e6e6',
          300: '#8cd9d9',
          400: '#66cdcd',
          500: '#40c0c0',
          600: '#339999',
          700: '#267373',
          800: '#1a4d4d',
          900: '#0d2626'
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12'
        },
        normal: '#9ABD7A',
        warning: '#F1E451',
        alert: '#E1BB60',
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif']
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        slideIn: 'slideIn 0.5s ease-out forwards',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        delayedPingIntense: 'delayedPingIntense 2s ease-in-out infinite',
        delayedPingMedium: 'delayedPingMedium 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' }
        },
        delayedPingMedium: {
          '0%': {
            transform: 'scale(1)',
            opacity: '1',
          },
          '75%': {
            transform: 'scale(1.5)',
            opacity: '0.5',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          }
        },
        delayedPingIntense: {
          '0%': {
            transform: 'scale(1)',
            opacity: '1',
          },
          '75%': {
            transform: 'scale(2)',
            opacity: '0.5',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          }
        }
      },
      backdropBlur: {
        xs: '2px'
      }
    },
  },
  plugins: [],
};
