/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.tsx",
    "./resources/**/*.js",
    "./resources/**/*.ts",
  ],
  theme: {
    extend: {
      colors: {
        background: '#131314',
        'on-background': '#e5e2e3',
        primary: '#c0c1ff',
        'on-primary': '#1000a9',
        'on-surface': '#e5e2e3',
        'on-surface-variant': '#c7c4d7',
        'surface-container': '#201f20',
        'surface-container-low': '#1c1b1c',
        'surface-container-high': '#2a2a2b',
        'surface-variant': '#353436',
        outline: '#908fa0',
        'outline-variant': '#464554',
      },
      fontFamily: {
        'display-lg': ['Bodoni Moda', 'serif'],
        'headline-lg': ['Bodoni Moda', 'serif'],
        'headline-md': ['Bodoni Moda', 'serif'],
        'body-lg': ['Inter', 'sans-serif'],
        'body-md': ['Inter', 'sans-serif'],
        'label-sm': ['Space Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
