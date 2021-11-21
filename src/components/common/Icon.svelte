<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let size: 'small' | 'medium' | 'large' = 'medium';
	export let button = false;
	export let testId: string = '';
	const dispatch = createEventDispatcher();

	function click() {
		dispatch('click');
	}

	function getDimensions() {
		switch (size) {
			case 'small':
				return 'h-3 w-3';
			case 'large':
				return 'h-6 w-6';
			case 'medium':
			default:
				return 'h-4 w-4';
		}
	}
</script>

{#if button}
	<button
		on:click={click}
		class="{getDimensions()} flex-shrink-0 flex-grow-0 dark:text-dark-text text-light-text"
		data-testid={testId}><slot /></button
	>
{:else}
	<div class="{getDimensions()} flex-shrink-0 flex-grow-0" data-testid={testId}>
		<slot />
	</div>
{/if}
