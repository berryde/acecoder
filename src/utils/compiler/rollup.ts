import type { File, WorkerResponse } from '../types';
import * as rollup from 'rollup/dist/es/rollup.browser.js';
import babel from './babel';
import css from './css';

const fileLookup: Map<string, File> = new Map();

function generateLookup(files: File[]): void {
	files.forEach((file) => {
		fileLookup.set(file.name, file);
	});
}

self.addEventListener('message', async (event: MessageEvent<File[]>): Promise<void> => {
	console.log('Received event: ', event.data);
	// Read the package.json file.
	const packageJSON = JSON.parse(event.data.filter((file) => file.name == 'package.json')[0].code);
	const entryPoint = packageJSON['main'];

	// Javascript files need to be converted into a JS bundle.
	// All CSS files should be merged into a css bundle

	generateLookup(event.data);
	console.log('Created file system', fileLookup);
	const bundle = await rollup.rollup({
		input: entryPoint,
		plugins: [css(fileLookup), babel(fileLookup)]
	});

	const result = await bundle.generate({ format: 'esm' });
	console.log('Completed bundling', result);
	const output: WorkerResponse = {
		js: result.output[0].code,
		css: result.output[1].source
	};

	self.postMessage(output);
});
