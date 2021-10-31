import preprocess from 'svelte-preprocess';
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
					$components: resolve('./src/components')
				}
			}
		}
	}
};

export default config;
