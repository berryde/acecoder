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
						background: '#060f23',
						highlight: '#314694'
					},
					background: '#0A132E',
					accent: '#18203D',
					primary: '#2463EB',
					'primary-light': '#4078F2',
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
