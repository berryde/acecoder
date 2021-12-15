import { get } from 'svelte/store';
import { closeTab, openTab, renameTab, selectedTab, tabs, temporaryTab, unsavedTabs } from './tabs';

describe('The tabs library', () => {
	beforeEach(() => {
		tabs.set([]);
		selectedTab.set('');
		temporaryTab.set('');
		unsavedTabs.set([]);
	}),
		it('can open a tab', () => {
			openTab('index.tsx');
			expect(get(tabs)).toStrictEqual(['index.tsx']);
		});
	it('can close a tab', () => {
		openTab('index.tsx');
		expect(get(tabs)).toStrictEqual(['index.tsx']);
		closeTab('index.tsx');
		expect(get(tabs)).toStrictEqual([]);
	});
	it('can rename a tab', () => {
		openTab('index.tsx');
		renameTab('index.tsx', 'test.tsx');
		expect(get(tabs)).toStrictEqual(['test.tsx']);
	});
	it('updates the selected tab', () => {
		openTab('index.tsx');
		expect(get(selectedTab)).toBe('index.tsx');
		openTab('index.tsx');
		openTab('anothertab.tsx');
		expect(get(selectedTab)).toBe('anothertab.tsx');
		closeTab('anothertab.tsx');
		expect(get(selectedTab)).toStrictEqual('index.tsx');
		closeTab('index.tsx');
		expect(get(selectedTab)).toStrictEqual('');
	});
});
