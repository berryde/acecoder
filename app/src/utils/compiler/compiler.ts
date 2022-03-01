import { writable } from 'svelte/store';
import type { File } from '~shared/types';
import type { WorkerResponse } from '~shared/types';
import type { RollupWarning, Plugin } from 'rollup';
import reactCompiler from './react';
import cssCompiler from './css';
import svelteCompiler from './svelte';

/**
 * The most recent compilation of the application's files.
 */
export const compiled = writable<WorkerResponse | undefined>();
export const CDN_URL = 'https://cdn.skypack.dev';
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
export const resolveExtension = (
	file: string,
	files: { [key: string]: File }
): string | undefined => {
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
	let resolved: string | undefined;
	// If the importer is in the top level directory then the import is not actually relative.
	if (!importer.includes('/')) {
		resolved = importee.slice(2);
	}
	// Check if it's a parent directory import (../)
	else if (/\.\.\/[^/]*/g.test(importee)) {
		// If there are more segments in the importee than in the importer, throw an error
		const parents = importee.match(/\.\.\//g) || [];

		// Get the absolute component of the importee (everything after the last ../)
		const filename = importee.split('../')[importee.split('../').length - 1];

		const split = importer.split('/');

		if (parents.length > split.length - 1) {
			throw Error(`Could not resolve relative import ${importee} from ${importer}`);
		}

		// ../components/Search from src/containers/CryptoChecker.tsx
		// 1] go up as many times as there are ../
		// 2] append everything after the last ../

		resolved = split.slice(0, split.length - parents.length - 1).join('/') + '/' + filename;
	}
	// It's a same directory import (./)
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

		if (resolved && resolved in files) {
			return resolved;
		}
	}

	throw 'File ' + resolved + ' does not exist';
};

/**
 * Use a regular expression to check if the importee is a relative import.
 *
 * @param importee The importee to check
 * @returns Whether this importee is a relative import
 */
export const isRelativeImport = (importee: string): boolean => {
	return /(\.\/|(\.\.\/)+)[^/]*/g.test(importee);
};

/**
 * An error thrown when an imported source file cannot be resolved.
 *
 * @param importee The file being imported
 * @param importer The file doing the importing
 * @returns An error with the provided details
 */
export const fileNotFoundError = (importee: string, importer: string): RollupWarning => ({
	message: `Failed to resolve file ${importee} from ${importer}. Check that this file exists.`,
	pos: 0,
	id: importer,
	name: 'FileNotFoundError'
});

/**
 * Extracts the dependencies from a package json file.
 *
 * @param packageJSON The JSON parsed package json file.
 * @returns The union of the dev and standard dependencies.
 */
export const getDependencies = (packageJSON: {
	devDependencies: Record<string, string> | undefined;
	dependencies: Record<string, string> | undefined;
}): Record<string, string> => {
	let result = {};
	if (packageJSON.devDependencies) {
		result = { ...packageJSON.devDependencies };
	}
	if (packageJSON.dependencies) {
		result = { ...packageJSON.dependencies };
	}
	return result;
};

/**
 * Resolve the correct rollup plugin from the provided configuration
 *
 * @param framework The framework being used
 * @param files The files submitted
 * @param dependencies Dependencies extracted from the `package.json`
 * @returns A rollup plugin
 */
export const getPlugins = (
	framework: string,
	files: { [key: string]: File },
	dependencies: Record<string, string>
): Plugin[] => {
	switch (framework) {
		case 'svelte':
			return [svelteCompiler(files, dependencies)];
		case 'react':
			return [reactCompiler(files, dependencies), cssCompiler(files)];
		default:
			return [];
	}
};
