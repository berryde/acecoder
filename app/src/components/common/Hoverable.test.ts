import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import Hoverable from './Hoverable.svelte';

describe('The Hoverable component', () => {
	it('renders', () => {
		expect(render(Hoverable)).toBeTruthy();
	});
});
