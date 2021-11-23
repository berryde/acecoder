import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/svelte';
import type { Filesystem } from 'src/utils/types';
import Explorer from './Explorer.svelte';
import { filesystem, createFile, exists, getFile } from '../../utils/filesystem/filesystem';

describe('The Explorer component', () => {
	beforeEach(() => {
		filesystem.set({});
	});
	it('renders the provided filesystem', () => {
		createFile('package.json');
		createFile('src/index.tsx');
		const screen = render(Explorer);
		expect(screen.getByText('index.tsx')).toBeInTheDocument();
		expect(screen.getByText('src')).toBeInTheDocument();
		expect(screen.getByText('package.json')).toBeInTheDocument();
	});
	it('can create a new folder', async () => {
		// Create a mock filesystem.
		let files: Filesystem;
		filesystem.subscribe((fs) => (files = fs));
		render(Explorer);

		// Create the folder
		const addFolder = screen.getByTestId('add-folder');
		fireEvent.click(addFolder);
		const input = (await screen.findByTestId('explorer-input')) as HTMLInputElement;
		fireEvent.input(input, { target: { value: 'new folder' } });
		fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

		// Rerender the component to reflect the change in state.

		expect(await screen.findByText('new folder')).toBeInTheDocument();
		expect(files['new folder']).toBeTruthy();
		expect(files['new folder'].type).toBe('folder');
	});
	it('can create a new file', async () => {
		// Create a mock filesystem.

		render(Explorer);

		// Create the folder
		const addFile = screen.getByTestId('add-file');
		fireEvent.click(addFile);
		const input = (await screen.findByTestId('explorer-input')) as HTMLInputElement;
		fireEvent.input(input, { target: { value: 'new file' } });
		fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

		// Rerender the component to reflect the change in state.

		expect(await screen.findByText('new file')).toBeInTheDocument();
		filesystem.update((fs) => {
			expect(exists(fs, 'new file')).toBeTruthy();
			expect(getFile(fs, 'new file')).toBeTruthy();
			return fs;
		});
	});
});
