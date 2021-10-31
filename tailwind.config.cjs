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
					light: '#ABB2BF',
					default: '#282C34',
					dark: '#1a1d24'
				},
				aqua: {
					default: '#56B6C2'
				}
			}
		}
	},
	plugins: []
};

module.exports = config;
