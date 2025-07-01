import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F4FF00',
        'neutral-off-white': '#F8F8F6',
        'neutral-light-gray': '#E8E8E6',
        'neutral-medium-gray': '#A8A8A6',
        'neutral-dark-gray': '#2A2A28',
        'neutral-charcoal': '#1A1A18',
        'accent-forest-green': '#2D5233',
        'accent-emerald-green': '#3A6B42',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': 'clamp(2.5rem, 5vw, 4rem)',
        'h1': 'clamp(2rem, 4vw, 3rem)',
        'h2': 'clamp(1.5rem, 3vw, 2.25rem)',
      },
      spacing: {
        'xs': '0.5rem',
        'sm': '1rem',
        'md': '1.5rem',
        'lg': '2rem',
        'xl': '3rem',
        'xxl': '4rem',
        'xxxl': '6rem',
      },
      borderRadius: {
        'button': '0.5rem',
        'card': '1rem',
        'default': '1rem',
      },
      boxShadow: {
        'elevation-1': '0 2px 8px rgba(0,0,0,0.08)',
        'elevation-2': '0 4px 16px rgba(0,0,0,0.12)',
        'elevation-3': '0 8px 32px rgba(0,0,0,0.16)',
        'elevation-4': '0 16px 48px rgba(0,0,0,0.2)',
        'soft': '0 2px 8px rgba(0,0,0,0.08)',
        'medium': '0 4px 16px rgba(0,0,0,0.12)',
        'strong': '0 8px 32px rgba(0,0,0,0.16)',
        'hero': '0 16px 48px rgba(0,0,0,0.2)',
      },
      animation: {
        'fadeInUp': 'fadeInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'float': 'float 4s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(-4px)' },
          '50%': { transform: 'translateY(4px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { 'background-position': '-200% center' },
          '100%': { 'background-position': '200% center' },
        },
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px',
      },
    },
  },
  plugins: [],
} satisfies Config 