/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0B0F19',
          soft: '#1E293B',
        },
        slate: {
          vignak: '#334155',
        },
        muted: '#64748B',
        line: {
          DEFAULT: '#E2E8F0',
          soft: '#F1F5F9',
        },
        surface: {
          DEFAULT: '#F8FAFC',
          elevated: '#ffffff',
        },
        accent: {
          DEFAULT: '#4F46E5',
          hover: '#4338CA',
          soft: '#EEF2FF',
          mist: '#A5B4FC',
          cyan: '#06B6D4',
          cyanSoft: '#CFFAFE',
        },
        warn: '#9a6700',
        danger: {
          DEFAULT: '#b42318',
          soft: '#fef3f2',
        },
        success: '#027a48',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'Segoe UI', 'sans-serif'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      maxWidth: {
        container: '1120px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(11, 15, 25, 0.06)',
        card: '0 8px 24px rgba(79, 70, 229, 0.08)',
        lift: '0 20px 48px rgba(11, 15, 25, 0.12)',
      },
      backgroundImage: {
        'hero-wash':
          'linear-gradient(180deg, rgba(11,15,25,0.35) 0%, rgba(11,15,25,0.72) 48%, rgba(79,70,229,0.55) 100%)',
        'accent-panel':
          'linear-gradient(160deg, rgba(79,70,229,0.12), rgba(6,182,212,0.08))',
      },
      keyframes: {
        riseIn: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        rise: 'riseIn 0.65s ease both',
      },
    },
  },
  plugins: [],
};
