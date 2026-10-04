/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: '#0D1B2A',
        bgCard: '#1A2B3C',
        bgElevated: '#243447',
        borderColor: '#243447',
        accentTeal: '#00BFA6',
        accentTealHover: '#00A896',
        accentTealDim: 'rgba(0, 191, 166, 0.08)',
        textPrimary: '#F0F4F8',
        textSecondary: '#8892A4',
        textTeal: '#00BFA6',
        danger: '#FF4757',
        dangerDim: 'rgba(255, 71, 87, 0.08)',
        warning: '#FFA502',
        warningDim: 'rgba(255, 165, 2, 0.08)',
        success: '#2ED573',
        successDim: 'rgba(46, 213, 115, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0, 0, 0, 0.3)',
        'hover': '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
      borderRadius: {
        'card': '12px',
        'btn': '8px',
      }
    },
  },
  plugins: [],
};
