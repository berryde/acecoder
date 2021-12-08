import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import type { WorkerResponse } from 'src/utils/types';
import Preview from './Preview.svelte';

jest.mock('$app/navigation.js', () => ({
	goto: jest.fn()
}));

describe('The Preview component', () => {
	it('renders', async () => {
		const compiled: WorkerResponse = {
			public: {
				'public/index.html':
					'<div class="flex justify-center items-center text-white rounded h-10 bg-blue-500 p-5"><p>Hello, world!</p></div>'
			},
			js: '',
			css: ''
		};
		const { getByTestId } = render(Preview, {
			compiled: compiled
		});
		expect(getByTestId('preview')).toBeInTheDocument();
	});
	it('shows the error screen if an error is provided', async () => {
		const compiled: WorkerResponse = {
			public: {
				'public/index.html':
					'<div class="flex justify-center items-center text-white rounded h-10 bg-blue-500 p-5"><p>Hello, world!</p></div>'
			},
			js: '',
			css: ''
		};
		const { findByText } = render(Preview, {
			compiled: compiled,
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
