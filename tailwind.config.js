/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0B0D',
        surface: '#15171A',
        border: 'rgba(255,255,255,0.08)',
        accent: {
          DEFAULT: '#C5F94B',
          dim: '#9BD13A',
        },
        text: {
          DEFAULT: '#FFFFFF',
          muted: '#8A8F98',
        },
        danger: '#FF4D6D',
        // Territory relation colors
        owned: '#C5F94B',
        enemy: '#FF4D6D',
        neutral: '#6B7280',
        friend: '#3BA7FF',
      },
      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        glow: '0 0 24px rgba(197,249,75,0.18)',
        card: '0 8px 32px rgba(0,0,0,0.4)',
      },
      backdropBlur: {
        glass: '12px',
      },
    },
  },
  plugins: [],
};
