import type { File, WorkerError, WorkerResponse } from '../types';
import * as rollup from 'rollup/dist/es/rollup.browser.js';
import type { RollupWarning } from 'rollup';
import { generateLookup, getDependencies, getPlugins } from './compiler';

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

const INDEX = 'public/index.html';
const PACKAGE = 'package.json';

self.addEventListener(
	'message',
	async (event: MessageEvent<{ language: string; files: File[] }>): Promise<void> => {
		// Recreate the filesystem in memory.
		const filesystem = generateLookup(event.data.files);

		// Throw an error if there is no index.html file
		if (!(INDEX in filesystem)) {
			return self.postMessage(
				createError(
					`The file ${INDEX} could not be found. Make sure the file exists in order to render the application.\nFound files: ` +
						JSON.stringify(filesystem),
					'IndexFileNotFoundError'
				)
			);
		}

		// If there is no package.json, attempt to serve a static page.
		if (!(PACKAGE in filesystem)) {
			return self.postMessage({
				js: '',
				css: '',
				public: {
					[INDEX]: filesystem[INDEX].code
				}
			});
		}

		// Read the package JSON file
		const packageJSON = JSON.parse(filesystem[PACKAGE].code);
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
		if (!(entryPoint in filesystem)) {
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
			await bundle(entryPoint, event.data.language, filesystem, getDependencies(packageJSON))
		);
	}
);

const bundle = async (
	entryPoint: string,
	language: string,
	filesystem: Record<string, File>,
	dependencies: Record<string, string>
): Promise<WorkerResponse> => {
	let warning: RollupWarning;
	let error: WorkerError;

	// Bundle the files using rollup.
	try {
		const result = await rollup.rollup({
			input: entryPoint,
			plugins: getPlugins(language, filesystem, dependencies),
			inlineDynamicImports: true,
			onwarn(_warning: RollupWarning) {
				warning = _warning;
				throw new Error();
			}
		});

		// Create the bundle and extract the relevant content
		const bundle = await result.generate({ format: 'esm' });
		const scripts = bundle.output[0] ? bundle.output[0].code : '';
		let styles = '';
		const css = bundle.output.find((e) => e.name == 'css');
		if (css) {
			styles += css.source + '\n';
		}

		return {
			js: scripts,
			css: styles,
			public: getResources(filesystem)
		};
	} catch (e) {
		if (warning) {
			return createError(warning.message, warning.name, warning.pos, warning.id);
		} else {
			error = sanitizeError(e as Error, entryPoint);
			return createError(error.message, error.name, error.pos, error.location);
		}
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
			.map(([path, value]) => [path, value.code])
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
