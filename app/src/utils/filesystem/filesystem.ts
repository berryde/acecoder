import { writable } from 'svelte/store';
import type { Exercise, Filesystem, FSFile, FSFolder } from '~shared/types';
import { saveAs } from 'file-saver';
import { get } from 'svelte/store';
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
export const createFile = (path: string, value?: string, modifiable = true): void => {
	const name = tail(path);

	filesystem.update((state) => {
		const dir = navigateToFile(path, modifiable);

		if (name in dir) {
			console.error('File ' + path + ' already exists');
		} else {
			dir[name] = {
				type: 'file',
				value: value ? value : '',
				modifiable: modifiable
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
export const createFolder = (path: string, modifiable = true): void => {
	const name = tail(path);

	filesystem.update((state) => {
		const dir = navigateToFile(path);

		if (name in dir) {
			console.error('Directory ' + path + ' already exists');
		} else {
			dir[name] = {
				type: 'folder',
				children: {},
				modifiable: modifiable
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
		const dir = navigateToFile(path);
		delete dir[name];
		return state;
	});
};

export const sort = (filesystem: Filesystem): Filesystem => {
	return Object.fromEntries(Object.entries(filesystem).sort(compareFile));
};

/**
 * A custom comparator for filesystem objects.
 *
 * @param a The first file to compare
 * @param b The second file to compare
 * @returns Whether a should be ordered before b
 */
const compareFile = (a: [string, FSFile | FSFolder], b: [string, FSFile | FSFolder]): number => {
	// folders come before files
	if (
		(a[1].type == 'file' && b[1].type == 'file') ||
		(a[1].type == 'folder' && b[1].type == 'folder')
	) {
		return a[0].localeCompare(b[0]);
	} else if (a[1].type == 'file' && b[1].type == 'folder') {
		return 1;
	} else {
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
		const src = navigateToFile(path);
		const clone = Object.assign({}, src[oldName]);

		// Write the clone to target.
		const dir = navigateToFile(target);
		dir[newName] = clone;

		// Delete the original
		delete src[oldName];

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
	const modifiable = (getFile(filepath) as FSFile).modifiable;

	filesystem.update((state) => {
		const dir = navigateToFile(filepath);
		dir[filename] = {
			type: 'file',
			value: contents,
			modifiable: modifiable
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

export const isExerciseFile = (path: string, exercise: Exercise, language: string): boolean => {
	return path in exercise.files[language];
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
export const navigateToFile = (path: string, modifiable = true): Filesystem => {
	const directories = getDirectories(path);
	let dir = get(filesystem);
	for (let i = 0; i < directories.length; i++) {
		if (!dir[directories[i]])
			dir[directories[i]] = {
				type: 'folder',
				children: {},
				modifiable: modifiable
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
export const exists = (path: string): boolean => {
	const parent = navigateToFile(path);
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
export const getFile = (path: string): FSFile | FSFolder => {
	const parent = navigateToFile(path);
	const name = tail(path);
	return parent[name];
};

/**
 * Recursively walks through the filesystem, collecting files and their values.
 *
 * @param state The filesystem
 * @returns A list of all files in the filesystem with their values.
 */
export const getAllFiles = (prefix: string, root: Filesystem): Record<string, FSFile> => {
	let files: Record<string, FSFile> = {};
	for (const [name, file] of Object.entries(root)) {
		if (file.type === 'file') {
			files[prefix + name] = file;
		} else {
			const children = getAllFiles(prefix + name + '/', file.children);
			files = { ...files, ...children };
		}
	}
	return files;
};

/**
 * Extract a zip file
 *
 * @param file The Zip file to extract
 * @returns A Map of filename to file
 */
export const extractZip = async (file: Blob): Promise<Record<string, string>> => {
	const result: { [filename: string]: string } = {};
	const zip = await JSZip.loadAsync(file);
	for (const filename of Object.keys(zip.files)) {
		await zip.files[filename].async('string').then((data) => {
			if (!filename.endsWith('/')) result[filename] = data;
		});
	}
	return result;
};

/**
 * Add the filesystems's files to a JSZip instance
 *
 * @param zip The JSZip instance
 * @param state The filesystem to download
 * @returns The JSZip instance populated with the filesystem's files
 */
const createZip = (zip: JSZip, state: Filesystem) => {
	// Create a zip from the file system by traversing it.
	for (const [name, file] of Object.entries(state)) {
		if (file.type === 'file') {
			zip.file(name, file.value);
		} else {
			const folder = zip.folder(name);
			if (folder) createZip(folder, file.children);
		}
	}
	return zip;
};

/**
 * Download the entire filesystem as a ZIP
 */
export const exportFilesystem = (): void => {
	const zip = createZip(new JSZip(), get(filesystem));

	zip.generateAsync({ type: 'blob' }).then(function (content) {
		saveAs(content, 'application.zip');
	});
};
