/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0B1020',
          900: '#111728',
          800: '#1C2438',
          700: '#2C364F',
          500: '#56627A',
          400: '#7B879D',
          300: '#9DA8BC',
          100: '#E4E7EF',
          50: '#F7F8FC',
        },
        brand: {
          DEFAULT: '#5146E5',
          hover: '#4338CA',
          light: '#6257F5',
          soft: '#EEF0FF',
          tint: '#F5F6FF',
        },
        success: {
          DEFAULT: '#16886A',
          soft: '#E8F6F1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Manrope', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 12px 32px rgba(15,23,42,.08)',
        subtle: '0 1px 3px rgba(11,16,32,0.04), 0 4px 12px rgba(11,16,32,0.03)',
        elevated: '0 10px 30px -4px rgba(11,16,32,0.06), 0 4px 12px -2px rgba(11,16,32,0.03)',
        floating: '0 20px 40px -8px rgba(11,16,32,0.12), 0 8px 16px -4px rgba(11,16,32,0.04)',
      },
    },
  },
  plugins: [],
}

