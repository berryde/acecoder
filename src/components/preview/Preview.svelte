<script lang="ts">
	import { addMessage } from '../../utils/console/console';
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

	const dispatch = createEventDispatcher();
	export let compiled: WorkerResponse;
	export let resizing = false;
	export let error: WorkerError = undefined;

	let iframe: HTMLIFrameElement;
	let popup: Window;
	let srcdoc: string = '';

	$: build(compiled);

	function build(compiled: WorkerResponse) {
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

	onMount(() => {
		srcdoc = previewTemplate;
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
						// The pop has loaded successfully and should be sent the project code.
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

	function handleRefresh() {
		dispatch('refresh');
	}

	function handlePopout() {
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
</script>

<div class="flex-grow h-full w-full flex flex-col overflow-hidden bg-gray-200 dark:bg-dark-bglight">
	<div class=" dark:text-dark-text flex flex-row justify-between w-full items-center p-2">
		<div class="font-bold uppercase text-xs ">Preview</div>
		<div class="flex flex-row space-x-2">
			<Icon on:click={() => handlePopout()} button={true}>
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
