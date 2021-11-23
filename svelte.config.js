import preprocess from 'svelte-preprocess';
import vercel from '@sveltejs/adapter-vercel';
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
			},
			ssr: {
				external: ['whatwg-url']
			}
		},
		adapter: vercel()
	}
};

export default config;
