/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    {
      pattern: /(bg|text|border)-type-(bug|dark|dragon|electric|fairy|fighting|fire|flying|ghost|normal|grass|ground|ice|poison|psychic|rock|steel|water)/,
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        identity: '#DC0A2D',
        gray: {
          dark: '#212121',
          medium: '#666666',
          light: '#E0E0E0',
          background: '#EFEFEF',
          white: '#FFFFFF',
        },
        type: {
          bug: '#A7B723',
          dark: '#75574C',
          dragon: '#7037FF',
          electric: '#F9CF30',
          fairy: '#E69EAC',
          fighting: '#C12239',
          fire: '#F57D31',
          flying: '#A891EC',
          ghost: '#70559B',
          normal: '#AAA67F',
          grass: '#74CB48',
          ground: '#DEC16B',
          ice: '#9AD6DF',
          poison: '#A43E9E',
          psychic: '#FB5584',
          rock: '#B69E31',
          steel: '#B7B9D0',
          water: '#6493EB',
        }
      },
      fontSize: {
        'body-3': ['var(--fs-body-3)', '1.5'],
        'body-2': ['var(--fs-body-2)', '1.5'],
        'body-1': ['var(--fs-body-1)', '1.5'],
        'caption': ['var(--fs-caption)', '1.2'],
        'headline': ['var(--fs-headline)', '1.3'],
      },
      boxShadow: {
        'drop-2dp': '0 1px 3px 1px rgba(0, 0, 0, 0.2)',
        'drop-6dp': '0 3px 12px 3px rgba(0, 0, 0, 0.2)',
        'inner-2dp': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.25)',
      }
    },
  },
  plugins: [],
}