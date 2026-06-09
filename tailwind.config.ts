import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Obsidian & Ember Design System
        // ─── Surfaces ───────────────────────────────────────────────
        surface: {
          DEFAULT: '#131313',
          50:  '#f5f5f5',
          100: '#e9e9e9',
          200: '#d0d0d0',
          300: '#a8a8a8',
          400: '#737373',
          500: '#525252',
          600: '#3d3d3d',
          700: '#2a2a2a',
          800: '#1e1e1e',
          900: '#131313',
          950: '#0a0a0a',
        },
        'surface-container': {
          DEFAULT: '#1e1e1e',
          low:    '#161616',
          high:   '#242424',
          highest:'#2a2a2a',
        },
        'surface-variant': '#2a2a2a',

        // ─── Primary (Ember Orange) ──────────────────────────────────
        primary: {
          DEFAULT: '#ff8c00',
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#ffb77d',
          400: '#fb923c',
          500: '#ff8c00',
          600: '#ea7000',
          700: '#c25400',
          800: '#9a3f00',
          900: '#7c3500',
          950: '#431a00',
          foreground: '#ffffff',
        },

        // ─── On-Surface (text/icon colors) ──────────────────────────
        'on-surface': {
          DEFAULT: '#f5f5f5',
          muted:   '#a8a8a8',
          faint:   '#525252',
        },

        // ─── Semantic ────────────────────────────────────────────────
        success: {
          DEFAULT: '#22c55e',
          foreground: '#ffffff',
        },
        warning: {
          DEFAULT: '#f59e0b',
          foreground: '#000000',
        },
        danger: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        info: {
          DEFAULT: '#3b82f6',
          foreground: '#ffffff',
        },

        // ─── shadcn/ui aliases ───────────────────────────────────────
        background:  'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input:  'hsl(var(--input))',
        ring:   'hsl(var(--ring))',
      },

      // ─── Border Radius ─────────────────────────────────────────────
      borderRadius: {
        lg:  'var(--radius)',
        md:  'calc(var(--radius) - 2px)',
        sm:  'calc(var(--radius) - 4px)',
        xl:  '1rem',
        '2xl': '1.5rem',
      },

      // ─── Typography ────────────────────────────────────────────────
      fontFamily: {
        inter: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        sans:  ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      // ─── Animations ────────────────────────────────────────────────
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%':   { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glow: {
          '0%, 100%': {
            boxShadow: '0 0 8px 2px rgba(255, 140, 0, 0.4)',
          },
          '50%': {
            boxShadow: '0 0 24px 6px rgba(255, 183, 125, 0.7)',
          },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        // shadcn/ui accordion
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
      },
      animation: {
        'fade-in':      'fadeIn 0.4s ease-out forwards',
        'fade-out':     'fadeOut 0.3s ease-in forwards',
        'slide-up':     'slideUp 0.4s ease-out forwards',
        'slide-down':   'slideDown 0.4s ease-out forwards',
        'slide-in-left':  'slideInLeft 0.4s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        glow:           'glow 2s ease-in-out infinite',
        shimmer:        'shimmer 2.5s linear infinite',
        'scale-in':     'scaleIn 0.3s ease-out forwards',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
      },

      // ─── Box Shadows ───────────────────────────────────────────────
      boxShadow: {
        'ember-sm':  '0 0 8px 2px rgba(255, 140, 0, 0.25)',
        'ember-md':  '0 0 16px 4px rgba(255, 140, 0, 0.35)',
        'ember-lg':  '0 0 32px 8px rgba(255, 140, 0, 0.45)',
        'obsidian':  '0 4px 24px rgba(0, 0, 0, 0.6)',
        'glass':     '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
      },

      // ─── Background Images ─────────────────────────────────────────
      backgroundImage: {
        'ember-gradient':   'linear-gradient(135deg, #ff8c00 0%, #ffb77d 100%)',
        'ember-radial':     'radial-gradient(circle at center, #ff8c00 0%, #ea7000 100%)',
        'obsidian-gradient':'linear-gradient(180deg, #1e1e1e 0%, #131313 100%)',
        shimmer:            'linear-gradient(90deg, transparent 0%, rgba(255,140,0,0.12) 50%, transparent 100%)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}

export default config
