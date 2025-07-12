/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
        },
        secondary: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          950: '#2E1065',
        },
        success: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
          950: '#450A0A',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'pattern-shift': 'patternShift 20s linear infinite',
        'card-pulse': 'cardPulse 3s ease-in-out infinite',
        'circle-pulse': 'circlePulse 4s ease-in-out infinite',
        'symbol-pulse': 'symbolPulse 3s ease-in-out infinite',
        'line-fade': 'lineFade 4s ease-in-out infinite',
        'float-1': 'float 20s ease-in-out infinite',
        'float-2': 'float 23s ease-in-out infinite -2s',
        'float-3': 'float 25s ease-in-out infinite -4s',
        'float-4': 'float 22s ease-in-out infinite -6s',
        'float-5': 'float 24s ease-in-out infinite -8s',
        'float-6': 'float 21s ease-in-out infinite -10s',
        'float-7': 'float 26s ease-in-out infinite -12s',
        'float-8': 'float 28s ease-in-out infinite -14s',
        'float-9': 'float 27s ease-in-out infinite -16s',
        'float-10': 'float 29s ease-in-out infinite -18s',
        'float-11': 'float 24s ease-in-out infinite -20s',
        'float-12': 'float 26s ease-in-out infinite -22s',
        'float-13': 'float 28s ease-in-out infinite -24s',
        'float-14': 'float 25s ease-in-out infinite -26s',
        'float-15': 'float 27s ease-in-out infinite -28s',
        'float-16': 'float 29s ease-in-out infinite -30s',
        'float-17': 'float 26s ease-in-out infinite -32s',
        'float-18': 'float 28s ease-in-out infinite -34s',
        'float-19': 'float 30s ease-in-out infinite -36s',
        'float-20': 'float 32s ease-in-out infinite -38s',
        'draw': 'draw 30s linear infinite',
        meteor: "meteor 5s linear infinite",
        'scroll': 'scroll 20s linear infinite',
        'marquee': 'marquee var(--duration) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { 
            transform: 'translate(0, 0) rotate(0deg) scale(1)' 
          },
          '33%': { 
            transform: 'translate(15px, 15px) rotate(2deg) scale(1.02)' 
          },
          '66%': { 
            transform: 'translate(-10px, 20px) rotate(-1deg) scale(0.98)' 
          }
        },
        patternShift: {
          '0%': { transform: 'translateX(0) translateY(0)' },
          '25%': { transform: 'translateX(10px) translateY(-10px)' },
          '50%': { transform: 'translateX(0) translateY(0)' },
          '75%': { transform: 'translateX(-10px) translateY(10px)' },
          '100%': { transform: 'translateX(0) translateY(0)' }
        },
        cardPulse: {
          '0%, 100%': { 
            transform: 'scale(1) rotate(0deg)',
            opacity: '0.8'
          },
          '50%': { 
            transform: 'scale(1.05) rotate(1deg)',
            opacity: '1'
          }
        },
        circlePulse: {
          '0%, 100%': { 
            transform: 'scale(1)',
            opacity: '0.6'
          },
          '50%': { 
            transform: 'scale(1.1)',
            opacity: '0.8'
          }
        },
        symbolPulse: {
          '0%, 100%': { 
            transform: 'scale(1) rotate(0deg)',
            opacity: '0.7'
          },
          '50%': { 
            transform: 'scale(1.1) rotate(5deg)',
            opacity: '0.9'
          }
        },
        lineFade: {
          '0%, 100%': { 
            opacity: '0.3',
            strokeDashoffset: '0'
          },
          '50%': { 
            opacity: '0.7',
            strokeDashoffset: '100'
          }
        },
        draw: {
          '0%': { 
            strokeDashoffset: '1000',
            opacity: '0.2'
          },
          '50%': { 
            opacity: '0.5'
          },
          '100%': { 
            strokeDashoffset: '0',
            opacity: '0.2'
          }
        },
        meteor: {
          "0%": { transform: "rotate(var(--angle)) translateX(0)", opacity: 1 },
          "70%": { opacity: 1 },
          "100%": { transform: "rotate(var(--angle)) translateX(1500px)", opacity: 0 }
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        marquee: {
          from: { transform: 'translateX(0%)' },
          to: { transform: 'translateX(-100%)' }
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0%)' },
          to: { transform: 'translateY(-100%)' }
        }
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.05)',
        'elevated': '0 8px 20px rgba(0, 0, 0, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};