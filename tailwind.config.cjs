const config = {
	mode: 'jit',
	purge: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				bluegray: {
					light: '#ABB2BF',
					default: '#2c313a',
					dark: '#282C34'
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
