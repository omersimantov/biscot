/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        pulse: "pulse 0.75s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      },
      colors: {
        bg: "#222222",
        border: "#555555",
        borderLight: "#777777",
        green: "#376e37",
        red: "#b91c1c"
      }
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  plugins: [require("@tailwindcss/forms"), require("tailwind-scrollbar")({ nocompatible: true })]
};
