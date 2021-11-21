import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Sidebar from './Sidebar.svelte';

describe('The sidebar component', () => {
	it('Shows the correct options', () => {
		render(Sidebar);
		expect(screen.getByTestId('settings')).toBeInTheDocument();
		expect(screen.getByTestId('explorer')).toBeInTheDocument();
	});
	it('fires the select event when an option is selected', async () => {
		const { component } = render(Sidebar);
		const handler = jest.fn();
		component.$on('select', handler);
		const settings = screen.getByTestId('settings');
		fireEvent.click(settings);
		expect(await handler).toBeCalledTimes(1);
	});
	it('fires the collapse event when a selected option is selected', async () => {
		const { component } = render(Sidebar);
		const handler = jest.fn();
		component.$on('collapse', handler);
		const settings = screen.getByTestId('settings');
		fireEvent.click(settings);
		fireEvent.click(settings);
		expect(await handler).toBeCalledTimes(1);
	});
});
