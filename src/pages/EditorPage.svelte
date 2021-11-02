<script lang="ts">
	import Preview from '../components/preview/Preview.svelte';
	import Editor from '../components/editor/Editor.svelte';
	import type { Filesystem, WorkerResponse } from '../utils/types';
	import Explorer from '../components/explorer/Explorer.svelte';
	import Tabs from '../components/tabs/Tabs.svelte';
	import { tabs, selectedTab } from '../utils/tabs/tabs';
	import {
		filesystem,
		getAllFiles,
		getExtension,
		updateFile
	} from '../utils/filesystem/filesystem';
	import { onMount } from 'svelte';

	let files: Filesystem;
	filesystem.subscribe((state) => (files = state));

	let compiled: WorkerResponse = {
		css: '',
		js: ''
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
		const files = getAllFiles('', $filesystem);
		console.log('Sending', files);
		worker.postMessage(files);
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
			/>
		{/each}
	</div>
	<Preview {compiled} />
</div>
