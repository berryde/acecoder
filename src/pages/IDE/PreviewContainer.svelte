<script lang="ts">
	import { addMessage, latestError, messages } from '../../utils/console/console';

	import Preview from '../../components/preview/Preview.svelte';
	import SplitPane from '../../components/splitpane/SplitPane.svelte';
	import { filesystem, getAllFiles } from '../../utils/filesystem/filesystem';
	import type { WorkerError, WorkerResponse } from '../../utils/types';
	import { onMount } from 'svelte';

	import Console from '../../components/console/Console.svelte';

	import { template } from 'src/utils/exercise/exercise';
	import { compiled } from 'src/utils/compiler/state';

	export let resizingX = false;
	export let selecting = false;

	let initialised = false;
	let worker: Worker;

	onMount(() => {
		// Import the worker from the absolute path
		worker = new Worker(new URL('/worker.js', window.location.origin));
		// Add a listener for compiler responses.
		worker.addEventListener('message', (event) => {
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
		});

		template.subscribe((template) => {
			if (template) {
				initialised = true;
			}
		});
	});

	/**
	 * Reload the preview whenever the filesystem is changed.
	 */

	filesystem.subscribe(() => {
		initialised && refresh();
	});

	function refresh() {
		if (worker) {
			worker.postMessage(getAllFiles('', $filesystem));
		}
	}

	$: initialised && refresh();
</script>

<div class="h-screen w-full">
	<SplitPane
		minPane1Size="2rem"
		minPane2Size="2.5rem"
		isHorizontal={false}
		pane1Size={100}
		pane2Size={0}
	>
		<top slot="pane1" let:resizing={resizingY}>
			<Preview
				compiled={$compiled}
				resizing={resizingX || resizingY || selecting}
				error={$latestError}
				on:refresh={() => refresh()}
			/>
		</top>
		<bottom slot="pane2">
			<Console messages={$messages} />
		</bottom>
	</SplitPane>
</div>
