<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import IoIosClose from 'svelte-icons/io/IoIosClose.svelte';
	import Icon from './Icon.svelte';

	const dispatch = createEventDispatcher();

	export let title: string;

	function close() {
		dispatch('close');
	}
</script>

<div
	class="transition-all fixed left-0 right-0 top-0 bottom-0 bg-opacity-50 flex justify-center items-center z-50"
>
	<div class="fixed left-0 right-0 top-0 bottom-0 bg-black bg-opacity-50 z-40" on:click={close} />
	<div class="modal bg-brand-accent text-brand-text w-1/3 p-10 rounded space-y-3 z-50">
		<div class="flex justify-between items-center -mr-2 mb-6">
			<p class="text-2xl">{title}</p>
			<Icon size="large" button={true} on:click={close}><IoIosClose /></Icon>
		</div>
		<slot />
	</div>
</div>

<style>
	.modal {
		max-height: 66vh;
		overflow: auto;
	}
</style>
