module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: ['eslint:recommended', 'prettier', 'plugin:sonarjs/recommended'],
	plugins: ['svelte3', '@typescript-eslint', 'sonarjs'],
	ignorePatterns: ['*.cjs'],
	overrides: [
		{ files: ['**/*.svelte'], processor: 'svelte3/svelte3' },
		{
			files: ['**/*.ts'],
			env: { browser: true, es6: true, node: true },
			extends: [
				'plugin:@typescript-eslint/eslint-recommended',
				'plugin:@typescript-eslint/recommended'
			],
			parser: '@typescript-eslint/parser',
			plugins: ['@typescript-eslint']
		}
	],
	settings: {
		'svelte3/typescript': () => require('typescript')
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2019
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	}
};
