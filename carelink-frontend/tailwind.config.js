/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Skill Setu Executive Navy & Container Palette
        bgPrimary: '#0B1528',
        bgCard: '#112038',
        bgElevated: '#172A4A',
        bgElevatedHover: '#1E365E',
        borderColor: '#1E355B',

        // CareLink Medical Teal + Kawach Electric Blue
        accentTeal: '#00BFA6',
        accentTealDim: '#00BFA615',
        accentBlue: '#2563EB',
        accentBlueDim: '#2563EB15',

        // Skill Setu Terracotta & Saffron Amber Palette
        accentAmber: '#D97706',
        accentAmberDim: '#D9770615',
        accentTerracotta: '#B5502E',
        accentTerracottaDim: '#B5502E15',
        accentSaffron: '#F59E0B',
        accentSaffronDim: '#F59E0B15',

        // Text & Status
        textPrimary: '#F8FAFC',
        textSecondary: '#94A3B8',
        textMuted: '#64748B',
        textTeal: '#00BFA6',
        danger: '#EF4444',
        warning: '#F59E0B',
        success: '#10B981',
        dangerDim: '#EF444415',
        warningDim: '#F59E0B15',
        successDim: '#10B98115',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-teal': '0 0 25px -5px rgba(0, 191, 166, 0.3)',
        'glow-amber': '0 0 25px -5px rgba(217, 119, 6, 0.35)',
        'glow-blue': '0 0 25px -5px rgba(37, 99, 235, 0.35)',
      },
    },
  },
  plugins: [],
};
