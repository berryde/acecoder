import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/svelte';
import { latestError } from '../../utils/console/console';
import Tabs from './Tabs.svelte';

describe('The Tabs component', () => {
	it('displays the provided tabs', () => {
		const tabs: string[] = ['index.tsx', 'package.json'];
		const selected = 'index.tsx';
		const unsaved: string[] = ['index.tsx'];
		render(Tabs, {
			props: {
				tabs: tabs,
				selected: selected,
				unsaved: unsaved,
				temporary: false
			}
		});
		expect(screen.getByText('index.tsx')).toBeInTheDocument();
		expect(screen.getByText('package.json')).toBeInTheDocument();
	});
	it('displays a dot for unsaved tabs', () => {
		const tabs: string[] = ['index.tsx', 'package.json'];
		const selected = 'index.tsx';
		const unsaved: string[] = ['index.tsx'];
		render(Tabs, {
			props: {
				tabs: tabs,
				selected: selected,
				unsaved: unsaved,
				temporary: false
			}
		});
		expect(screen.getByTestId('unsaved-dot')).toBeInTheDocument();
	});
	it('displays tabs in error with red text', () => {
		latestError.set({
			location: 'index.tsx',
			message: 'Something went wrong',
			name: 'TestError',
			pos: 0
		});
		const tabs: string[] = ['index.tsx', 'package.json'];
		const selected = 'index.tsx';
		const unsaved: string[] = ['index.tsx'];
		render(Tabs, {
			props: {
				tabs: tabs,
				selected: selected,
				unsaved: unsaved,
				temporary: false
			}
		});
		expect(screen.getByText('index.tsx').parentElement).toHaveClass('text-red-400');
	});
});
