import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import { createFile } from 'src/utils/filesystem/filesystem';
import { openTab, selectedTab } from 'src/utils/tabs/tabs';
import Editor from './Editor.svelte';

describe('The Editor component', () => {
	it('renders', () => {
		createFile('test.tsx');
		const { container } = render(Editor, {
			filename: 'test.tsx',
			visible: true
		});
		expect(container.getElementsByClassName('cm-editor').length).toBe(1);
	});
	it('changes content when the selected tab changes', () => {
		createFile('test.jsx', 'Testing');
		createFile('hello.jsx', 'Hello');
		selectedTab.set('test.jsx');

		const { getByText, rerender } = render(Editor, {
			filename: 'test.jsx',
			visible: true
		});
		expect(getByText('Testing')).toBeInTheDocument();
		openTab('hello.jsx');

		rerender({
			filename: 'hello.jsx',
			visible: true
		});

		expect(getByText('Hello')).toBeInTheDocument();
	});
	it('displays the value of the selected tab', () => {
		createFile('index.jsx', 'Testing');
		selectedTab.set('index.jsx');
		const { getByText } = render(Editor, {
			filename: 'index.jsx',
			visible: true
		});
		expect(getByText('Testing')).toBeInTheDocument();
	});
});
