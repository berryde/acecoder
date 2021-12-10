import 'svelte';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/svelte';
import Icon from './Icon.svelte';

describe('The icon component', () => {
	it('renders a label when provided', () => {
		const { getByText } = render(Icon, {
			props: {
				label: 'Hello world'
			}
		});
		expect(getByText('Hello world')).toBeInTheDocument();
	});
	it('emits a click event on click when using the button variant', () => {
		const { getByText, getByTestId, component } = render(Icon, {
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
