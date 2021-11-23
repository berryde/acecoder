import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/svelte';
import type { Filesystem, FSFolder } from 'src/utils/types';
import Folder from './Folder.svelte';
import { filesystem, createFolder } from '../../utils/filesystem/filesystem';

describe('The folder component', () => {
	beforeEach(() => {
		// Clear the filesystem
		filesystem.update(() => ({}));
	});
	it('can be deleted', () => {
		// Create a mock filesystem.
		let files: Filesystem;
		filesystem.subscribe((fs) => (files = fs));
		createFolder('test');

		render(Folder, {
			props: {
				path: 'test',
				children: {},
				depth: '0'
			}
		});

		// Click the delete button and check that the file has been deleted.
		const deleteButton = screen.getByTestId('delete-folder');
		expect(files['test']).toBeTruthy();
		fireEvent.click(deleteButton);
		expect(files['test']).toBeFalsy();
	});
	it('can add child folder', async () => {
		// Create a mock filesystem.
		let files: Filesystem;
		filesystem.subscribe((fs) => (files = fs));
		createFolder('test');

		render(Folder, {
			props: {
				path: 'test',
				children: {},
				depth: '0'
			}
		});

		const addFolderButton = screen.getByTestId('create-child-folder');
		fireEvent.click(addFolderButton);

		// Rename the file
		const input = (await screen.findByTestId('explorer-input')) as HTMLInputElement;
		fireEvent.input(input, { target: { value: 'src' } });
		fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

		// Verify that the folder has been created
		const dir = files['test'] as FSFolder;
		expect(dir.children['src']).toBeTruthy();
		expect(dir.children['src'].type).toBe('folder');
	});
	it('can add child file', async () => {
		// Create a mock filesystem.
		let files: Filesystem;
		filesystem.subscribe((fs) => (files = fs));
		createFolder('test');

		render(Folder, {
			props: {
				path: 'test',
				children: {},
				depth: '0'
			}
		});

		const addFolderButton = screen.getByTestId('create-child-file');
		fireEvent.click(addFolderButton);

		// Rename the file
		const input = (await screen.findByTestId('explorer-input')) as HTMLInputElement;
		fireEvent.input(input, { target: { value: 'index.tsx' } });
		fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

		// Verify that the file has been created
		const dir = files['test'] as FSFolder;
		expect(dir.children['index.tsx']).toBeTruthy();
		expect(dir.children['index.tsx'].type).toBe('file');
	});
	it('can be renamed', async () => {
		// Create a mock filesystem.
		let files: Filesystem;
		filesystem.subscribe((fs) => (files = fs));
		createFolder('test');

		render(Folder, {
			props: {
				path: 'test',
				children: {},
				depth: '0'
			}
		});

		const renameButton = screen.getByTestId('rename-folder');
		fireEvent.click(renameButton);

		// Rename the file
		const input = (await screen.findByTestId('explorer-input')) as HTMLInputElement;
		fireEvent.input(input, { target: { value: 'different name' } });
		fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

		// Check that the file state is as expected
		expect(files['test']).toBeFalsy();
		expect(files['different name']).toBeTruthy();
	});
	it('cannot be renamed to the name of an existing folder', async () => {
		// Create a mock filesystem.
		createFolder('test');
		createFolder('src');

		render(Folder, {
			props: {
				path: 'test',
				children: {},
				depth: '0'
			}
		});

		const renameButton = screen.getByTestId('rename-folder');
		fireEvent.click(renameButton);

		// Rename the file
		const input = (await screen.findByTestId('explorer-input')) as HTMLInputElement;
		fireEvent.input(input, { target: { value: 'src' } });
		expect(
			await screen.findByText("A file/folder called 'src' already exists in this directory.")
		).toBeInTheDocument();
	});
	it('can be moved', async () => {
		// Create a mock filesystem.
		let files: Filesystem;
		filesystem.subscribe((fs) => (files = fs));
		createFolder('test');

		render(Folder, {
			props: {
				path: 'test',
				children: {},
				depth: '0'
			}
		});

		const renameButton = screen.getByTestId('rename-folder');
		fireEvent.click(renameButton);

		// Rename the file
		const input = (await screen.findByTestId('explorer-input')) as HTMLInputElement;
		fireEvent.input(input, { target: { value: 'src/test' } });
		fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

		// Check that the file state is as expected
		expect(files['test']).toBeFalsy();
		expect(files['src']).toBeTruthy();
		const dir = files['src'] as FSFolder;
		expect(dir.children['test']).toBeTruthy();
	});
});
