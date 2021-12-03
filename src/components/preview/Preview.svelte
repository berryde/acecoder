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
	import { onMount } from 'svelte';
	import previewTemplate from './template/template';
	import IoIosPlay from 'svelte-icons/io/IoIosPlay.svelte';
	import IoIosExpand from 'svelte-icons/io/IoIosExpand.svelte';
	import Icon from '../common/Icon.svelte';
	import { createEventDispatcher } from 'svelte';
	import IoIosShareAlt from 'svelte-icons/io/IoIosShareAlt.svelte';
	import { standalone } from 'src/utils/exercise/exercise';
	import { auth } from 'src/utils/auth/auth';

	/**
	 * The compiled code
	 */
	export let compiled: WorkerResponse;

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
		if (popup) {
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

	let sharing = false;
	function handleShare() {
		sharing = !sharing;
	}

	onMount(() => {
		// Load the preview template
		srcdoc = previewTemplate;

		// Send the compiled code to the iframe once it has loaded.
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
			const msg = message.data as PreviewMessage;
			if (msg.type == 'system') {
				switch (msg.data) {
					case 'loaded':
						// The popup has loaded successfully and should be sent the project code.
						popup.document.title = 'Preview';
						popup.postMessage({
							compiled: compiled,
							type: 'reload'
						});
						break;
					default:
						popup = undefined;
				}
			} else {
				addMessage(msg);
			}
		});
	});

	let copied = false;
	async function handleCopy() {
		const link = window.location.host + '/preview/' + $auth.uid;
		await navigator.clipboard.writeText(link);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 500);
	}

	// Update the preview whenever the compiled code changes.
	$: build(compiled);
</script>

<div class="flex-grow h-full w-full flex flex-col overflow-hidden bg-gray-200 dark:bg-dark-bglight">
	<div class=" dark:text-dark-text flex flex-row justify-between w-full items-center p-2">
		<div class="font-bold uppercase text-xs ">Preview</div>
		<div class="flex flex-row space-x-2">
			{#if $standalone}
				<Icon on:click={() => handleShare()} button={true}>
					<IoIosShareAlt />
				</Icon>
				{#if sharing}
					<div
						class="dark:bg-dark-bglight border-light-bglight w-96 text-white absolute block z-50 right-2 top-10 rounded p-3 text-sm space-y-2 shadow-md"
					>
						<p class="dark:text-dark-text text-light-text uppercase text-xs font-bold">SHARE</p>
						<p>
							You can use this link to access your site from any device. Anyone with the link can
							view the site, so be careful when sharing it.
						</p>
						<div
							class="overflow-x-auto p-1 text-xs text-center transition-all {copied
								? 'text-green-400 bg-green-900'
								: 'text-blue-400 bg-dark-bgdark'}"
							on:click={() => handleCopy()}
						>
							<p>{window.location.host}/preview/{$auth.uid}</p>
						</div>
						<p class="text-xs">Click on the link to copy it to the clipboard.</p>
					</div>
				{/if}
			{/if}
			<Icon on:click={() => handlePopup()} button={true}>
				<IoIosExpand />
			</Icon>
			<Icon on:click={() => handleRefresh()} button={true}>
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
