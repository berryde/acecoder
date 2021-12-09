<script lang="ts">
	import { addMessage, latestError, messages } from '../../utils/console/console';

	import Preview from '../../components/preview/Preview.svelte';
	import SplitPane from '../../components/splitpane/SplitPane.svelte';
	import { filesystem, getAllFiles } from '../../utils/filesystem/filesystem';
	import type { WorkerError, WorkerResponse } from '../../utils/types';
	import { onDestroy, onMount } from 'svelte';

	import Console from '../../components/console/Console.svelte';

	import { standalone, saveStandalone, template } from 'src/utils/exercise/exercise';
	import { compiled } from 'src/utils/compiler/compiler';
	import { doc, setDoc } from 'firebase/firestore';
	import { auth, db } from 'src/utils/firebase';

	export let resizingX = false;
	export let selecting = false;

	let initialised = false;
	let worker: Worker;

	function save() {
		if ($standalone) {
			saveStandalone();
		}
		refresh();
	}

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
	});

	function storeCompiled() {
		const _compiled = $compiled;
		if (
			_compiled &&
			_compiled !=
				{
					css: '',
					js: '',
					public: {}
				}
		) {
			setDoc(doc(db, 'preview', auth.currentUser.uid), _compiled);
		}
	}

	// Rerender (and save in standalone) whenever the filesystem is updated
	$: initialised && $filesystem && save();
	// Update initialsed when the template is created
	$: initialised = !!$template;
	// Update the stored compiled preview whenever it changes if we are standalone
	$: initialised && $standalone && $compiled && storeCompiled();
	// Perform the initial reload
	$: initialised && refresh();

	function refresh() {
		if (worker) {
			worker.postMessage(getAllFiles('', $filesystem));
		}
	}

	onDestroy(() => {
		if (worker) {
			worker.terminate();
		}
		compiled.set(undefined);
	});
</script>

<div class="h-screen w-full overflow-hidden">
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
