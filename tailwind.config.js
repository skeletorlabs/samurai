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
        art: "url('/art.svg')",
        art2: "url('/art2.png')",
        art3: "url('/art3.svg')",
        art4: "url('/art4.svg')",
        art5: "url('/art5.svg')",
        edge: "url('/edge.svg')",
      },
    },
  },
  plugins: [],
};
