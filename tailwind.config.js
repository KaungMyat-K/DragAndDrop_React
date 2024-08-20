/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "mainBackgroundColor" : "#0D1117",
        "coloumnBackgroundColor" : "#161C22"
      }
    },
  },
  plugins: [],
}

