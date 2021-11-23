import type { Plugin } from 'rollup';
import type { File } from '../types';
import { resolveRelativePath } from './babel';

/**
 * A browser port of rollup-plugin-import-css.
 * @returns A rollup plugin providing CSS support.
 */
export default function css(files: { [key: string]: File }): Plugin {
	const styles = {};
	return {
		name: 'import-css',
		/**
		 * Determine absolute path from relative paths for in memory files.
		 * @param importee The file being imported
		 * @param importer The file doing the importing
		 * @returns
		 */
		async resolveId(importee, importer) {
			if (/.*\.css/.test(importee)) {
				if (importee.startsWith('./')) {
					return resolveRelativePath(importee, importer);
				}
				return importee;
			}
			return null;
		},
		/**
		 * Load a CSS file from our in-memory file system.
		 * @param id
		 * @returns
		 */
		async load(id) {
			if (/.*\.css/.test(id)) {
				if (id in files) {
					return files[id].code;
				}
			}
			return null;
		},
		/**
		 * Custom transform to handle CSS files.
		 * @param code The input CSS code
		 * @param id The filename
		 * @returns Minified CSS as a string in JS.
		 */
		async transform(code, id) {
			if (/.*\.css/.test(id)) {
				const minified = minifyCSS(code);
				if (!styles[id] || styles[id] != minified) {
					styles[id] = minified;
				}

				return {
					code: `export default ${JSON.stringify(minified)};`,
					map: { mappings: '' }
				};
			}
		},
		/**
		 * Concatenates all minified CSS into a single file.
		 */
		async generateBundle() {
			const css = Object.entries(styles)
				.map(([_, code]) => code)
				.join('\n');
			this.emitFile({ type: 'asset', fileName: `styles.css`, source: css });
		}
	};
}

/**
 * Minifies CSS to reduce bundle size.
 * From https://github.com/jleeson/rollup-plugin-import-css/blob/master/src/index.js.
 * @param content The CSS to minify
 * @returns Minified CSS
 */
function minifyCSS(content: string) {
	content = content.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, '');
	content = content.replace(/ {2,}/g, ' ');
	content = content.replace(/ ([{:}]) /g, '$1');
	content = content.replace(/([{:}]) /g, '$1');
	content = content.replace(/([;,]) /g, '$1');
	content = content.replace(/ !/g, '!');
	return content;
}
