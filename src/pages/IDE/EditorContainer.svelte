<script lang="ts">
	import Editor from '../../components/editor/Editor.svelte';
	import Tabs from '../../components/tabs/Tabs.svelte';
	import { tabs, selectedTab, unsavedTabs, openTab, temporaryTab } from '../../utils/tabs/tabs';
	import { getFile } from '../../utils/filesystem/filesystem';
	import type { FSFile } from 'src/utils/types';
	import { contents } from 'src/utils/codemirror/codemirror';
	import Keybind from 'src/components/editor/Keybind.svelte';

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

	type Binding = {
		keys: string[];
		name: string;
	};

	const keybinds: Binding[] = [
		{
			keys: ['ctrl', 's'],
			name: 'Save'
		},
		{
			keys: ['ctrl', 'alt', 'l'],
			name: 'Format'
		},
		{ keys: ['ctrl', 'b'], name: 'Toggle sidebar' }
	];
</script>

<div class="flex flex-col h-screen">
	<Tabs selected={$selectedTab} tabs={$tabs} unsaved={$unsavedTabs} temporary={$temporaryTab} />
	{#if $tabs.length > 0}
		{#each $tabs as tab}
			<Editor
				on:docchanged={(e) => handleCodeChanged(e.detail)}
				filename={tab}
				visible={tab == $selectedTab}
			/>
		{/each}
	{:else}
		<div class="flex-grow flex-col w-full flex justify-center items-center space-y-3 opacity-50">
			{#each keybinds as keybind}
				<div class="flex flex-row w-52 justify-between">
					<p class="mr-5">{keybind.name}</p>
					<Keybind keys={keybind.keys} />
				</div>
			{/each}
		</div>
	{/if}
</div>
