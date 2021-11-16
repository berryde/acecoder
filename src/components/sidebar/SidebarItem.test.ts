import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/svelte';
import SidebarItem from './SidebarItem.svelte';

describe('The SidebarItem component', () => {
	it('displays the provided title', () => {
		render(SidebarItem, {
			props: {
				title: 'test'
			}
		});
		expect(screen.getByText('test')).toBeInTheDocument();
	});
});
