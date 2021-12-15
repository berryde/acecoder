import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import type { WorkerResponse } from 'src/utils/types';
import Preview from './Preview.svelte';
import { compiled } from 'src/utils/compiler/compiler';

global.window = Object.create(window);
const url = 'http://test.com';
Object.defineProperty(window, 'location', {
	value: {
		href: url
	}
});

describe('The Preview component', () => {
	it('renders', async () => {
		compiled.set({
			public: {
				'public/index.html':
					'<div class="flex justify-center items-center text-white rounded h-10 bg-blue-500 p-5"><p>Hello, world!</p></div>'
			},
			js: '',
			css: ''
		});
		const { getByTestId } = render(Preview);
		expect(getByTestId('preview')).toBeInTheDocument();
	});
	it('shows the error screen if an error is provided', async () => {
		compiled.set({
			public: {
				'public/index.html':
					'<div class="flex justify-center items-center text-white rounded h-10 bg-blue-500 p-5"><p>Hello, world!</p></div>'
			},
			js: '',
			css: ''
		});
		const { findByText } = render(Preview, {
			error: {
				location: 'index.tsx',
				pos: 0,
				message: 'Something went wrong',
				name: 'TestError'
			}
		});
		expect(await findByText('Something went wrong')).toBeInTheDocument();
	});
});
