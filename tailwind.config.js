/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "background-main": "#181c23",
        "background-card": "#232837",
        "primary-purple": "#7c3aed", // Tailwind's purple-600
        "primary-purple-dark": "#6d28d9", // Tailwind's purple-700
        "primary-green": "#22c55e", // Tailwind's green-500
        "primary-green-dark": "#16a34a", // Tailwind's green-600
      },
      backgroundImage: {
        "gradient-purple":
          "linear-gradient(to right, #a78bfa, #7c3aed, #6d28d9)",
      },
    },
  },
  plugins: [],
};
