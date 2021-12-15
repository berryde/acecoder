const { resolve } = require('path');
module.exports = {
	stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-svelte-csf',
		'@storybook/addon-a11y',
		'storybook-tailwind-dark-mode',
		{
			name: '@storybook/addon-postcss',
			options: {
				cssLoaderOptions: {
					importLoaders: 1
				},
				postcssLoaderOptions: {
					implementation: require('postcss')
				}
			}
		}
	],
	webpackFinal: async (config) => {
		const svelteLoader = config.module.rules.find(
			(r) => r.loader && r.loader.includes('svelte-loader')
		);
		svelteLoader.options.preprocess = require('svelte-preprocess')({
			babel: {
				presets: [
					[
						'@babel/preset-env',
						{
							loose: true,
							// No need for babel to resolve modules
							modules: false,
							targets: {
								// ! Very important. Target es6+
								esmodules: true
							}
						}
					]
				]
			}
		});

		return {
			...config,
			resolve: {
				...config.resolve,
				alias: {
					...config.resolve?.alias,
					src: resolve('./src')
				}
			}
		};
	},
	babel: async (options) => ({
		...options,
		plugins: ['@babel/plugin-proposal-nullish-coalescing-operator']
	})
};
