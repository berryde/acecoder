import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/svelte';
import type { WorkerError } from 'src/utils/types';
import Error from './Error.svelte';

describe('The SidebarItem component', () => {
	it('displays the provided error', () => {
		const error: WorkerError = {
			location: 'test.jsx',
			message: 'Something went wrong',
			name: 'TestError',
			pos: 0
		};
		render(Error, {
			props: {
				error: error
			}
		});
		expect(screen.getByText('TestError')).toBeInTheDocument();
		expect(screen.getByText('Something went wrong')).toBeInTheDocument();
	});
	it('closes when the close button is clicked', async () => {
		const error: WorkerError = {
			location: 'test.jsx',
			message: 'Something went wrong',
			name: 'TestError',
			pos: 0
		};
		render(Error, {
			props: {
				error: error
			}
		});
		const closeButton = screen.getByTestId('close-error');
		expect(screen.getByText('TestError')).toBeInTheDocument();
		expect(screen.getByText('Something went wrong')).toBeInTheDocument();
		fireEvent.click(closeButton);
		await new Promise((r) => setTimeout(r, 1000));
		expect(screen.queryByText('TestError')).not.toBeInTheDocument();
	});
});
