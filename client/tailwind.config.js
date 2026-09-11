/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0b1220',
          soft: '#1a2436',
        },
        slate: {
          vignak: '#3d4a5c',
        },
        muted: '#6b7789',
        line: {
          DEFAULT: '#d8dee8',
          soft: '#e8edf4',
        },
        surface: {
          DEFAULT: '#f5f7fb',
          elevated: '#ffffff',
        },
        accent: {
          DEFAULT: '#0f6e56',
          hover: '#0b5844',
          soft: '#e6f4ef',
          mist: '#9fd9c5',
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
        soft: '0 1px 2px rgba(11, 18, 32, 0.06)',
        card: '0 8px 24px rgba(11, 18, 32, 0.08)',
        lift: '0 20px 48px rgba(11, 18, 32, 0.12)',
      },
      backgroundImage: {
        'hero-wash':
          'linear-gradient(180deg, rgba(11,18,32,0.35) 0%, rgba(11,18,32,0.72) 48%, rgba(11,18,32,0.92) 100%)',
        'accent-panel':
          'linear-gradient(160deg, rgba(15,110,86,0.12), rgba(11,18,32,0.03))',
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
