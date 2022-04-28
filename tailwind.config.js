/* eslint-disable @typescript-eslint/no-var-requires */
const { fontFamily } = require('tailwindcss/defaultTheme');

function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`;
    }
    return `rgb(var(${variable}) / ${opacityValue})`;
  };
}

/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Inter', ...fontFamily.sans],
        jost: ['Jost']
      },
      colors: {
        primary: {
          // Customize it on globals.css :root
          50: withOpacityValue('--tw-color-primary-50'),
          100: withOpacityValue('--tw-color-primary-100'),
          200: withOpacityValue('--tw-color-primary-200'),
          300: withOpacityValue('--tw-color-primary-300'),
          400: withOpacityValue('--tw-color-primary-400'),
          500: withOpacityValue('--tw-color-primary-500'),
          600: withOpacityValue('--tw-color-primary-600'),
          700: withOpacityValue('--tw-color-primary-700'),
          800: withOpacityValue('--tw-color-primary-800'),
          900: withOpacityValue('--tw-color-primary-900'),
        },
        dark: '#222222',
      },
      keyframes: {
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
            opacity: 0.99,
            filter:
              'drop-shadow(0 0 1px rgba(252, 211, 77)) drop-shadow(0 0 15px rgba(245, 158, 11)) drop-shadow(0 0 1px rgba(252, 211, 77))',
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
            opacity: 0.4,
            filter: 'none',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-700px 0',
          },
          '100%': {
            backgroundPosition: '700px 0',
          },
        },
      },
      animation: {
        flicker: 'flicker 3s linear infinite',
        shimmer: 'shimmer 1.3s linear infinite',
      },
      fontSize: {
        f10h21: ['10px', '21px'],
        f11h21: ['11px', '21px'],
        f12h16: ['12px', '16px'],
        f12h21: ['12px', '21px'],
        f14h20: ['14px', '20px'],
        f14h21: ['14px', '21px'],
        f16h19: ['16px', '19px'],
        f16h22: ['16px', '22px'],
        f16h24: ['16px', '24px'],
        f16h25: ['16px', '25px'],
        f17h33: ['17px', '33px'],
        f18h21: ['18px', '21px'],
        f18h24: ['18px', '24px'],
        f18h28: ['18px', '28px'],
        f18h40: ['18px', '40px'],
        f19h35: ['19px', '35px'],
        f20h24: ['20px', '24px'],
        f20h23: ['20px', '23px'],
        f20h28: ['20px', '28px'],
        f20h31: ['20px', '31px'],
        f21h35: ['21px', '35px'],
        f24h28: ['24px', '28px'],
        f24h32: ['24px', '32px'],
        f24h38: ['24px', '38px'],
        f26h36: ['26px', '36px'],
        f28h33: ['28px', '33px'],
        f32h32: ['32px', '32px'],
        f32h36: ['32px', '36px'],
        f32h38: ['32px', '38px'],
        f32h39: ['32px', '39px'],
        f32h45: ['32px', '45px'],
        f32h50: ['32px', '50px'],
        f36h42: ['36px', '42px'],
        f36h43H: ['36px', '43.67px'],
        f48h75: ['48px', '75px'],
        f60h102: ['60px', '102.53px'],
        f96h120: ['96px', '120px'],
        f16hp100: ['16px', '100%'],
        f16hp128: ['16px', '128%'],
        f16hp140: ['16px', '140%'],
        f16hp160: ['16px', '160%'],
        f18hp160: ['18px', '160%'],
        f20hp140: ['20px', '140%'],
        f20hp160: ['20px', '160%'],
        f24hp100: ['24px', '100%'],
        f24hp120: ['24px', '120%'],
        f26hp140: ['26px', '140%'],
        f29hp120: ['29px', '120%'],
        f31hp100: ['31px', '100%'],
        f36hp100: ['36px', '100%'],
        f36hp120: ['36px', '120%'],
        f41hp100: ['41px', '100%'],
        f42hp100: ['42px', '100%'],
        f48hp100: ['48px', '100%'],
        f48hp128: ['48px', '128%'],
        f64hp100: ['64px', '100%']
      },
      screens: {
        'mobile': { 'max': '586px' },
        // => @media (min-width: 640px) { ... }

        'tablet': { 'max': '1192px' },
        // => @media (min-width: 1024px) { ... }

        'desktop': { 'min': '1193px' },
        // => @media (min-width: 1280px) { ... }
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
