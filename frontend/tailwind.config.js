/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
      './node_modules/flowbite-react/**/*.js',
      './node_modules/react-tailwindcss-datepicker/dist/index.esm.js',
   ],
   plugins: [require('flowbite/plugin')],
   theme: {
      colors: {
         primary: '#11006F',
         ['primary-light']: '#030d78',
         ['primary-lighter']: '#2A2A86',
         ['secondary-lighter']: '#FEEEEA',
         ['secondary-light']: '#FEECC7',
         secondary: '#fac126',
         ['secondary-dark']: '#fcaf17',
         ['secondary-darker']: '#dd9403',
         description: '#212529',
         tag: '#7A7A9D',
         ['tag-light']: '#F6F6F6',
         ['gray-text']: '#D1D3D3',
         ['gray-border']: '#DDE1EF',
         ['gray-secondary-border']: '#c4cdd5',
         ['gray-light-border']: '#F2F2F2',
         ['gray-light']: '#969b9f',
         ['gray-dark']: '#62676D',
         ['gray-darker']: '#102A43',
         ['gray-hr']: '#ffffff4d',
         ['cart']: '#F8F8F8',
         ['cart-dark']: '#f7f7f7',
         ['origin-price']: '#8A8A8F',
         ['origin-price-light']: '#D2D2D2',
         title: '#17191C',
         sapo: '#212b35',
         ['gray-shadow']: '#1f26431a',
         ['yellow-icon']: '#EE4D2D',
         ['brown-soil']: '#856404',
         ['brown-soil-light']: '#fff3cd',
         'shadow-color': '#ed1d2499',
      },
      extend: {
         backgroundImage: {
            'auth-pattern': "url('/bg_auth.png')",
            header: "url('/background-header.png')",
         },
         width: {
            auth: '648px',
         },
         boxShadow: {
            default: '0 3px 25px 0 rgb(31 38 67 / 10%)',
            header: '0 6px 12px 0px rgba(0, 0, 0, 0.05)',
         },
         padding: {
            header: '68px',
            19.5: '78px',
            22: '88px',
         },
         animation: {
            animateLoader: 'animloader 0.3s 0.3s linear infinite alternate',
            animatePhoneCall: 'phoneCall 1s linear infinite',
         },
      },
   },
}