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
        accentTeal: '#00BFA6',
        accentTealDim: '#00BFA615',
        textPrimary: '#F0F4F8',
        textSecondary: '#8892A4',
        textTeal: '#00BFA6',
        borderColor: '#243447',
        danger: '#FF4757',
        warning: '#FFA502',
        success: '#2ED573',
        dangerDim: '#FF475715',
        warningDim: '#FFA50215',
        successDim: '#2ED57315',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
