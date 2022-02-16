<script lang="ts">
	import Preview from '../../components/preview/Preview.svelte';
	import { filesystem, getAllFiles } from '../../utils/filesystem/filesystem';
	import type { WorkerError, WorkerResponse } from '../../utils/types';
	import { onDestroy, onMount } from 'svelte';

	import { compiled } from 'src/utils/compiler/compiler';
	import { language } from 'src/utils/exercise/exercise';

	export let resizing: boolean = false;
	export let selecting: boolean = false;

	let worker: Worker;

	function onMessage(event: MessageEvent<any>) {
		const e = event.data.error as WorkerError;
		if (e) {
			console.error(e.message);
		} else {
			compiled.set(event.data as WorkerResponse);
		}
	}

	onMount(() => {
		// Import the worker from the absolute path
		worker = new Worker(new URL('/worker.js', window.location.origin));
		// Add a listener for compiler responses.
		worker.addEventListener('message', onMessage);

		refresh();
	});

	function refresh() {
		if (worker) {
			worker.postMessage({
				language: $language,
				files: getAllFiles('', $filesystem)
			});
		}
	}

	onDestroy(() => {
		if (worker) {
			worker.removeEventListener('message', onMessage);
			worker.terminate();
		}
		compiled.set(undefined);
	});

	$: $filesystem && refresh();
</script>

<Preview resizing={resizing || selecting} on:refresh={() => refresh()} />
