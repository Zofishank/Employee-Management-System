/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // or wherever your components are
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A1C2C", // Dark Navy
        accent: "#00FFD1", // Neon Mint
        secondary: "#5B5F97", // Electric Indigo
        background: "#16161A", // Charcoal
      },
    },
  },
  darkMode: "class", // Enable dark mode using class strategy
  plugins: [],
};
