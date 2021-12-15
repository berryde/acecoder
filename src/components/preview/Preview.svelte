<script lang="ts">
	import { addMessage } from 'src/utils/console/console';
	import Error from './Error.svelte';
	import type {
		PreviewMessage,
		ReloadMessage,
		UrlMessage,
		WorkerError,
		WorkerResponse
	} from 'src/utils/types';
	import { onDestroy, onMount } from 'svelte';
	import previewTemplate from './template/template';
	import IoIosPlay from 'svelte-icons/io/IoIosPlay.svelte';
	import IoIosExpand from 'svelte-icons/io/IoIosExpand.svelte';
	import Icon from '../common/Icon.svelte';
	import { createEventDispatcher } from 'svelte';
	import { compiled } from 'src/utils/compiler/compiler';

	/**
	 * Whether the user is resizing the parent splitpane.
	 */
	export let resizing = false;

	/**
	 * A compilation error.
	 */
	export let error: WorkerError = undefined;

	/**
	 * The preview iframe.
	 */
	let iframe: HTMLIFrameElement;

	/**
	 * The popup preview, if any.
	 */
	let popup: Window;

	/**
	 * The template to use in the iframe.
	 */
	let srcdoc = '';

	const dispatch = createEventDispatcher();

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
		if (popup) {
			popup.postMessage(message);
		}
	}

	/**
	 * Force a re-render of the preview.
	 */
	function handleRefresh() {
		dispatch('refresh');
	}

	/**
	 * Open the preview in a new popup when the popup button is clicked.
	 */
	function handlePopup() {
		if (popup && !popup.closed) {
			popup.focus();
		} else {
			popup = window.open(
				'',
				'Preview',
				`width = ${iframe.clientWidth}, height = ${iframe.clientHeight}, popup, location=no, menu=no, status=no, `
			);
			popup.document.write(previewTemplate);
			popup.postMessage({
				type: 'popup'
			});
		}
	}

	function onLoad() {
		// Add the URL click interceptor
		const message: UrlMessage = {
			type: 'url'
		};
		iframe.contentWindow.postMessage(message);
	}

	function onMessage(message: MessageEvent) {
		const msg = message.data as PreviewMessage;
		if (msg.type == 'system') {
			switch (msg.data) {
				case 'loaded':
					// The popup has loaded successfully and should be sent the project code.
					popup.document.title = 'Preview';
					popup.postMessage({
						compiled: $compiled,
						type: 'reload'
					});
					break;
				default:
					popup = undefined;
			}
		} else {
			addMessage(msg);
		}
	}

	onMount(() => {
		// Load the preview template
		srcdoc = previewTemplate;

		// Send the compiled code to the iframe once it has loaded.
		iframe.addEventListener('load', onLoad);

		// Handle console messages.
		window.addEventListener('message', onMessage);
	});

	onDestroy(() => {
		if (iframe) {
			iframe.removeEventListener('load', onLoad);
			window.removeEventListener('message', onMessage);
		}
	});

	// Update the preview whenever the compiled code changes.

	$: build($compiled);
</script>

<div class="flex-grow h-full w-full flex flex-col overflow-hidden bg-gray-200 dark:bg-dark-bglight">
	<div class="dark:text-dark-text flex flex-row justify-between w-full items-center py-2 px-5">
		<div class="font-bold uppercase text-xs ">Preview</div>
		<div class="flex flex-row space-x-2">
			<Icon on:click={() => handlePopup()} button={true} label="Popout">
				<IoIosExpand />
			</Icon>
			<Icon on:click={() => handleRefresh()} button={true} label="Refresh">
				<IoIosPlay />
			</Icon>
		</div>
	</div>
	<div class="flex-grow relative">
		<Error {error} />
		<iframe
			title="Preview"
			class="h-full w-full z-0 bg-white {resizing && 'pointer-events-none'}"
			data-testid="preview"
			bind:this={iframe}
			{srcdoc}
		/>
	</div>
</div>
