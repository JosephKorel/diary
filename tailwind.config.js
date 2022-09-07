/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        shark: {
          DEFAULT: "#4361EE",
          50: "#EBEFFD",
          100: "#D9DFFC",
          200: "#B3BFF8",
          300: "#8EA0F5",
          400: "#6880F1",
          500: "#4361EE",
          600: "#1539E4",
          700: "#102CB1",
          800: "#0B1F7D",
          900: "#07124A",
        },
        amaranth: {
          DEFAULT: "#EE4463",
          50: "#FDECEF",
          100: "#FCDAE0",
          200: "#F8B4C1",
          300: "#F58FA1",
          400: "#F16982",
          500: "#EE4463",
          600: "#E5153B",
          700: "#B2102E",
          800: "#7E0B20",
          900: "#4B0713",
        },
        radio: {
          DEFAULT: "#63EE44",
          50: "#EFFDEC",
          100: "#E0FCDA",
          200: "#C1F8B4",
          300: "#A1F58F",
          400: "#82F169",
          500: "#63EE44",
          600: "#3BE515",
          700: "#2EB210",
          800: "#207E0B",
          900: "#134B07",
        },
        ronchi: {
          DEFAULT: "#EECF44",
          50: "#FDFAEC",
          100: "#FCF5DA",
          200: "#F8ECB4",
          300: "#F5E28F",
          400: "#F1D969",
          500: "#EECF44",
          600: "#E5BF15",
          700: "#B29410",
          800: "#7E690B",
          900: "#4B3E07",
        },
        scampi: {
          DEFAULT: "#60579D",
          50: "#CDCAE2",
          100: "#C1BDDA",
          200: "#A8A3CC",
          300: "#8F88BD",
          400: "#766EAF",
          500: "#60579D",
          600: "#4A4379",
          700: "#342F55",
          800: "#1E1B31",
          900: "#08070D",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
