/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "custom-inset": "inset 0 0 0 0 rgba(0, 0, 0,1)", // Initial shadow
        "custom-inset-hover": "inset 300px 0 0 0 rgba(0, 0, 0, 1)", // Hover effect
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0.7 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.7s ease-in-out",
      },
    },
  },
  plugins: [],
};
