/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Desert theme colors
        cinnamon: '#D2691E',
        desertBrown: '#8B6B47',
        sandy: '#DDA15E',
        cream: '#FFF8E7',
        sand: '#FAF3E0',
        wheat: '#F5DEB3',
        mahogany: '#4A2C2A',
        brown: '#5D4E37',
        sienna: '#6B4423',
        paleWheat: '#FFF5E0',
        peach: '#FFE4B5',
        apricot: '#FFE5B4',
        paleCream: '#F5F0E6',
        sageGreen: 'rgba(135,169,107,0.3)',
        terracotta: 'rgba(204,107,90,0.3)',
        lightPink: 'rgba(255,200,200,0.5)',
        darkChocolate: '#3E2723',
      },
    },
  },
  plugins: [],
};
