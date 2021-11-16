const config = {
	mode: 'jit',
	purge: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			sans: ['Mulish', 'system-ui', 'Helvetica', 'Arial', 'sans-serif']
		},
		extend: {
			colors: {
				bluegray: {
					300: '#8992a3',
					400: '#58647a',
					500: '#444e63',
					600: '#282C34',
					700: '#272b36',
					800: '#1a1d24',
					900: '#1a1b1f '
				},
				aqua: {
					default: '#56B6C2'
				}
			}
		}
	},
	darkMode: 'class',
	plugins: []
};

module.exports = config;
