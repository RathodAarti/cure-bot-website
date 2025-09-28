/** Tailwind Config **/
/** Keep it tiny and JIT-only **/
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontSize: {
        base: '18px',
        xl: '20px',
      },
      spacing: {
        18: '4.5rem'
      }
    }
  },
  plugins: []
}
