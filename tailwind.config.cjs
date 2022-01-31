const config = {
	mode: 'jit',
	purge: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Poppins', 'system-ui', 'Helvetica', 'Arial', 'sans-serif']
			},
			colors: {
				brand: {
					editor: {
						background: '#08122A',
						highlight: '#314694'
					},
					background: '#0B1633',
					accent: '#18203D',
					primary: '#2563EB',
					danger: {
						light: '#DA4141',
						dark: '#7f1d1d'
					},
					success: '#16a34a',
					text: '#F0F0F0'
				}
			}
		}
	},
	darkMode: 'class',
	plugins: []
};

module.exports = config;
