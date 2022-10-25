/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#222222",
        border: "#555555",
        green: "#376e37",
        red: "#b91c1c"
      },
      borderColor: {
        DEFAULT: "#555555",
        light: "#777777"
      },
      animation: {
        pulse: "pulse 0.75s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      }
    },
    animation: {
      spinSlow: "spin 0.75s linear infinite",
      dash: "dash 1s ease-in-out infinite"
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  plugins: [require("@tailwindcss/forms"), require("tailwind-scrollbar")({ nocompatible: true })]
};
