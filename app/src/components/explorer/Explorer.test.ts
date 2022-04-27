import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import Explorer from './Explorer.svelte';
import { filesystem, createFile } from '../../utils/filesystem/filesystem';
import { exercise, initialising, language } from 'src/utils/exercise/exercise';

const loadExercise = () => {
	language.set('react');
	exercise.set({
		files: { react: { 'App.jsx': { modifiable: false, type: 'file', value: '' } } },
		assessed: true,
		chapters: [],
		description: '',
		inherits: false,
		name: '',
		writable: true
	});
};

describe('The Explorer component', () => {
	beforeEach(() => {
		filesystem.set({});
		loadExercise();
	});
	it('renders the provided filesystem', () => {
		// Load a fake exercise
		createFile('package.json');
		createFile('src/index.tsx');
		initialising.set(false);

		const screen = render(Explorer);
		expect(screen.getByText('index.tsx')).toBeInTheDocument();
		expect(screen.getByText('src')).toBeInTheDocument();
		expect(screen.getByText('package.json')).toBeInTheDocument();
	});
});
