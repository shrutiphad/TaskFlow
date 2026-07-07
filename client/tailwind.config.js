/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        ink: { DEFAULT: '#1A1C22', dark: '#EDEEF2' },
        canvas: { DEFAULT: '#F5F4F0', dark: '#0B0D12' },
        surface: { DEFAULT: '#FFFFFF', dark: '#151821' },
        surface2: { DEFAULT: '#FBFAF7', dark: '#1B1F2A' },
        line: { DEFAULT: '#E6E4DD', dark: '#262B38' },
        accent: { DEFAULT: '#3452D9', soft: '#E8ECFC', dark: '#8DA0FF' },
        gold: { DEFAULT: '#B08A3E', soft: '#F4ECDA', dark: '#D8B872' },
        priority: { low: '#2FA88E', medium: '#E2A93B', high: '#D9435E' },
        status: { todo: '#6B7280', progress: '#3452D9', done: '#2FA88E' },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(20,20,20,0.04), 0 8px 24px -12px rgba(20,20,20,0.10)',
        card: '0 1px 3px rgba(20,20,20,0.05), 0 12px 32px -16px rgba(20,20,20,0.14)',
        'card-dark': '0 1px 2px rgba(0,0,0,0.4), 0 16px 40px -18px rgba(0,0,0,0.6)',
        glow: '0 0 0 1px rgba(52,82,217,0.25), 0 8px 30px -8px rgba(52,82,217,0.35)',
      },
      backgroundImage: {
        'grain-light':
          'radial-gradient(circle at 12% 8%, rgba(52,82,217,0.06), transparent 40%), radial-gradient(circle at 88% 92%, rgba(176,138,62,0.07), transparent 45%)',
        'grain-dark':
          'radial-gradient(circle at 12% 8%, rgba(141,160,255,0.08), transparent 40%), radial-gradient(circle at 88% 92%, rgba(216,184,114,0.06), transparent 45%)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(8px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both',
        shimmer: 'shimmer 2.2s linear infinite',
      },
      transitionTimingFunction: {
        swift: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
