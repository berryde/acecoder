import { writable } from 'svelte/store';
import type { Filesystem, FSFile, FSFolder } from '../types';
import type { File } from '../../utils/types';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

/**
 * The file system in memory for the application.
 */
export const filesystem = writable<Filesystem>({});

/**
 * Creates a new file with the given name and value.
 *
 * @param filename The name of the new file.
 * @param value The initial value of the new file.
 */
export const createFile = (path: string, value?: string): void => {
	const name = tail(path);

	filesystem.update((state) => {
		const dir = navigateToFile(state, path);

		if (name in dir) {
			console.error('File ' + path + ' already exists');
		} else {
			dir[name] = {
				type: 'file',
				value: value ? value : ''
			};
		}

		return state;
	});
};

/**
 * Creates a new empty folder.
 *
 * @param filename The name of the new folder.
 */
export const createFolder = (path: string): void => {
	const name = tail(path);

	filesystem.update((state) => {
		const dir = navigateToFile(state, path);

		if (name in dir) {
			console.error('Directory ' + path + ' already exists');
		} else {
			dir[name] = {
				type: 'folder',
				children: {}
			};
		}

		return state;
	});
};

/**
 * Removes the object at the provided path from the filesystem.
 *
 * @param path The path of the object to delete.
 */
export const deleteFile = (path: string): void => {
	const name = tail(path);

	filesystem.update((state) => {
		const dir = navigateToFile(state, path);
		delete dir[name];
		return state;
	});
};

export const compareFile = (
	a: [string, FSFile | FSFolder],
	b: [string, FSFile | FSFolder]
): number => {
	// folders come before files
	if (
		(a[1].type == 'file' && b[1].type == 'file') ||
		(a[1].type == 'folder' && b[1].type == 'folder')
	) {
		return a[0].localeCompare(b[0]);
	}
	if (a[1].type == 'file' && b[1].type == 'folder') {
		return 1;
	}
	if (a[1].type == 'folder' && b[1].type == 'file') {
		return -1;
	}
};
/**
 * Move the object at path to target.
 *
 * @param path The previous path to the object.
 * @param target The new path to the object.
 */
export const renameFile = (path: string, target: string): void => {
	const oldName = tail(path);
	const newName = tail(target);

	filesystem.update((state) => {
		// Clone the object at path.
		const src = navigateToFile(state, path);
		const clone = Object.assign({}, src[oldName]);

		// Write the clone to target.
		const dir = navigateToFile(state, target);
		dir[newName] = clone;

		// Delete the original
		delete dir[oldName];

		return state;
	});
};

/**
 * Overwrite the contents of a file in state.
 *
 * @param filename The name of the file.
 * @param contents The contents of the file.
 */
export const updateFile = (filepath: string, contents: string): void => {
	const filename = tail(filepath);

	filesystem.update((state) => {
		const dir = navigateToFile(state, filepath);
		dir[filename] = {
			type: 'file',
			value: contents
		};
		return state;
	});
};

/**
 * Splits the path into a list of strings containing the
 * parent directories in the path, in order.
 * Does not include the tail of the path.
 *
 *
 * @param filepath The path to split
 * @returns A list of directories from the path.
 */
export const getDirectories = (path: string): string[] => {
	if (!path.includes('/')) {
		return [];
	} else {
		const split = path.split('/');
		return split.slice(0, split.length - 1);
	}
};

/**
 * Gets the path of the parent directory for a given path.
 *
 * @param path The path to find the parent from.
 * @returns The path of the parent directory
 */
export const getParentDir = (path: string): string => {
	if (!path.includes('/')) {
		return '';
	}
	const split = path.split('/');
	return split.slice(0, split.length - 1).join('/');
};

/**
 * Gets the top level file names from a given directory. Useful for new filename validation.
 *
 * @param dir The directory to check.
 * @returns The top level file names of the directory.
 */
export const getExistingFiles = (dir: Filesystem): string[] => {
	return Object.keys(dir).map((k) => tail(k));
};

/**
 * Gets the tail (everything after the final '/') from a given path.
 *
 * @param path The path to trim.
 * @returns The file name.
 */
export const tail = (path: string): string => {
	if (path.includes('/')) {
		const split = path.split('/');
		return split[split.length - 1];
	}
	return path;
};

/**
 * Gets the file extension of a given path.
 *
 * @param path the path to get the extension for.
 * @returns The file extension of the file at path.
 */
export const getExtension = (path: string): string => {
	const name = tail(path);
	if (!name.includes('.')) {
		return '';
	}
	const split = name.split('.');
	return split[split.length - 1];
};

/**
 * Returns the parent directory of the object
 * If any directories specified in the path do not exist, they will be created.
 *
 * @param state The filesystem to search in.
 * @param filepath The filepath to navigate to.
 * @returns The directory containing the file specified by filepath.
 */
export const navigateToFile = (state: Filesystem, path: string): Filesystem => {
	const directories = getDirectories(path);
	let dir = state;
	for (let i = 0; i < directories.length; i++) {
		if (!dir[directories[i]])
			dir[directories[i]] = {
				type: 'folder',
				children: {}
			};
		const folder = dir[directories[i]] as FSFolder;
		dir = folder.children;
	}
	return dir;
};

/**
 * Checks if an object exists in the filesystem.
 *
 * @param state The file system.
 * @param path The object to check existence for.
 * @returns Whether there is an object at path.
 */
export const exists = (state: Filesystem, path: string): boolean => {
	const parent = navigateToFile(state, path);
	const name = tail(path);
	return name in parent;
};

/**
 * Retrieves an object from the file system.
 *
 * @param state The file system.
 * @param path The path of the object to retrieve.
 * @returns The retrieved object.
 */
export const getFile = (state: Filesystem, path: string): FSFile | FSFolder => {
	const parent = navigateToFile(state, path);
	const name = tail(path);
	return parent[name];
};

/**
 * Recursively walks through the filesystem, collecting files and their values.
 *
 * @param state The filesystem
 * @returns A list of all files in the filesystem with their values.
 */
export const getAllFiles = (prefix: string, state: Filesystem): File[] => {
	let files: File[] = [];
	for (const [name, file] of Object.entries(state)) {
		if (file.type === 'file') {
			files.push({
				code: file.value,
				name: prefix + name
			});
		} else {
			const children = getAllFiles(prefix + name + '/', file.children);
			files = files.concat(children);
		}
	}
	return files;
};

const createZip = (zip: JSZip, state: Filesystem) => {
	// Create a zip from the file system by traversing it.
	for (const [name, file] of Object.entries(state)) {
		if (file.type === 'file') {
			zip.file(name, file.value);
		} else {
			createZip(zip.folder(name), file.children);
		}
	}
	return zip;
};

export const exportFilesystem = (state: Filesystem) => {
	const zip = createZip(new JSZip(), state);

	zip.generateAsync({ type: 'blob' }).then(function (content) {
		saveAs(content, 'application.zip');
	});
};
