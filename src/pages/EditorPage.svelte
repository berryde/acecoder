<script lang="ts">
	import Preview from '../components/preview/Preview.svelte';
	import Editor from '../components/editor/Editor.svelte';
	import type { Filesystem, WorkerResponse } from '../utils/types';
	import Explorer from '../components/explorer/Explorer.svelte';
	import Tabs from '../components/tabs/Tabs.svelte';
	import { filesystem } from '../utils/filesystem/filesystem';

	let files: Filesystem;
	filesystem.subscribe((state) => (files = state));

	let compiled: WorkerResponse = {
		css: '',
		js: ''
	};
	// When the editor source is changed, send it to the web worker.
	// Send the results to the preview.
	function handleCodeChanged(code: string) {}

	function handleFileSelected(file: File) {
		// If there is an editor for the selected file, switch focus to it.
		// Otherwise, create a new editor.
	}
</script>

<div class="h-screen bg-bluegray-default flex flex-row">
	<Explorer on:fileselected={(e) => handleFileSelected(e.detail)} {files} />
	<div class="flex-grow max-h-screen">
		<Tabs />
		<Editor language="jsx" on:docchanged={(e) => handleCodeChanged(e.detail)} />
	</div>
	<Preview {compiled} />
</div>
