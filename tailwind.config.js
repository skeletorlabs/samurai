/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-100": "#15152E",
        "light-100": "#B2B8FF",
        "highlight-100": "#0AC6E5",
        "samurai-red": "#FF284C",
      },
      backgroundImage: {
        art: "url('/art2.svg')",
        edge: "url('/edge.svg')",
        sanka: "url('/bg-sanka.svg')",
      },
    },
  },
  plugins: [],
};
