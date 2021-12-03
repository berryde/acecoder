<script lang="ts">
	import Editor from '../../components/editor/Editor.svelte';
	import Tabs from '../../components/tabs/Tabs.svelte';
	import {
		tabs,
		selectedTab,
		unsavedTabs,
		saveTab,
		openTab,
		temporaryTab
	} from '../../utils/tabs/tabs';
	import { filesystem, getFile, updateFile } from '../../utils/filesystem/filesystem';
	import type { FSFile } from 'src/utils/types';

	/**
	 * A map of filename to unsaved changes for that file.
	 */
	let editorContent: { [key: string]: string } = {};

	/**
	 * Update the unsaved changes in memory.
	 * @param code The new unsaved changes.
	 */
	function handleCodeChanged(code: string) {
		editorContent[$selectedTab] = code;
		openTab($selectedTab);

		// If the unsaved changed match the actual value, mark the file as 'saved'
		if (code == (getFile($filesystem, $selectedTab) as FSFile).value) {
			unsavedTabs.update((tabs) => {
				if (tabs.includes($selectedTab)) {
					tabs.splice(tabs.indexOf($selectedTab), 1);
				}
				return tabs;
			});
		}
		// Mark the file as 'unsaved'
		else {
			unsavedTabs.update((tabs) => (tabs.includes($selectedTab) ? tabs : [...tabs, $selectedTab]));
		}
	}

	/**
	 * Save the current file when the user presses Ctrl+S
	 */
	function handleSave() {
		if ($selectedTab != '') {
			saveTab($selectedTab);
			updateFile($selectedTab, editorContent[$selectedTab]);
		}
	}
</script>

<Tabs selected={$selectedTab} tabs={$tabs} unsaved={$unsavedTabs} temporary={$temporaryTab} />
{#if $selectedTab}
	<Editor on:save={() => handleSave()} on:docchanged={(e) => handleCodeChanged(e.detail)} />
{/if}
