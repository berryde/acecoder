<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import IoIosClose from 'svelte-icons/io/IoIosClose.svelte';
	import Icon from './Icon.svelte';

	const dispatch = createEventDispatcher();
	const OPEN = 'modal-open';

	export let title: string;

	onMount(() => {
		document.body.classList.add(OPEN);
	});

	function close() {
		document.body.classList.remove(OPEN);
		dispatch('close');
	}

	onDestroy(() => {
		document.body.classList.remove(OPEN);
	});
</script>

<div
	class="transition-all fixed left-0 right-0 top-0 bottom-0 bg-opacity-50 flex justify-center items-center z-50"
>
	<div class="fixed left-0 right-0 top-0 bottom-0 bg-black bg-opacity-50 z-40" on:click={close} />
	<div class="modal bg-brand-accent text-brand-text p-10 rounded space-y-3 z-50">
		<div class="flex justify-between items-center -mr-2 mb-6">
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
