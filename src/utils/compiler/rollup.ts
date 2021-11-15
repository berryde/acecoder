import type { File, WorkerError, WorkerResponse } from '../types';
import * as rollup from 'rollup/dist/es/rollup.browser.js';
import type { RollupWarning } from 'rollup';
import babel from './babel';
import css from './css';

/**
 * Recreates the in memory filesystem with the given files
 * @param files The files for the filesystem.
 */
function generateLookup(files: File[]): { [key: string]: File } {
	const filesystem = {};
	files.forEach((file) => {
		filesystem[file.name] = file;
	});
	return filesystem;
}

function getDependencies(packageJSON: {
	devDependencies: Record<string, string> | undefined;
	dependencies: Record<string, string> | undefined;
}): Record<string, string> {
	let result = {};
	if (packageJSON.devDependencies) {
		result = { ...packageJSON.devDependencies };
	}
	if (packageJSON.dependencies) {
		result = { ...packageJSON.dependencies };
	}
	return result;
}

self.addEventListener('message', async (event: MessageEvent<File[]>): Promise<void> => {
	// Recreate the filesystem in memory.
	const filesystem = generateLookup(event.data);
	var rollupWarning: RollupWarning;
	if (!('package.json' in filesystem)) {
		const html = 'public/index.html' in filesystem ? filesystem['public/index.html'].code : '';

		self.postMessage({
			js: '',
			css: '',
			html: html
		});
	} else {
		// Read the package JSON file.
		const packageJSON = JSON.parse(filesystem['package.json'].code);
		// Determine the entry point.
		const entryPoint = packageJSON['main'];

		const dependencies = getDependencies(packageJSON);

		let output: WorkerResponse;
		// Rollup the files.
		try {
			const result = await rollup.rollup({
				input: entryPoint,
				plugins: [css(filesystem), babel(filesystem, dependencies)],
				inlineDynamicImports: true,
				onwarn(warning: RollupWarning) {
					// The warning will be a stack trace from babel. Passing it into a new error loses information so it is stored in a variable.
					rollupWarning = warning;
					throw new Error();
				}
			});
			// Generate an esm bundle from the result.
			const bundle = await result.generate({ format: 'esm' });

			const scripts = bundle.output[0] ? bundle.output[0].code : '';

			const styles = bundle.output[1] ? bundle.output[1].source : '';
			const publicResources = Object.fromEntries(
				Object.entries(filesystem)
					.filter(([path, value]) => path.startsWith('public'))
					.map(([path, value]) => [path, value.code])
			);

			output = {
				js: scripts,
				css: styles,
				public: publicResources
			};
		} catch (e) {
			let outputError: WorkerError;
			if (rollupWarning) {
				outputError = {
					location: rollupWarning.id,
					message: rollupWarning.message,
					name: rollupWarning.name,
					pos: rollupWarning.pos
				};
			} else {
				const error = e as Error;
				// Remove the 'no FS in browser' warning from rollup when a file isn't found
				if (
					error.message.endsWith(
						'Make sure you supply a plugin with custom resolveId and load hooks to Rollup.'
					)
				) {
					error.message.substring(0, error.message.length - 169);
				}
				outputError = {
					location: entryPoint,
					message: error.message,
					name: error.name,
					pos: 0
				};
			}

			output = {
				js: '',
				css: '',
				public: {},
				error: outputError
			};
		}
		self.postMessage(output);
	}
});
