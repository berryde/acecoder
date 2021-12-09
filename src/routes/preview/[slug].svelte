<script lang="ts">
	import type { ReloadMessage, UrlMessage, WorkerResponse } from 'src/utils/types';
	import Error from 'src/components/preview/Error.svelte';
	import template from 'src/components/preview/template/template';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import ErrorPage from 'src/pages/error/Error.svelte';
	import { doc, onSnapshot } from 'firebase/firestore';
	import { db } from 'src/utils/firebase';

	// Fetch the compiled site from firebase

	let compiled: WorkerResponse = {
		css: '',
		js: '',
		public: {
			'index.html': ''
		}
	};

	let srcdoc: string;
	let iframe: HTMLIFrameElement;
	let found = true;

	/**
	 * Load the compiled code into the preview.
	 * @param compiled
	 */
	function build(compiled: WorkerResponse) {
		// Update 'compiled' in firebase if this is not an exercise
		const message: ReloadMessage = {
			compiled: compiled,
			type: 'reload'
		};
		if (iframe) {
			iframe.contentWindow.postMessage(message);
		}
	}

	onMount(async () => {
		srcdoc = template;

		onSnapshot(doc(db, 'preview', $page.params.slug), (doc) => {
			compiled = doc.data() as WorkerResponse;
		});

		if (compiled) {
			// Send the compiled code to the iframe once it has loaded.
			iframe.onload = () => {
				// Add the URL click interceptor
				const message: UrlMessage = {
					type: 'url'
				};
				iframe.contentWindow.postMessage(message);
				// Do an initial render
				build(compiled);
			};
		} else {
			found = false;
		}
	});

	$: build(compiled);
</script>

<svelte:head>
	<title>Preview</title>
</svelte:head>

<div class="h-screen w-screen">
	{#if found}
		{#if compiled && compiled.error}
			<Error error={compiled.error} />
		{/if}
		<iframe
			title="Preview"
			class="h-full w-full z-0 bg-white"
			data-testid="preview"
			bind:this={iframe}
			{srcdoc}
		/>
	{:else}
		<ErrorPage />
	{/if}
</div>
