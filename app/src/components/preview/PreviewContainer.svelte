<script lang="ts">
	import Preview from './Preview.svelte';
	import { filesystem, getAllFiles } from '../../utils/filesystem/filesystem';
	import type { WorkerError, WorkerResponse } from '~shared/types';
	import { onDestroy, onMount } from 'svelte';
	import { compiled } from 'src/utils/compiler/compiler';
	import { language } from 'src/utils/exercise/exercise';

	/**
	 * Whether the user is resizing the parent splitpane
	 */
	export let resizing: boolean = false;

	/**
	 * The Rollup worker
	 */
	let worker: Worker;

	/**
	 * Called when the Rollup worker sends a response
	 * @param event The recieved message
	 */
	function onMessage(event: MessageEvent<any>) {
		const e = event.data.error as WorkerError;
		if (e) {
			console.error(e.message);
		} else {
			compiled.set(event.data as WorkerResponse);
		}
	}

	/**
	 * Refresh the preview by rebuilding the application
	 */
	function refresh() {
		if (worker) {
			worker.postMessage({
				language: $language,
				files: getAllFiles('', $filesystem)
			});
		}
	}
	onMount(() => {
		// Import the worker from the absolute path
		worker = new Worker(new URL('/worker.js', window.location.origin));
		// Add a listener for compiler responses.
		worker.addEventListener('message', onMessage);

		refresh();
	});

	onDestroy(() => {
		if (worker) {
			worker.removeEventListener('message', onMessage);
			worker.terminate();
		}
		compiled.set(undefined);
	});

	// Refresh the preview whenever the filesystem changes
	$: $filesystem && refresh();
</script>

<Preview {resizing} on:refresh={() => refresh()} />
