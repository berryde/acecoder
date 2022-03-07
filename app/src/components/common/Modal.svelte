<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import IoIosClose from 'svelte-icons/io/IoIosClose.svelte';
	import Icon from './Icon.svelte';
	import { fade } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	/**
	 * A class to show that the modal is open
	 */
	const OPEN = 'modal-open';

	/**
	 * The title of the modal
	 */
	export let title: string;

	/**
	 * Called when the user clicks away from the modal
	 */
	function close() {
		document.body.classList.remove(OPEN);
		dispatch('close');
	}

	onMount(() => {
		document.body.classList.add(OPEN);
	});

	onDestroy(() => {
		document.body.classList.remove(OPEN);
	});
</script>

<div
	class="transition-all fixed left-0 right-0 top-0 bottom-0 bg-opacity-50 flex justify-center items-center z-50"
	transition:fade={{ duration: 200 }}
>
	<div class="fixed left-0 right-0 top-0 bottom-0 bg-black bg-opacity-50 z-40" on:click={close} />
	<div class="modal bg-brand-accent text-brand-text p-10 rounded space-y-3 z-50">
		<div class="flex justify-between items-center -mr-2 mb-3">
			<p class="text-2xl">{title}</p>
			<Icon size="large" button={true} on:click={close}><IoIosClose /></Icon>
		</div>
		<slot />
	</div>
</div>

<style>
	:global(body.modal-open) {
		overflow: hidden;
	}

	.modal {
		max-height: 90vh;
		overflow: auto;
	}
</style>
