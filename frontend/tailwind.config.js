module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        brand: {
          1: '#142F43',
          2: '#FFAB4C',
          3: '#FF5F7E'
        }
      }
    },
  },
  variants: {
    extend: {
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
  plugins: [],
}
