<script lang="ts">
	import { addMessage, latestError, messages } from '../../utils/console/console';

	import Preview from '../../components/preview/Preview.svelte';
	import SplitPane from '../../components/splitpane/SplitPane.svelte';
	import { filesystem, getAllFiles } from '../../utils/filesystem/filesystem';
	import type { WorkerError, WorkerResponse } from '../../utils/types';
	import { onMount } from 'svelte';

	import Console from '../../components/console/Console.svelte';

	import { exercise, loadExercise } from 'src/utils/exercise/exercise';

	export let resizingX = false;
	export let selecting = false;

	let compiled: WorkerResponse = {
		css: '',
		js: '',
		public: {}
	};
	let initialised = false;
	let worker: Worker;

	onMount(() => {
		worker = new Worker('./worker.js');

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

				compiled = event.data as WorkerResponse;
			}
		});

		loadExercise('9A5WFx5Ki8Rlni9FmkJf');
		exercise.subscribe((ex) => {
			if (ex) initialised = true;
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
				{compiled}
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
