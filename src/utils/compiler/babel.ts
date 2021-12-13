import type { File } from '../types';
import type { Plugin } from 'rollup';
import { transform } from '@babel/standalone';
import { resolveRelativePath } from './compiler';
const CDN_URL = 'https://cdn.skypack.dev';

/**
 * A rollup plugin wrapper for babel standalone to transpile JSX and typescript in the browser.
 * @param files A map of filename to file data.
 * @returns A rollup plugin.
 */
export default function babel(
	files: { [key: string]: File },
	dependencies: Record<string, string>
): Plugin {
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
			// Check if the import refers to another source file, else it's a node module.
			if (importee in files) {
				return importee;
			}

			// Check if it's a relative import
			else if (/(\.\/|(\.\.\/)+)[^/]*/g.test(importee)) {
				// If it has a file extension
				try {
					return resolveRelativePath(importee, importer, files);
				} catch (err) {
					this.warn({
						message: `Failed to resolve file ${importee} from ${importer}. Check that this file exists.`,
						pos: 0,
						id: importer,
						name: 'FileNotFoundError'
					});
				}
			}

			// It's a node module. Get the version from dependencies. If the requested dependency is not present, throw an error.
			const version = dependencies[importee];
			if (version) {
				return {
					id: `${CDN_URL}/${importee}@${version}`,
					external: true
				};
			} else {
				this.warn({
					message: `Failed to resolve dependency ${importee} from ${importer}. Check that this dependency is present in your package.json file.`,
					pos: 0,
					id: importer,
					name: 'DependencyError'
				});
			}
		},

		/**
		 * Loads the source for a requested file/module.
		 *
		 * @param id The file/module name.
		 * @returns The source for the requested file/module.
		 */
		async load(id) {
			// Check if the import refers to another source file, else it's a node module.
			return files[id].code;
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
				const options = {
					filename: id,
					presets: ['react', 'typescript']
				};
				try {
					const transformed = transform(code, options);
					return {
						code: transformed.code,
						map: transformed.map
					};
				} catch (err) {
					this.warn(err);
					return {
						code: null,
						map: null
					};
				}
			}
		}
	};
}
