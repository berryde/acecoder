<script lang="ts">
	import { addMessage } from '../../utils/console/console';
	import Error from './Error.svelte';
	import type {
		ConsoleMessage,
		ReloadMessage,
		UrlMessage,
		WorkerError,
		WorkerResponse
	} from 'src/utils/types';
	import { onMount } from 'svelte';
	import template from './template/template';
	import MdAutorenew from 'svelte-icons/md/MdAutorenew.svelte';
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

	function handleRefresh() {
		dispatch('refresh');
	}

	function handlePopout() {
		popup = window.open();
		popup.document.write(srcdoc);
		handleRefresh();
	}
</script>

<div class="flex-grow h-full w-full relative flex flex-col overflow-x-auto">
	<div class="text-bluegray-light flex flex-row justify-between w-full items-center p-2">
		<div class="font-bold uppercase text-xs ">Preview</div>
		<div class="flex flex-row space-x-2">
			<Icon on:click={() => handlePopout()}>
				<IoIosExpand />
			</Icon>
			<Icon on:click={() => handleRefresh()}>
				<MdAutorenew />
			</Icon>
		</div>
	</div>
	<div class="flex-grow">
		<Error {error} />
		<iframe
			title="Preview"
			class="h-full w-full z-0 bg-white {resizing && 'pointer-events-none'}"
			bind:this={iframe}
			{srcdoc}
		/>
	</div>
</div>
