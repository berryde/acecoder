/* eslint-disable sonarjs/no-duplicate-string */
import {
	tail,
	navigateToFile,
	getExistingFiles,
	filesystem,
	createFile,
	deleteFile,
	renameFile,
	updateFile,
	getDirectories,
	getParentDir,
	getExtension,
	exists
} from './filesystem';
import type { Filesystem } from '~shared/types';
import { get } from 'svelte/store';

describe('The Filesystem utility', () => {
	it('retrieves the filename of a file', () => {
		let name = tail('src/index.tsx');
		expect(name).toBe('index.tsx');

		name = tail('package.json');
		expect(name).toBe('package.json');
	});
	it('retrieves the parent directory of a given file', () => {
		const files: Filesystem = {
			test: {
				type: 'file',
				value: '',
				modifiable: false
			},
			'package.json': {
				type: 'file',
				value: '',
				modifiable: false
			}
		};
		filesystem.set(files);
		expect(navigateToFile('test')).toBe(files);
	});
	it('retreives the top level filenames of a given directory', () => {
		const files: Filesystem = {
			test: {
				type: 'file',
				value: '',
				modifiable: false
			},
			'package.json': {
				type: 'file',
				value: '',
				modifiable: false
			}
		};
		expect(getExistingFiles(files).toString()).toBe(['test', 'package.json'].toString());
	});
	it('can create a top level file', () => {
		filesystem.set({});
		createFile('index.tsx');
		expect(get(filesystem)).toStrictEqual({
			'index.tsx': {
				type: 'file',
				value: '',
				modifiable: true
			}
		});
	});
	it('can create a non-modifiable file', () => {
		filesystem.set({});
		createFile('index.tsx', 'test', false);
		expect(get(filesystem)).toStrictEqual({
			'index.tsx': {
				type: 'file',
				value: 'test',
				modifiable: false
			}
		});
	});
	it('can create a nested file, creating missing directories', () => {
		filesystem.set({});
		createFile('src/index.tsx');
		expect(get(filesystem)).toStrictEqual({
			src: {
				type: 'folder',
				children: {
					'index.tsx': {
						type: 'file',
						value: '',
						modifiable: true
					}
				},
				modifiable: true
			}
		});
	});
	it('can delete a file', () => {
		filesystem.set({});
		createFile('src/index.tsx');
		expect(get(filesystem)).toStrictEqual({
			src: {
				type: 'folder',
				children: {
					'index.tsx': {
						type: 'file',
						value: '',
						modifiable: true
					}
				},
				modifiable: true
			}
		});

		deleteFile('src/index.tsx');
		expect(get(filesystem)).toStrictEqual({
			src: {
				type: 'folder',
				children: {},
				modifiable: true
			}
		});
	});
	it('can rename a file', () => {
		filesystem.set({});
		createFile('src/index.tsx', 'hello');
		renameFile('src/index.tsx', 'test/test.jsx');
		expect(get(filesystem)).toStrictEqual({
			src: {
				type: 'folder',
				children: {},
				modifiable: true
			},
			test: {
				type: 'folder',
				children: {
					'test.jsx': {
						type: 'file',
						value: 'hello',
						modifiable: true
					}
				},
				modifiable: true
			}
		});
	});
	it('can update the contents of a file', () => {
		filesystem.set({});
		createFile('src/index.tsx', 'hello');
		updateFile('src/index.tsx', 'newcontents');
		expect(get(filesystem)).toStrictEqual({
			src: {
				type: 'folder',
				children: {
					'index.tsx': {
						type: 'file',
						value: 'newcontents',
						modifiable: true
					}
				},
				modifiable: true
			}
		});
	});
	it('gets the directories from a path', () => {
		expect(getDirectories('index.tsx')).toStrictEqual([]);
		expect(getDirectories('src/tests/index.tsx')).toStrictEqual(['src', 'tests']);
	});
	it('gets the parent directory from a given path', () => {
		expect(getParentDir('src/index.tsx')).toBe('src');
		expect(getParentDir('hello/parent/test.tsx')).toBe('hello/parent');
	});
	it('gets the top level filenames from a directory', () => {
		filesystem.set({});
		createFile('src/index.tsx');
		createFile('src/test.js');

		expect(getExistingFiles(navigateToFile('src/index,tsx'))).toStrictEqual([
			'index.tsx',
			'test.js'
		]);
	});
	it('gets the tail of a given path', () => {
		expect(tail('src/some/folder/test.js')).toBe('test.js');
		expect(tail('index.html')).toBe('index.html');
	});
	it('gets the file extension of a given path', () => {
		expect(getExtension('src/file.extension')).toBe('extension');
	});
	it('checks if a file exists', () => {
		filesystem.set({});
		expect(exists('src/index.tsx')).toBeFalsy();
		createFile('src/index.tsx');
		expect(exists('src/index.tsx')).toBeTruthy();
	});
});
