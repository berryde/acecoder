const config = {
	mode: 'jit',
	purge: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			sans: ['Mulish', 'system-ui', 'Helvetica', 'Arial', 'sans-serif']
		},
		extend: {
			colors: {
				dark: {
					divider: '#1A1B1F',
					bgdark: '#1A1D24',
					bglight: '#282C34',
					text: '#D1D5DB'
				},
				light: {
					divider: '#DBDBDB',
					bgdark: '#EEEEEE',
					bglight: '#FCFCFC',
					text: '#1D1D1D'
				}
			}
		}
	},
	darkMode: 'class',
	plugins: []
};

module.exports = config;
