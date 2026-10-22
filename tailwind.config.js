/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Palette tirée du logo et des affiches MGS
        ink: "#15161B",
        cream: "#FBF6EF",
        orange: {
          DEFAULT: "#FF6B00",
          soft: "#FF8A2A",
          deep: "#E85A00",
        },
        stone: {
          line: "#E4DBCF",
        },
      },
      fontFamily: {
        sans: ['"Montserrat Variable"', "system-ui", "sans-serif"],
      },
      maxWidth: {
        page: "72rem",
      },
    },
  },
  plugins: [],
};
