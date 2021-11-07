import { writable } from 'svelte/store';

// open editors
export const tabs = writable<string[]>([]);
export const selectedTab = writable<string>('');
export const unsavedTabs = writable<string[]>([]);

/**
 * Create a new tab if it doesn't exist and select it.
 * @param path The path to the file for this tab.
 */
export const openTab = (path: string): void => {
	tabs.update((tabs) => {
		if (tabs.includes(path)) {
			return tabs;
		}
		return [...tabs, path];
	});
	// Select the newly created tab
	selectedTab.set(path);
};

/**
 * Update all tabs that are files in some parent directory by renaming
 * the parent directory.
 *
 * @param oldDir The directory name to search for.
 * @param newDir What the directory name should be replaced with.
 */
export const renameTabs = (oldDir: string, newDir: string): void => {
	tabs.update((tabs) =>
		tabs.map((path) => (path.startsWith(oldDir + '/') ? path.replace(oldDir, newDir) : path))
	);
	selectedTab.update((selected) => {
		if (selected.startsWith(oldDir + '/')) {
			const updated = selected.replace(oldDir, newDir);
			return updated;
		}
		return selected;
	});
};

/**
 * Rename a tab exactly matching the given name.
 * @param oldName The name to replace.
 * @param newName The new name to use.
 */
export const renameTab = (oldName: string, newName: string): void => {
	tabs.update((tabs) => {
		if (tabs.includes(oldName)) {
			tabs[tabs.indexOf(oldName)] = newName;
		}
		return tabs;
	});
	selectedTab.set(newName);
	// Update the language support for this tab.
};

/**
 * Closes a tab.
 * @param name The name of the tab to close.
 */
export const closeTab = (name: string): void => {
	tabs.update((tabs) => {
		if (tabs.includes(name)) {
			tabs.splice(tabs.indexOf(name), 1);
		}
		return tabs;
	});
};

/**
 * Close all tabs that are files in some parent directory.
 * @param parent The name of the directory.
 */
export const closeTabs = (parent: string): void => {
	tabs.update((tabs) => tabs.filter((path) => !path.startsWith(parent)));
};

/**
 * Marks a tab as saved and removes it from unsaved tabs.
 * @param name The name of the tab
 */
export const saveTab = (name: string) => {
	unsavedTabs.update((unsavedTabs) =>
		unsavedTabs.includes(name) ? unsavedTabs.filter((t) => t != name) : unsavedTabs
	);
};

export const rearrange = (target: string, source: string) => {
	// Move moved to the left of target
	tabs.update((tabs) => {
		tabs = tabs.filter((t) => t != source);
		const targetIndex = tabs.indexOf(target);
		tabs.splice(targetIndex, 0, source);
		return tabs;
	});
};
