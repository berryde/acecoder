import type { File, WorkerErrorRaw, WorkerResponse } from '../types';
import * as rollup from 'rollup/dist/es/rollup.browser.js';
import babel from './babel';
import css from './css';

const filesystem: { [key: string]: File } = {};

function generateLookup(files: File[]): void {
	files.forEach((file) => {
		filesystem[file.name] = file;
	});
}

self.addEventListener('message', async (event: MessageEvent<File[]>): Promise<void> => {
	// Recreate the filesystem in memory.
	generateLookup(event.data);
	var error: WorkerErrorRaw;

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

		let output: WorkerResponse;
		// Rollup the files.
		try {
			const result = await rollup.rollup({
				input: entryPoint,
				plugins: [css(filesystem), babel(filesystem)],
				inlineDynamicImports: true,
				onwarn(warning: WorkerErrorRaw) {
					// The warning will be a stack trace from babel. Passing it into a new error loses information so it is stored in a variable.
					error = warning;
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
			const raw = error;
			const metadata = JSON.parse(JSON.stringify(error));
			const firstLine = raw.stack.split('\n')[0];
			output = {
				js: '',
				css: '',
				public: {},
				error: {
					raw: raw,
					metadata: metadata,
					title: firstLine.split(':')[0],
					subtitle: firstLine.substring(firstLine.indexOf(':') + 1)
				}
			};
		}
		self.postMessage(output);
	}
});
