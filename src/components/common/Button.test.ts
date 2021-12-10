import 'svelte';
import '@testing-library/jest-dom';
import Button from './Button.svelte';
import { render } from '@testing-library/svelte';
import { fireEvent } from '@testing-library/dom';

describe('The Button component', () => {
	it('displays the provided text', () => {
		const { getByText } = render(Button, {
			props: {
				text: 'test button'
			}
		});
		expect(getByText('test button')).toBeInTheDocument();
	});
	it('dispatches a click event on click', () => {
		const { getByText, component } = render(Button, {
			props: {
				text: 'test button'
			}
		});
		const handleClick = jest.fn();
		component.$on('click', handleClick);
		const button = getByText('test button');
		fireEvent.click(button);
		expect(handleClick).toHaveBeenCalledTimes(1);
	});
});
