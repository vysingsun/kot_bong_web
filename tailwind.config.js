/** @type {import('tailwindcss').Config} */
import flowbite from 'flowbite/plugin'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', './node_modules/flowbite/**/*.js'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          dark: 'var(--color-primary-dark)',
          light: 'var(--color-primary-light)',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554'
        },
        // Landing page indigo palette (separate from app primary)
        'landing-primary': {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#3864ed',
          700: '#2d50c1',
          800: '#1e3a8a',
          900: '#1e2f6b',
          950: '#0f1a40',
        },
        // Landing page green accent (#1fc600)
        'landing-green': {
          50:  '#f0fce9',
          100: '#dcf8cc',
          200: '#b8f09b',
          300: '#87e462',
          400: '#55d42e',
          500: '#1fc600',
          600: '#18a300',
          700: '#138000',
          800: '#0e5c00',
          900: '#083800',
        },
        fuel: {
          orange: '#f97316',
          green:  '#22c55e',
          blue:   '#3b82f6',
          yellow: '#eab308',
        },
      },
      textColor: {
        primary: 'var(--color-primary)',
        'on-primary': 'var(--color-text-on-primary)',
        secondary: 'var(--color-secondary)',
      },
      backgroundColor: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          dark: 'var(--color-primary-dark)',
          light: 'var(--color-primary-light)',
        }
      },
      borderColor: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
      },
      ringColor: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
      }
    },
    fontFamily: {
      body: [
        'Inter',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'system-ui',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'Noto Sans',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji'
      ],
      sans: [
        'Inter',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'system-ui',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'Noto Sans',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji',
        'Kantumruy Pro',
      ],
      kantumruy: ['Kantumruy Pro', 'sans-serif'],
    },
    animation: {
      'landing-float':      'landingFloat 6s ease-in-out infinite',
      'landing-fade-up':    'landingFadeUp 0.6s ease-out forwards',
      'landing-fade-in':    'landingFadeIn 0.4s ease-out forwards',
      'landing-slide-in':   'landingSlideIn 0.5s ease-out forwards',
      'landing-blob':       'landingBlob 7s infinite',
      'landing-pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      'landing-gradient':   'landingGradient 8s ease infinite',
    },
    backgroundSize: {
      '300': '300% 300%',
    }
  },
  plugins: [flowbite],
  darkMode: 'class'
}
