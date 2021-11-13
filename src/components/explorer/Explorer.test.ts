import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/svelte';
import type { Filesystem } from 'src/utils/types';
import Explorer from './Explorer.svelte';
import { filesystem } from '../../utils/filesystem/filesystem';

describe('The Explorer component', () => {
	it('renders the provided filesystem', () => {
		const filesystem: Filesystem = {
			src: {
				type: 'folder',
				children: {
					'index.tsx': {
						type: 'file',
						value: ''
					}
				}
			},
			'package.json': {
				type: 'file',
				value: ''
			}
		};
		const screen = render(Explorer, {
			props: {
				files: filesystem
			}
		});
		expect(screen.getByText('index.tsx')).toBeInTheDocument();
		expect(screen.getByText('src')).toBeInTheDocument();
		expect(screen.getByText('package.json')).toBeInTheDocument();
	});
	it('can create a new folder', async () => {
		// Create a mock filesystem.
		let files: Filesystem;
		filesystem.subscribe((fs) => (files = fs));
		const { rerender } = render(Explorer, {
			props: {
				files: files
			}
		});

		// Create the folder
		const addFolder = screen.getByTestId('add-folder');
		fireEvent.click(addFolder);
		const input = (await screen.findByTestId('explorer-input')) as HTMLInputElement;
		fireEvent.input(input, { target: { value: 'new folder' } });
		fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

		// Rerender the component to reflect the change in state.
		rerender({
			props: { files: files }
		});
		expect(await screen.findByText('new folder')).toBeInTheDocument();
		expect(files['new folder']).toBeTruthy();
		expect(files['new folder'].type).toBe('folder');
	});
	it('can create a new file', async () => {
		// Create a mock filesystem.
		let files: Filesystem;
		filesystem.subscribe((fs) => (files = fs));
		const { rerender } = render(Explorer, {
			props: {
				files: files
			}
		});

		// Create the folder
		const addFile = screen.getByTestId('add-file');
		fireEvent.click(addFile);
		const input = (await screen.findByTestId('explorer-input')) as HTMLInputElement;
		fireEvent.input(input, { target: { value: 'new file' } });
		fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

		// Rerender the component to reflect the change in state.
		rerender({
			props: { files: files }
		});
		expect(await screen.findByText('new file')).toBeInTheDocument();
		expect(files['new file']).toBeTruthy();
		expect(files['new file'].type).toBe('file');
	});
});