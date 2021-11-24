<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	/**
	 * The icon size to display.
	 */
	export let size: 'small' | 'medium' | 'large' = 'medium';

	/**
	 * Whether this icon is also a button.
	 */
	export let button = false;

	/**
	 * The test-id of this icon, so that it can be identified programatically in tests.
	 */
	export let testId = '';
	const dispatch = createEventDispatcher();

	/**
	 * Called when the user clicks on this component.
	 */
	function click() {
		dispatch('click');
	}

	/**
	 * Retrieves tailwind classes for the desired size.
	 */
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

<div class="flex flex-col justify-center items-center">
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
</div>
