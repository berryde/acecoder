import 'svelte';
import '@testing-library/jest-dom';
import Error from './Error.svelte';
import { render } from '@testing-library/svelte';
import { fireEvent } from '@testing-library/dom';

describe('The exercise error component', () => {
	it('renders the provided message', () => {
		const { getByText } = render(Error, {
			props: {
				message: 'Something went wrong'
			}
		});
		expect(getByText('Something went wrong')).toBeInTheDocument();
	});
	it('only shows the first line by default', () => {
		const { getByText } = render(Error, {
			props: {
				message: 'Something went wrong.\n Please try again later'
			}
		});
		expect(getByText('Something went wrong.')).toBeInTheDocument();
	});
	it('shows the full message on click', async () => {
		const { getByText, findByText } = render(Error, {
			props: {
				message: 'Something went wrong.\n Please try again later'
			}
		});
		const message = getByText('Something went wrong.');
		fireEvent.click(message);
		expect(await findByText('Something went wrong. Please try again later')).toBeInTheDocument();
	});
});
