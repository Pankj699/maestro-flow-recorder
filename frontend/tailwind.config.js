/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#070B14',
          900: '#0B1220', // Primary Background
          800: '#111827', // Secondary Surface
          700: '#161F2F', // Cards Surface
          600: '#1E293B', // Subtle Divider/Border
          500: '#334155',
        },
        brand: {
          500: '#6366F1', // Accent
          600: '#4F46E5', // Selected / Primary CTA
          700: '#4338CA',
          purple: '#8B5CF6',
          cyan: '#06B6D4',
          emerald: '#22C55E',
          amber: '#F59E0B',
          rose: '#EF4444',
          recording: '#FF3B5C', // Electric Coral Recording Red
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        ide: '0 8px 32px rgba(0, 0, 0, 0.35)',
        'ide-lg': '0 16px 48px rgba(0, 0, 0, 0.5)',
        glow: '0 0 24px rgba(99, 102, 241, 0.3)',
        'glow-rec': '0 0 24px rgba(255, 59, 92, 0.4)',
      },
      borderRadius: {
        card: '14px',
        btn: '10px',
        input: '10px',
        panel: '16px',
        phone: '24px',
      },
    },
  },
  plugins: [],
};
