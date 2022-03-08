import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import Explorer from './Explorer.svelte';
import { filesystem, createFile } from '../../utils/filesystem/filesystem';
import { initialising } from 'src/utils/exercise/exercise';

global.window = Object.create(window);
const url = 'http://test.com';
Object.defineProperty(window, 'location', {
	value: {
		href: url
	}
});

describe('The Explorer component', () => {
	beforeEach(() => {
		filesystem.set({});
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
