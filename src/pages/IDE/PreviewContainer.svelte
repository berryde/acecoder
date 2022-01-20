<script lang="ts">
	import { addMessage, latestError } from '../../utils/console/console';
	import Preview from '../../components/profile/preview/Preview.svelte';
	import { filesystem, getAllFiles } from '../../utils/filesystem/filesystem';
	import type { WorkerError, WorkerResponse } from '../../utils/types';
	import { onDestroy, onMount } from 'svelte';

	import { compiled } from 'src/utils/compiler/compiler';

	export let resizingX = false;
	export let selecting = false;

	let worker: Worker;

	function onMessage(event: MessageEvent<any>) {
		const e = event.data.error as WorkerError;
		if (e) {
			addMessage({
				data: e.message,
				type: 'error'
			});
			latestError.set(e);
		} else {
			latestError.set(undefined);
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
			worker.postMessage(getAllFiles('', $filesystem));
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

<Preview resizing={resizingX || selecting} error={$latestError} on:refresh={() => refresh()} />
