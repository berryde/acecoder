/* eslint-disable sonarjs/no-duplicate-string */
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/svelte';
import type { Filesystem, FSFolder } from '~shared/types';
import File from './File.svelte';
import { filesystem, createFile } from '../../utils/filesystem/filesystem';

describe('The file component', () => {
	beforeEach(() => {
		// Clear the filesystem
		filesystem.update(() => ({}));
	});
	it('can be deleted', async () => {
		// Create a mock filesystem.
		let files: Filesystem = {};
		filesystem.subscribe((fs) => (files = fs));
		createFile('test', '');

		render(File, {
			props: {
				path: 'test',
				depth: '0',
				modifiable: true
			}
		});

		// Click the delete button and check that the file has been deleted.
		fireEvent.mouseEnter(screen.getByTestId('hoverable'));
		const deleteButton = await screen.findByTestId('delete-file');
		expect(files['test']).toBeTruthy();
		fireEvent.click(deleteButton);
		expect(files['test']).toBeFalsy();
	});
	it('can be renamed', async () => {
		// Create a mock filesystem.
		let files: Filesystem = {};
		filesystem.subscribe((fs) => (files = fs));
		createFile('test', '');

		render(File, {
			props: {
				path: 'test',
				depth: '0',
				modifiable: true
			}
		});

		// Check that the file state is as expected
		expect(files['test']).toBeTruthy();
		expect(files['different name']).toBeFalsy();

		fireEvent.mouseEnter(screen.getByTestId('hoverable'));
		const renameButton = await screen.findByTestId('rename-file');
		fireEvent.click(renameButton);

		// Rename the file
		const input = (await screen.findByTestId('explorer-input')) as HTMLInputElement;
		fireEvent.input(input, { target: { value: 'different name' } });
		fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

		// Check that the file state is as expected
		expect(files['test']).toBeFalsy();
		expect(files['different name']).toBeTruthy();
	});
	it('cannot be renamed to the name of an existing file', async () => {
		// Create a mock filesystem.
		createFile('test', '');
		createFile('package.json', '');

		render(File, {
			props: {
				path: 'test',
				depth: '0',
				modifiable: true
			}
		});

		fireEvent.mouseEnter(screen.getByTestId('hoverable'));
		const renameButton = await screen.findByTestId('rename-file');
		fireEvent.click(renameButton);

		// Rename the file
		const input = (await screen.findByTestId('explorer-input')) as HTMLInputElement;
		fireEvent.input(input, { target: { value: 'package.json' } });
		expect(
			await screen.findByText(
				"A file/folder called 'package.json' already exists in this directory."
			)
		).toBeInTheDocument();
	});
	it('can be moved', async () => {
		// Create a mock filesystem.
		let files: Filesystem = {};
		filesystem.subscribe((fs) => (files = fs));
		createFile('App.jsx', '');

		render(File, {
			props: {
				path: 'App.jsx',
				depth: '0',
				modifiable: true
			}
		});

		// Check that the file state is as expected
		expect(files['App.jsx']).toBeTruthy();
		expect(files['src']).toBeFalsy();

		fireEvent.mouseEnter(screen.getByTestId('hoverable'));
		const renameButton = await screen.findByTestId('rename-file');
		fireEvent.click(renameButton);

		// Rename the file
		const input = (await screen.findByTestId('explorer-input')) as HTMLInputElement;
		fireEvent.input(input, { target: { value: 'src/App.jsx' } });
		fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

		// Check that the file state is as expected
		expect(files['App.jsx']).toBeFalsy();
		expect(files['src']).toBeTruthy();
		const dir = files['src'] as FSFolder;
		expect(dir.children['App.jsx']).toBeTruthy();
	});
});
