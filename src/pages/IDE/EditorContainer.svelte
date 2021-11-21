<script lang="ts">
	import Editor from '../../components/editor/Editor.svelte';
	import Tabs from '../../components/tabs/Tabs.svelte';
	import { tabs, selectedTab, unsavedTabs, saveTab } from '../../utils/tabs/tabs';
	import { filesystem, getExtension, getFile, updateFile } from '../../utils/filesystem/filesystem';

	let editorContent: { [key: string]: string } = {};

	// When the editor source is changed, send it to the web worker.
	// Send the results to the preview.
	function handleCodeChanged(code: string) {
		editorContent[$selectedTab] = code;
		unsavedTabs.update((tabs) => (tabs.includes($selectedTab) ? tabs : [...tabs, $selectedTab]));
	}

	function handleSave() {
		if ($selectedTab != '') {
			saveTab($selectedTab);
			updateFile($selectedTab, editorContent[$selectedTab]);
		}
	}

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
