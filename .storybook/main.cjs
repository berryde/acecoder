module.exports = {
	stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-svelte-csf',
		'@storybook/addon-a11y',
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
		svelteLoader.options.preprocess = require('svelte-preprocess')({});
		return config;
	}
};
