const config = {
	mode: 'jit',
	purge: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			sans: ['Poppins', 'system-ui', 'Helvetica', 'Arial', 'sans-serif']
		},
		extend: {
			colors: {
				brand: {
					editor: {
						background: '#08122A',
						highlight: '#314694',
					},
					background: '#0B1633',
					accent: '#18203D',
					primary: '#2563EB',
					danger: {
						light: '#DA4141',
						dark: '#7f1d1d'
					},
					success: '#22C55E',
					text: '#F0F0F0',
				}
			}
		}
	},
	darkMode: 'class',
	plugins: []
};

module.exports = config;
