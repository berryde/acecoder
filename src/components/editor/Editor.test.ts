import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import Editor from './Editor.svelte';

describe('The Editor component', () => {
	it('renders when selected', () => {
		const { getByText } = render(Editor, {
			props: {
				language: 'jsx',
				selected: true,
				initialValue: 'Testing',
				filename: 'index.jsx'
			}
		});
		expect(getByText('Testing')).toBeVisible();
	});
	it('is hidden when unselected', () => {
		const { container } = render(Editor, {
			props: {
				language: 'jsx',
				selected: false,
				initialValue: 'Testing',
				filename: 'index.jsx'
			}
		});
		expect(container.getElementsByClassName('editor')[0]).toHaveClass('hidden');
	});
	it('displays the initial value', () => {
		const { getByText } = render(Editor, {
			props: {
				language: 'jsx',
				selected: true,
				initialValue: 'Testing',
				filename: 'index.jsx'
			}
		});
		expect(getByText('Testing')).toBeInTheDocument();
	});
});
