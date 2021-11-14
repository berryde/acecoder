<script lang="ts">
	import { addMessage } from '../../utils/console/console';
	import Error from './Error.svelte';
	import type {
		ConsoleMessage,
		ReloadMessage,
		TestMessage,
		UrlMessage,
		WorkerError,
		WorkerResponse
	} from 'src/utils/types';
	import { onMount } from 'svelte';
	import template from './template/template';
	export let compiled: WorkerResponse;
	export let resizing = false;
	export let error: WorkerError = undefined;

	let iframe: HTMLIFrameElement;
	let srcdoc: string = '';

	$: build(compiled);

	function build(compiled: WorkerResponse) {
		if (iframe) {
			const message: ReloadMessage = {
				compiled: compiled,
				type: 'reload'
			};
			iframe.contentWindow.postMessage(message);
		}
	}

	onMount(() => {
		srcdoc = template;
		iframe.addEventListener('load', () => {
			// Add the URL click interceptor
			const message: UrlMessage = {
				type: 'url'
			};
			iframe.contentWindow.postMessage(message);
			// Do an initial render
			build(compiled);
		});
		// Handle console messages.
		window.addEventListener('message', (message: MessageEvent) => {
			const data = message.data as ConsoleMessage;
			addMessage(data);
		});
	});
</script>

<div class="flex-grow h-full w-full relative">
	<Error {error} />
	<iframe
		title="Preview"
		class="h-full w-full z-0 bg-white {resizing && 'pointer-events-none'}"
		bind:this={iframe}
		{srcdoc}
	/>
</div>
