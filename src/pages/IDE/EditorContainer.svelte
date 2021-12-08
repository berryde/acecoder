<script lang="ts">
	import Editor from '../../components/editor/Editor.svelte';
	import Tabs from '../../components/tabs/Tabs.svelte';
	import { tabs, selectedTab, unsavedTabs, openTab, temporaryTab } from '../../utils/tabs/tabs';
	import { getFile } from '../../utils/filesystem/filesystem';
	import type { FSFile } from 'src/utils/types';
	import { contents } from 'src/utils/codemirror/codemirror';

	/**
	 * Update the unsaved changes in memory.
	 * @param code The new unsaved changes.
	 */
	function handleCodeChanged(code: string) {
		openTab($selectedTab);

		// If the unsaved changed match the actual value, mark the file as 'saved'
		if (code == (getFile($selectedTab) as FSFile).value) {
			unsavedTabs.update((tabs) => {
				if (tabs.includes($selectedTab)) {
					tabs.splice(tabs.indexOf($selectedTab), 1);
				}
				return tabs;
			});
		}
		// Mark the file as 'unsaved'
		else {
			contents.set(code);
			unsavedTabs.update((tabs) => (tabs.includes($selectedTab) ? tabs : [...tabs, $selectedTab]));
		}
	}
</script>

<Tabs selected={$selectedTab} tabs={$tabs} unsaved={$unsavedTabs} temporary={$temporaryTab} />
{#if $selectedTab}
	<Editor on:docchanged={(e) => handleCodeChanged(e.detail)} />
{/if}
