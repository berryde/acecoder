<script lang="ts">
	import Editor from '../../components/editor/Editor.svelte';
	import Tabs from '../../components/tabs/Tabs.svelte';
	import { tabs, selectedTab, unsavedTabs, saveTab, openTab } from '../../utils/tabs/tabs';
	import { filesystem, getExtension, getFile, updateFile } from '../../utils/filesystem/filesystem';

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
		unsavedTabs.update((tabs) => (tabs.includes($selectedTab) ? tabs : [...tabs, $selectedTab]));
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

	/**
	 * Load the contents of the file for this tab.
	 * @param tab The tab associated with this file and editor.
	 */
	function loadEditorContent(tab: string) {
		const result = getFile($filesystem, tab);
		if (result.type == 'file') {
			return result.value;
		}
		return '';
	}
</script>

<div class="flex flex-col dark:bg-dark-bglight bg-gray-100 h-screen w-full">
	<Tabs selected={$selectedTab} tabs={$tabs} unsaved={$unsavedTabs} />
	{#each $tabs as tab}
		<Editor
			selected={tab === $selectedTab}
			language={getExtension(tab)}
			filename={tab}
			on:save={() => handleSave()}
			on:docchanged={(e) => handleCodeChanged(e.detail)}
			on:drag
			initialValue={loadEditorContent(tab)}
		/>
	{/each}
</div>
