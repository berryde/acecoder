import type { File } from '../types';
import type { Plugin } from 'rollup';
import { transform } from '@babel/standalone';

const CDN_URL = 'https://cdn.skypack.dev';

export const resolveRelativePath = (importee: string, importer: string) => {
	// Remove the filename (anything after the last /) to resolve relative imports.
	const split = importer.split('/');
	split.pop();
	const filename = importee.slice(1, importee.length);
	const result = split.join('/') + filename;
	console.log('Created relative import', result);
	return result;
};

/**
 * A rollup plugin wrapper for babel standalone to transpile JSX and typescript in the browser.
 * @param files A map of filename to file data.
 * @returns A rollup plugin.
 */
export default function babel(files: Map<string, File>): Plugin {
	return {
		name: 'babel-standalone',
		/**
		 * Resolves the filename or URL for an imported resource.
		 *
		 * @param importee The imported resource.
		 * @param importer The file importing the resource.
		 * @returns The resolved filename/URL.
		 */
		async resolveId(importee: string, importer: string) {
			console.log('Resolving', importee);
			// Check if the import refers to another source file, else it's a node module.
			if (files.has(importee)) {
				return importee;
			}
			if (importee.startsWith('./')) {
				return resolveRelativePath(importee, importer);
			}
			// Otherwise it will be a node module.
			return {
				id: `${CDN_URL}/${importee}`,
				external: true
			};
		},
		/**
		 * Loads the source for a requested file/module.
		 *
		 * @param id The file/module name.
		 * @returns The source for the requested file/module.
		 */
		async load(id) {
			// Check if the import refers to another source file, else it's a node module.
			if (files.has(id)) {
				return files.get(id).code;
			}
		},
		/**
		 * Rollup transform using babel to transpile JSX & typescript.
		 *
		 * @param code The file source.
		 * @param id The filename.
		 * @returns Transpiled source
		 */
		async transform(code, id) {
			// Babel options: https://babeljs.io/docs/en/options

			// We only want to babel transform tsx, ts, js and jsx files.
			if (/.*\.(js|ts)x?/.test(id)) {
				console.log('Using babel to transform', id);
				const options = {
					filename: id,
					presets: ['react']
				};
				const transformed = transform(code, options);

				return {
					code: transformed.code,
					map: transformed.map
				};
			}
		}
	};
}
