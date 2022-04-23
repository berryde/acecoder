import type { File, FSFile, WorkerError, WorkerResponse } from '~shared/types';
import * as rollup from 'rollup/dist/es/rollup.browser.js';
import type { RollupWarning } from 'rollup';
import { getDependencies, getPlugins } from './compiler';

const PACKAGE = 'package.json';

/**
 * Returns some error data to the live preview iframe in the application
 *
 * @param message The error message
 * @param name The title to show for this error
 * @param pos The character position in the source file where the error occurred.
 * @param location The file name of the source file where the error occurred.
 */
const createError = (message: string, name = 'Error', pos = 0, location = ''): WorkerResponse => {
	return {
		js: '',
		css: '',
		public: {},
		error: {
			location: location,
			message: message,
			name: name,
			pos: pos
		}
	};
};

// Listen for post events with new files
self.addEventListener(
	'message',
	async (
		event: MessageEvent<{ language: string; files: Record<string, FSFile> }>
	): Promise<void> => {
		// Recreate the filesystem in memory.
		const { files } = event.data;

		// If there is no package.json, attempt to serve a static page.
		if (!(PACKAGE in files)) {
			return self.postMessage({
				js: '',
				css: ''
			});
		}

		// Read the package JSON file
		const packageJSON = JSON.parse(files[PACKAGE].value);
		const entryPoint = packageJSON['main'];

		// Throw an error if no entry point is specified
		if (!entryPoint) {
			return self.postMessage(
				createError(
					"No entry point was specified in the application's package.json file. Ensure there is an entry 'main' pointing to your entry point.",
					'EntryPointMissingError',
					0,
					PACKAGE
				)
			);
		}

		// Throw an error if the specified entry point does not exist
		if (!(entryPoint in files)) {
			return self.postMessage(
				createError(
					"The specified entry point '" + entryPoint + "' could not be found in the file system.",
					'EntryPointNotFoundError',
					0,
					PACKAGE
				)
			);
		}

		// Return the bundled code
		return self.postMessage(
			await bundle(entryPoint, event.data.language, files, getDependencies(packageJSON))
		);
	}
);

/**
 * Use Rollup to bundle the provided code with the given configuration
 *
 * @param entryPoint The filename of the entry point
 * @param language The language of the submission
 * @param filesystem The files of the submission
 * @param dependencies Any dependencies extracted from `package.json`
 * @returns The bundled source code as a promise
 */
const bundle = async (
	entryPoint: string,
	language: string,
	filesystem: Record<string, File>,
	dependencies: Record<string, string>
): Promise<WorkerResponse> => {
	let warning: RollupWarning = { message: '' };

	try {
		// Bundle the files using rollup.
		const result = await rollup.rollup({
			input: entryPoint,
			plugins: getPlugins(language, filesystem, dependencies),
			inlineDynamicImports: true,
			onwarn(_warning: RollupWarning) {
				// Store the warning from rollup to return to the user
				warning = _warning;
				throw new Error('Rollup failed to execute');
			}
		});

		// Create the bundle and extract the relevant content
		const bundle = await result.generate({ format: 'esm' });

		// Extract any stylesheets from the bundle
		const css = bundle.output.find((e: { name: string }) => e.name == 'css');

		return {
			js: bundle.output[0] ? bundle.output[0].code : '',
			css: css ? css.source + '\n' : '',
			public: getResources(filesystem)
		};
	} catch (e) {
		if (warning.message === '') warning = sanitizeError(e as Error, entryPoint);
		return createError(warning.message, warning.name, warning.pos, warning.id);
	}
};

/**
 * Gets the text content of all resources in the public directory.
 *
 * @param filesystem The filesystem to search
 * @returns A map of public resources
 */
const getResources = (filesystem: Record<string, File>): Record<string, string> => {
	return Object.fromEntries(
		Object.entries(filesystem)
			.filter((entry) => entry[0].startsWith('public'))
			.map(([path, value]) => [path, value.value])
	);
};

/**
 * Sanitizes an error by removing compiler information.
 *
 * @param e The error to sanitize
 * @param entryPoint The entry point as specified in the package.json file
 * @returns The sanitized error
 */
const sanitizeError = (e: Error, entryPoint: string) => {
	if (
		e.message.endsWith(
			'Make sure you supply a plugin with custom resolveId and load hooks to Rollup.'
		)
	) {
		e.message.substring(0, e.message.length - 169);
	}
	return {
		location: entryPoint,
		message: e.message,
		name: e.name,
		pos: 0
	};
};
