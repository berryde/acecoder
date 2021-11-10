<script lang="ts">
	import type { ReloadMessage, TestMessage, UrlMessage, WorkerResponse } from 'src/utils/types';
	import { onMount } from 'svelte';
	import template from './template/template';
	export let compiled: WorkerResponse;

	let iframe: HTMLIFrameElement;

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

	function test(compiled: WorkerResponse) {
		if (iframe) {
			const message: TestMessage = {
				compiled: compiled,
				type: 'test'
			};
			iframe.contentWindow.postMessage(message);
		}
	}

	onMount(() => {
		iframe.addEventListener('load', () => {
			// Add the URL click interceptor
			const message: UrlMessage = {
				type: 'url'
			};
			iframe.contentWindow.postMessage(message);
			// Do an initial render
			build(compiled);
		});
	});
</script>

<iframe title="Preview" class="h-full bg-white" bind:this={iframe} srcdoc={template} />
