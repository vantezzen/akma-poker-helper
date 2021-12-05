module.exports = {
  purge: {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    safelist: [
      'bg-red-500',
      "grid-cols-5",
      "grid-cols-2",
    ]
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        brand: {
          1: '#142F43',
          '1-dark': '#0E212F',
          2: '#FFAB4C',
          3: '#FF5F7E'
        }
      },
      width: {
        '1/2-screen': '50vw',
        '1/3-screen': '33vw',
        '1/4-screen': '25vw',
        '1/5-screen': '20vw',
        '1/10-screen': '10vw',
      },
      height: {
        '1/2-screen': '50vh',
        '1/3-screen': '33vh',
        '1/4-screen': '25vh',
        '1/5-screen': '20vh',
        '1/10-screen': '10vh',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
