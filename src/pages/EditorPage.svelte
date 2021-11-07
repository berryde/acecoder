<script lang="ts">
	import Preview from '../components/preview/Preview.svelte';
	import Editor from '../components/editor/Editor.svelte';
	import type { Filesystem, WorkerResponse } from '../utils/types';
	import Explorer from '../components/explorer/Explorer.svelte';
	import Tabs from '../components/tabs/Tabs.svelte';
	import { tabs, selectedTab, unsavedTabs, saveTab } from '../utils/tabs/tabs';
	import {
		createFile,
		filesystem,
		getAllFiles,
		getExtension,
		getFile,
		updateFile
	} from '../utils/filesystem/filesystem';
	import { onMount } from 'svelte';
	import { reactTemplate } from '../utils/templates/templates';

	let files: Filesystem;
	filesystem.subscribe((state) => (files = state));

	let compiled: WorkerResponse = {
		css: '',
		js: '',
		html: ''
	};

	let worker: Worker;

	let editorContent: { [key: string]: string } = {};

	onMount(() => {
		worker = new Worker('./worker.js');

		// Add a listener for compiler responses.
		worker.addEventListener('message', (event) => {
			compiled = event.data as WorkerResponse;
		});

		// Load the react template.
		loadTemplate(reactTemplate);

		/**
		 * Reload the preview whenever the filesystem is changed.
		 */
		filesystem.subscribe((fs) => {
			const files = getAllFiles('', fs);
			worker.postMessage(files);
		});
	});

	// When the editor source is changed, send it to the web worker.
	// Send the results to the preview.
	function handleCodeChanged(code: string) {
		editorContent[$selectedTab] = code;
		unsavedTabs.update((unsavedTabs) =>
			unsavedTabs.includes($selectedTab) ? unsavedTabs : [...unsavedTabs, $selectedTab]
		);
	}

	function loadTemplate(template: { [key: string]: string }) {
		for (const [path, value] of Object.entries(template)) {
			createFile(path, value);
		}
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

<div class="h-screen bg-bluegray-default flex flex-row">
	<Explorer {files} />
	<div class="flex flex-col flex-grow overflow-auto">
		<Tabs />
		{#each $tabs as tab}
			<Editor
				selected={tab === $selectedTab}
				language={getExtension(tab)}
				on:save={(e) => handleSave()}
				on:docchanged={(e) => handleCodeChanged(e.detail)}
				initialValue={loadEditorContent(tab)}
			/>
		{/each}
	</div>
	<Preview {compiled} />
</div>
