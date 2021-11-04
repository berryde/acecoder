<script lang="ts">
	import Preview from '../components/preview/Preview.svelte';
	import Editor from '../components/editor/Editor.svelte';
	import type { Filesystem, WorkerResponse } from '../utils/types';
	import Explorer from '../components/explorer/Explorer.svelte';
	import Tabs from '../components/tabs/Tabs.svelte';
	import { tabs, selectedTab } from '../utils/tabs/tabs';
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

	onMount(() => {
		worker = new Worker('./worker.js');

		worker.addEventListener('message', (event) => {
			console.log('Received compiled code', event.data);
			compiled = event.data as WorkerResponse;
		});
	});

	// When the editor source is changed, send it to the web worker.
	// Send the results to the preview.
	function handleCodeChanged(code: string) {
		updateFile($selectedTab, code);
		updatePreview();
	}

	function updatePreview() {
		const files = getAllFiles('', $filesystem);
		console.log('Sending', files);
		worker.postMessage(files);
	}

	function loadTemplate(template: { [key: string]: string }) {
		for (const [path, value] of Object.entries(template)) {
			createFile(path, value);
		}
		updatePreview();
	}

	onMount(() => {
		loadTemplate(reactTemplate);
	});

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
	<div class="flex-grow max-h-screen">
		<Tabs />
		{#each $tabs as tab}
			<Editor
				selected={tab === $selectedTab}
				language={getExtension(tab)}
				on:docchanged={(e) => handleCodeChanged(e.detail)}
				initialValue={loadEditorContent(tab)}
			/>
		{/each}
	</div>
	<Preview {compiled} />
</div>
