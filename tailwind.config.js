/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
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
        "home-art": "url('/home-art.svg')",
        "sword-art": "url('/sword-art.svg')",
        art: "url('/art5.svg')",
        edge: "url('/edge.svg')",
        sanka: "url('/bg-sanka.svg')",
        button: "url('/bg-button.svg')",
        "button-hover": "url('/bg-button-hover.svg')",
        "samurai-cyborg": "url('/art-cyborg.svg')",
        "samurai-cyborg-fem": "url('/art-cyborg-fem.svg')",
        "samurai-shadow": "url('/art-shadow.svg')",
        "samurai-incubator": "url('/samurai-incubator-bg.png')",
        "samurai-sanka": "url('/samurai-sanka-bg.png')",
        "samurai-launchpad": "url('/samurai-launchpad-bg.png')",
      },
    },
    clipPath: {
      "s-polygon": "polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 1rem))",
      "s-polygon2": "polygon(0px 0px, 90% 0px, 285px 90px, 0px 45px)",
    },
  },
  plugins: [require("tailwind-clip-path"), require("flowbite/plugin")],
};
