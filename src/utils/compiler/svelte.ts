import type { Plugin } from 'rollup';
import type { File } from '../types';
import { resolveRelativePath, fileNotFoundError, isRelativeImport, CDN_URL } from './compiler';

/**
 * A browser-based rollup plugin for compiling svelte.
 * @returns A rollup plugin providing CSS support.
 */
export default function svelteCompiler(
	files: { [key: string]: File },
	dependencies: Record<string, string>
): Plugin {
	// Import the svelte compiler from a CDN so that the worker can access it.
	importScripts(`https://cdn.jsdelivr.net/npm/svelte/compiler.js`);
	return {
		name: 'folio-svelte',
		/**
		 * Determine absolute path from relative paths for in memory files.
		 * @param importee The file being imported
		 * @param importer The file doing the importing
		 * @returns
		 */
		async resolveId(importee, importer) {
			// Handle svelte imports
			if (importee === 'svelte' || importee.startsWith('svelte/'))
				return {
					id: `${CDN_URL}/${importee}`,
					external: true
				};

			// Check if the import refers to another source file
			if (importee in files) {
				return importee;
			}

			// Check if it's a relative import to another source file
			else if (isRelativeImport(importee)) {
				try {
					return resolveRelativePath(importee, importer, files);
				} catch (err) {
					this.warn(fileNotFoundError(importee, importer));
				}
			}

			// Try to resolve this import as a node module
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
		 * Load files from our in-memory file system.
		 * @param id
		 * @returns
		 */
		async load(id) {
			if (id in files) {
				return files[id].code;
			}
		},

		/**
		 * Custom transform to compile svelte files.
		 * @param code The input svelte files.
		 * @param id The filename.
		 * @returns The processed svelte code.
		 */
		async transform(code, id) {
			if (/.*\.svelte/.test(id)) {
				try {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					return svelte.compile(code).js.code;
				} catch (err) {
					throw 'Unable to compile svelte code.';
				}
			}
		}
	};
}
