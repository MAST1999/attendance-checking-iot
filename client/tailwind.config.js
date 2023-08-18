/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'bg-main': "url('./images/bg-main.jpg')",
      }
    },
  },
  plugins: [
    require("daisyui")
  ],
  daisyui: {
    themes: ["cupcake"],
  },
}

