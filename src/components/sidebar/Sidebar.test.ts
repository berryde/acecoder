import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Sidebar from './Sidebar.svelte';

describe('The sidebar component', () => {
	it('Shows the correct options', () => {
		render(Sidebar);
		expect(screen.getByTestId('settings')).toBeInTheDocument();
		expect(screen.getByTestId('explorer')).toBeInTheDocument();
	});
	it('renders the settings when selected', async () => {
		render(Sidebar);
		const settings = screen.getByTestId('settings');
		fireEvent.click(settings);
		expect(await screen.findByText('settings')).toBeInTheDocument();
	});
});
