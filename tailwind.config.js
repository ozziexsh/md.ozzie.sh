module.exports = {
  purge: ['./pages/**/*.tsx', './components/**/*.tsx', './icons/**/*.tsx'],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [require('@tailwindcss/typography')],
};
