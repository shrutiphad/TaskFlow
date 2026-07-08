/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        micro: ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.04em' }],
        label: ['0.75rem', { lineHeight: '1.1rem', letterSpacing: '0.01em' }],
        body: ['0.875rem', { lineHeight: '1.5rem' }],
        lede: ['1rem', { lineHeight: '1.6rem' }],
        h4: ['1.125rem', { lineHeight: '1.4rem', letterSpacing: '-0.01em' }],
        h3: ['1.375rem', { lineHeight: '1.7rem', letterSpacing: '-0.015em' }],
        h2: ['1.75rem', { lineHeight: '2.1rem', letterSpacing: '-0.02em' }],
        h1: ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.025em' }],
        display: ['3rem', { lineHeight: '3.2rem', letterSpacing: '-0.03em' }],
      },
      colors: {
        ink: { DEFAULT: '#20211F', dark: '#EBEAE6' },
        canvas: { DEFAULT: '#F6F5F1', dark: '#111311' },
        surface: { DEFAULT: '#FFFFFF', dark: '#181A18' },
        surface2: { DEFAULT: '#FAF9F5', dark: '#1E211E' },
        line: { DEFAULT: '#E5E3DB', dark: '#2B2E2A' },

        accent: { DEFAULT: '#4F46E5', soft: '#ECEBFC', dark: '#A5A1FF' },

        /* one shared semantic family — reused for both status and priority */
        slate: { DEFAULT: '#64748B', soft: '#EEF1F4', dark: '#94A3B8' },
        emerald: { DEFAULT: '#0D9270', soft: '#E4F5EF', dark: '#4FCBA5' },
        amber: { DEFAULT: '#B4740E', soft: '#FBF0DD', dark: '#E3AC52' },
        rose: { DEFAULT: '#C4324B', soft: '#FBE9EC', dark: '#F0879A' },

        status: { todo: '#64748B', progress: '#4F46E5', done: '#0D9270' },
        priority: { low: '#0D9270', medium: '#B4740E', high: '#C4324B' },
      },
      boxShadow: {
        xs: '0 1px 2px rgba(20,20,16,0.04)',
        soft: '0 1px 2px rgba(20,20,16,0.04), 0 6px 18px -10px rgba(20,20,16,0.10)',
        card: '0 1px 2px rgba(20,20,16,0.05), 0 16px 36px -18px rgba(20,20,16,0.16)',
        'card-dark': '0 1px 2px rgba(0,0,0,0.5), 0 18px 40px -18px rgba(0,0,0,0.65)',
        glow: '0 0 0 1px rgba(79,70,229,0.22), 0 8px 26px -8px rgba(79,70,229,0.32)',
        ring: '0 0 0 3px rgba(79,70,229,0.14)',
      },
      backgroundImage: {
        'grain-light':
          'radial-gradient(circle at 10% 6%, rgba(79,70,229,0.05), transparent 38%), radial-gradient(circle at 90% 94%, rgba(180,116,14,0.05), transparent 42%)',
        'grain-dark':
          'radial-gradient(circle at 10% 6%, rgba(165,161,255,0.07), transparent 38%), radial-gradient(circle at 90% 94%, rgba(227,172,82,0.05), transparent 42%)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(8px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        'pop-in': { '0%': { opacity: 0, transform: 'scale(0.9)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'pop-in': 'pop-in 0.3s cubic-bezier(0.16,1,0.3,1) both',
        float: 'float 5s ease-in-out infinite',
      },
      transitionTimingFunction: {
        swift: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
