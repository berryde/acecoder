import 'svelte';
import '@testing-library/jest-dom';
import Input from './Input.svelte';
import { render } from '@testing-library/svelte';

describe('The Input component', () => {
	it('displays the placeholder text', () => {
		const { container } = render(Input, {
			props: {
				placeholder: 'test text'
			}
		});

		expect(container.querySelector('[placeholder="test text"]')).toBeTruthy();
	});
});
