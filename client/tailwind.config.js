/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
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
        h1: ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.03em' }],
        display: ['3rem', { lineHeight: '3.1rem', letterSpacing: '-0.035em' }],
      },
      colors: {
        /* Navy ink on a cool canvas; dark mode is a deep navy, not neutral black. */
        ink: { DEFAULT: '#161A33', dark: '#E9ECFF' },
        canvas: { DEFAULT: '#E6E9F8', dark: '#080B1C' },
        /* Solid fallbacks — the frosted look comes from the .glass utilities in index.css */
        surface: { DEFAULT: '#FFFFFF', dark: '#0F1330' },
        surface2: { DEFAULT: '#F2F4FC', dark: '#141834' },
        line: { DEFAULT: '#D7DAEE', dark: '#262B48' },

        /* Navy-blue primary + a purple partner — the gradient runs navy -> purple */
        accent: { DEFAULT: '#2C40C0', soft: '#E3E6FA', dark: '#8A9BFF' },
        accent2: { DEFAULT: '#7A4FE0', dark: '#B7A6FF' },
        accent3: { DEFAULT: '#3E5AE0', dark: '#7C93FF' },

        /* One cohesive semantic family — reused for both status and priority */
        slate: { DEFAULT: '#6A71A8', soft: '#EAECF7', dark: '#A7ACDB' },
        emerald: { DEFAULT: '#12B886', soft: '#DEF6EE', dark: '#43E0AF' },
        amber: { DEFAULT: '#E08A00', soft: '#FCEFD7', dark: '#FFC24B' },
        rose: { DEFAULT: '#F0416B', soft: '#FDE4EB', dark: '#FF7A9B' },

        status: { todo: '#6A71A8', progress: '#2C40C0', done: '#12B886' },
        priority: { low: '#12B886', medium: '#E08A00', high: '#F0416B' },
      },
      boxShadow: {
        xs: '0 1px 2px rgba(20,18,52,0.05)',
        soft: '0 2px 8px -2px rgba(20,18,52,0.10), 0 8px 24px -14px rgba(20,18,52,0.18)',
        /* Frosted-glass depth: outer drop + inner top highlight */
        glass: '0 8px 32px -10px rgba(24,22,64,0.22), inset 0 1px 0 rgba(255,255,255,0.55)',
        'glass-dark': '0 12px 40px -12px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)',
        'glass-lg': '0 20px 60px -18px rgba(24,22,64,0.30), inset 0 1px 0 rgba(255,255,255,0.6)',
        'glass-lg-dark': '0 24px 70px -18px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.09)',
        /* Accent glow for primary buttons */
        glow: '0 8px 24px -6px rgba(44,64,192,0.55), inset 0 1px 0 rgba(255,255,255,0.32)',
        ring: '0 0 0 3px rgba(44,64,192,0.20)',
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(120deg, #2338B0 0%, #4340C8 48%, #7A4FE0 116%)',
        'accent-gradient-soft': 'linear-gradient(120deg, rgba(35,56,176,0.16), rgba(67,64,200,0.12), rgba(122,79,224,0.12))',
        /* Luminous mesh — navy -> indigo -> purple, the backdrop that makes glass glow */
        'mesh-light':
          'radial-gradient(at 12% 18%, rgba(43,64,199,0.30), transparent 46%), radial-gradient(at 88% 12%, rgba(122,79,224,0.22), transparent 44%), radial-gradient(at 78% 88%, rgba(62,90,224,0.20), transparent 46%), radial-gradient(at 16% 90%, rgba(80,64,190,0.16), transparent 44%)',
        'mesh-dark':
          'radial-gradient(at 12% 18%, rgba(43,64,199,0.42), transparent 50%), radial-gradient(at 88% 12%, rgba(122,79,224,0.28), transparent 48%), radial-gradient(at 78% 88%, rgba(62,90,224,0.24), transparent 50%), radial-gradient(at 16% 90%, rgba(70,58,170,0.24), transparent 48%)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(8px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        'pop-in': { '0%': { opacity: 0, transform: 'scale(0.9)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        /* Slow drift of the mesh backdrop */
        drift: {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '33%': { transform: 'translate3d(2.5%,-2%,0) scale(1.06)' },
          '66%': { transform: 'translate3d(-2%,2.5%,0) scale(1.03)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'pop-in': 'pop-in 0.3s cubic-bezier(0.16,1,0.3,1) both',
        float: 'float 5s ease-in-out infinite',
        drift: 'drift 24s ease-in-out infinite',
      },
      transitionTimingFunction: {
        swift: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
