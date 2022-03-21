import 'svelte';
import '@testing-library/jest-dom';
import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import Icon from './Icon.svelte';

describe('The icon component', () => {
	it('renders a label when provided', async () => {
		render(Icon, {
			props: {
				label: 'Hello world',
				testId: 'test-icon'
			}
		});
		fireEvent.mouseEnter(screen.getByTestId('hoverable'));
		await waitFor(() => screen.getByRole('tooltip'));
		expect(screen.getByText('Hello world', { exact: false })).toBeInTheDocument();
	});
	it('emits a click event on click when using the button variant', () => {
		const { getByTestId, component } = render(Icon, {
			button: true,
			testId: 'test-button'
		});
		const handleClick = jest.fn();
		component.$on('click', handleClick);

		const button = getByTestId('test-button');
		fireEvent.click(button);

		expect(handleClick).toBeCalledTimes(1);
	});
});
