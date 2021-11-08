import type { File, WorkerResponse } from '../types';
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

		// Rollup the files.
		const result = await rollup.rollup({
			input: entryPoint,
			plugins: [css(filesystem), babel(filesystem)]
		});

		// Generate an esm bundle from the result.
		const bundle = await result.generate({ format: 'esm' });

		// The JS bundle is URI encoded so that we can import() it to run it in the browser.
		let scripts = bundle.output[0] ? bundle.output[0].code : '';
		scripts = 'data:text/javascript;charset=utf-8,' + encodeURIComponent(scripts);

		const styles = bundle.output[1] ? bundle.output[1].source : '';
		const publicResources = Object.fromEntries(
			Object.entries(filesystem)
				.filter(([path, value]) => path.startsWith('public'))
				.map(([path, value]) => [path, value.code])
		);

		const output: WorkerResponse = {
			js: scripts,
			css: styles,
			public: publicResources
		};

		// Return the bundle.
		self.postMessage(output);
	}
});
