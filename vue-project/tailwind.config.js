/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      colors:{
        'dark':'#164863',
        'dark-grenn':'#427D9D',
        'brend':'#9BBEC8',
        'light':'#DDF2FD'
      }
    },
    },
    plugins: [],
  }