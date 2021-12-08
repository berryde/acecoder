import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import { createFile } from 'src/utils/filesystem/filesystem';
import { selectedTab } from 'src/utils/tabs/tabs';
import Editor from './Editor.svelte';

jest.mock('$app/navigation.js', () => ({
	goto: jest.fn()
}));

describe('The Editor component', () => {
	it('renders', () => {
		const { container } = render(Editor);
		expect(container.getElementsByClassName('cm-editor').length).toBe(1);
	});
	it('changes content when the selected tab changes', () => {
		createFile('test.jsx', 'Testing');
		createFile('hello.jsx', 'Hello');
		selectedTab.set('test.jsx');

		const { getByText } = render(Editor);
		expect(getByText('Testing')).toBeInTheDocument();
		selectedTab.set('hello.jsx');
		expect(getByText('Hello')).toBeInTheDocument();
	});
	it('displays the value of the selected tab', () => {
		createFile('index.jsx', 'Testing');
		selectedTab.set('index.jsx');
		const { getByText } = render(Editor);
		expect(getByText('Testing')).toBeInTheDocument();
	});
});
