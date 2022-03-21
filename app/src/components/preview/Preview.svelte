<script lang="ts">
	import Error from './Error.svelte';
	import type {
		PreviewMessage,
		ReloadMessage,
		UrlMessage,
		WorkerError,
		WorkerResponse
	} from '~shared/types';
	import { onDestroy, onMount } from 'svelte';
	import previewTemplate from './template/template';
	import { createEventDispatcher } from 'svelte';
	import { compiled } from 'src/utils/compiler/compiler';
	import Icon from 'src/components/common/Icon.svelte';
	import IoIosExpand from 'svelte-icons/io/IoIosExpand.svelte';
	import IoIosPlay from 'svelte-icons/io/IoIosPlay.svelte';

	/**
	 * Whether the user is resizing the parent splitpane.
	 */
	export let resizing: boolean = false;

	/**
	 * A compilation error.
	 */
	export let error: WorkerError | undefined = undefined;

	/**
	 * The preview iframe.
	 */
	let iframe: HTMLIFrameElement;

	/**
	 * The popup preview, if any.
	 */
	let popup: Window | undefined;

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
		if (iframe && iframe.contentWindow) {
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
			const result = window.open(
				'',
				'Preview',
				`width = ${iframe.clientWidth}, height = ${iframe.clientHeight}, popup, location=no, menu=no, status=no, `
			);
			if (result != null) popup = result;
			if (!popup) return;
			popup.document.write(previewTemplate);
			popup.postMessage({
				type: 'popup'
			});
		}
	}

	/**
	 * Called when the preview window is loaded
	 */
	function onLoad() {
		// Add the URL click interceptor
		const message: UrlMessage = {
			type: 'url'
		};
		if (iframe.contentWindow) {
			iframe.contentWindow.postMessage(message);
		}
	}

	/**
	 * Called when the preview window recieves a message
	 * @param message
	 */
	function onMessage(message: MessageEvent) {
		const msg = message.data as PreviewMessage;
		if (msg.type == 'system') {
			if (msg.data == 'loaded' && popup) {
				// The popup has loaded successfully and should be sent the project code.
				popup.document.title = 'Preview';
				popup.postMessage({
					compiled: $compiled,
					type: 'reload'
				});
			} else {
				popup = undefined;
			}
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

	$: $compiled && build($compiled);
</script>

<div class="flex-grow h-full w-full flex flex-col overflow-hidden bg-brand-background">
	<div class="flex w-full justify-end px-5 py-3 space-x-3 items-center h-10">
		<Icon
			on:click={() => handleRefresh()}
			button={true}
			label="Refresh"
			card={true}
			aria="refresh preview"
		>
			<IoIosPlay />
		</Icon>
		<Icon
			on:click={() => handlePopup()}
			button={true}
			label="Popout"
			card={true}
			aria="open preview in new window"
		>
			<IoIosExpand />
		</Icon>
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
