import 'svelte';
import '@testing-library/jest-dom';
import ExplorerInput from './ExplorerInput.svelte';
import { render } from '@testing-library/svelte';
import { fireEvent } from '@testing-library/dom';

describe('The ExplorerInput component', () => {
	it('renders with the initial value', () => {
		const { getByTestId } = render(ExplorerInput, {
			props: {
				initialValue: 'hello world'
			}
		});
		const input = getByTestId('explorer-input') as HTMLInputElement;
		expect(input.value).toBe('hello world');
	});
	it('using a reserved name value should cause the error to be visible', async () => {
		const { findByTestId, findByText } = render(ExplorerInput, {
			props: {
				reservedNames: ['test']
			}
		});

		const input = (await findByTestId('explorer-input')) as HTMLInputElement;
		fireEvent.input(input, { target: { value: 'test' } });

		expect(
			await findByText("A file/folder called 'test' already exists in this directory.")
		).toBeInTheDocument();
	});
});
