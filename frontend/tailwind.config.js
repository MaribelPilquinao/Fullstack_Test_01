/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Esto le dice a Tailwind que mire tus archivos de React
  ],
  theme: {
    extend: {
      // 2. Añade colores personalizados
      colors: {
        primary: colors.teal, // Ahora puedes usar 'bg-primary-600'
        gray: colors.slate,   // Reemplaza el gris por defecto por 'slate'
      },
    },
  },
  plugins: [],
}