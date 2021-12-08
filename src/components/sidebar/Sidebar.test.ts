import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/svelte';
import type { SidebarTab } from 'src/utils/types';
import Sidebar from './Sidebar.svelte';
import IoIosFiling from 'svelte-icons/io/IoIosFiling.svelte';
import Settings from '../settings/Settings.svelte';

const sidebarTabs: SidebarTab[] = [
	{
		name: 'explorer',
		icon: IoIosFiling,
		component: Settings
	},
	{
		name: 'feedback',
		icon: IoIosFiling,
		component: Settings
	},
	{
		name: 'settings',
		icon: IoIosFiling,
		component: Settings
	}
];

describe('The sidebar component', () => {
	it('Shows the correct options', () => {
		render(Sidebar, {
			props: {
				tabs: sidebarTabs,
				selected: 0,
				collapsed: false
			}
		});
		expect(screen.getByTestId('settings')).toBeInTheDocument();
		expect(screen.getByTestId('explorer')).toBeInTheDocument();
	});
	it('fires the select event when an option is selected', async () => {
		const { component } = render(Sidebar, {
			props: {
				tabs: sidebarTabs,
				selected: 0,
				collapsed: false
			}
		});
		const handler = jest.fn();
		component.$on('select', handler);
		const settings = screen.getByTestId('settings');
		fireEvent.click(settings);
		expect(handler).toBeCalledTimes(1);
	});
	it('fires the collapse event when a selected option is selected', async () => {
		const { component } = render(Sidebar, {
			props: {
				tabs: sidebarTabs,
				selected: 0,
				collapsed: false
			}
		});
		const handler = jest.fn();
		component.$on('collapse', handler);
		const settings = screen.getByTestId('settings');
		fireEvent.click(settings);
		fireEvent.click(settings);
		expect(handler).toBeCalledTimes(1);
	});
});
