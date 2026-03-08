/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)',
        glow: '0 0 0 1px rgba(14, 165, 233, 0.2), 0 20px 40px rgba(14,165,233,0.12)',
      },
      backgroundImage: {
        noise: 'radial-gradient(circle at 10% 20%, rgba(14,165,233,.08), transparent 40%), radial-gradient(circle at 80% 0%, rgba(99,102,241,.08), transparent 35%)',
      },
    },
  },
  plugins: [],
};
