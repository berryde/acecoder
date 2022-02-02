import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import Editor from './Editor.svelte';

describe('The Editor component', () => {
	it('renders', () => {

		render(Editor);
	});

});
