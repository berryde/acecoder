import preprocess from 'svelte-preprocess';
import netlify from '@sveltejs/adapter-netlify';
import { resolve } from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		preprocess({
			postcss: true
		})
	],
	kit: {
		target: '#svelte',
		vite: {
			resolve: {
				alias: {
					$components: resolve('./src/components'),
					src: resolve('./src')
				}
			},
			ssr: {
				external: ['whatwg-url']
			}
		},
		adapter: netlify()
	}
};

export default config;
