/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tombolaRed: '#d4141d',
        tombolaDarkRed: '#b00f16',
        quinielaGreen: '#009d2e',
        quinielaDarkGreen: '#007a23',
        cincoBlue: '#0026c2',
        cincoDarkBlue: '#001980',
        cincoYellow: '#ffea00',
        ballCyan: '#b6dbfa',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Impact', 'Arial Black', 'sans-serif'],
        numbers: ['Helvetica Neue', 'Arial', 'sans-serif']
      }
    },
  },
  plugins: [],
}
