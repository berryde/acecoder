import { writable } from 'svelte/store';
import type { File } from '../types';
import type { WorkerResponse } from '../types';

/**
 * The most recent compilation of the application's files.
 */
export const compiled = writable<WorkerResponse>();

/**
 * Gets the last segment of the path.
 *
 * @param path The path to trim
 * @returns The last segment of the path
 */
export const tail = (path: string): string => {
	if (path.includes('/')) {
		const split = path.split('/');
		return split[split.length - 1];
	}
	return path;
};

/**
 *
 * @param file The file without an extension to resolve
 * @param files The filesystem
 */
export const resolveExtension = (file: string, files: { [key: string]: File }): string => {
	if (file in files) {
		return file;
	}
	return Object.keys(files).find((f) => {
		const split = f.split('.');
		// Remove the file extension
		split.pop();
		return file == split.join('.');
	});
};

/**
 *
 * @param importee The file being imported
 * @param importer The file doing the importing
 * @returns The resolved filename if it exists, else an error will be thrown
 */
export const resolveRelativePath = (
	importee: string,
	importer: string,
	files: { [key: string]: File }
): string => {
	console.log('Resolving relative path', importee, importer);
	let resolved: string;
	// If the importer is in the top level directory then the import is not actually relative.
	if (!importer.includes('/')) {
		resolved = importee.slice(2);
	}
	// Check if it's a same directory import (../)
	else if (/\.\.\/[^/]*/g.test(importee)) {
		// If there are more segments in the importee than in the importer, throw an error
		const parents = importee.match(/\.\.\//g) || [];

		// Get the filename of the importee (everything after the last slash)
		const filename = importee.split('/')[importee.split('/').length - 1];

		const split = importer.split('/');
		console.log(parents, filename, split);

		if (parents.length > split.length - 1) {
			throw 'Could not resolve relative import ' + importee + ' from ' + importer;
		}

		resolved = split.slice(0, split.length - parents.length - 1).join('/') + '/' + filename;
	}
	// It's a parent directory import (../)
	else {
		// Remove the importer filename from the importer path
		const split = importer.split('/');
		split.pop();

		// Return the parent directory of the importer plus the filename of the importee.
		resolved = split.join('/') + importee.slice(1, importee.length);
	}

	if (resolved) {
		// Ensure that the extension is added incase it is omitted.
		resolved = resolveExtension(resolved, files);

		if (resolved in files) {
			return resolved;
		}
	}

	throw 'File ' + resolved + ' does not exist';
};
