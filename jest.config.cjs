module.exports = {
	transform: {
		'^.+\\.svelte$': [
			'svelte-jester',
			{
				preprocess: true
			}
		],
		'^.+\\.(ts|tsx|js|jsx)$': ['babel-jest']
	},
	moduleFileExtensions: ['js', 'ts', 'tsx', 'svelte'],
	moduleNameMapper: {
		'^src/(.*)$': '<rootDir>/src/$1',
		'^\\$app(.*)$': '<rootDir>/.svelte-kit/runtime/app$1'
	},
	setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
	testEnvironment: 'jsdom',
	transformIgnorePatterns: ['node_modules/(?!(svelte-icons)/)'],
	coveragePathIgnorePatterns: ['node_modules', '.svelte-kit']
};
