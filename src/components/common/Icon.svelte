<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Hoverable from './Hoverable.svelte';

	/**
	 * The icon size to display.
	 */
	export let size: 'small' | 'medium' | 'large' = 'medium';

	/**
	 * Whether this icon is also a button.
	 */
	export let button = false;

	export let labelPosition: 'below' | 'above' = 'below';

	export let label: string = undefined;

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

	/**
	 * Due to CSS preprocessing, classes cannot be composed strings.
	 */
	function getOffset() {
		if (labelPosition == 'above') {
			switch (size) {
				case 'small':
					return '-top-3';
				case 'large':
					return '-top-8';
				case 'medium':
				default:
					return '-top-5';
			}
		} else {
			switch (size) {
				case 'small':
					return 'top-3';
				case 'large':
					return 'top-8';
				case 'medium':
				default:
					return 'top-5';
			}
		}
	}
</script>

<Hoverable let:hovering>
	<div class="flex flex-col items-center">
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
		{#if label}
			<div class="absolute z-50 pointer-events-none">
				<p
					class="relative transition-all text-center {hovering
						? 'visible opacity-100'
						: 'invisible opacity-0'} {getOffset()} text-xs dark:bg-dark-bgdark bg-light-bgdark px-1 py-0.5 shadow rounded "
				>
					{label[0].toUpperCase() + label.slice(1)}
				</p>
			</div>
		{/if}
	</div>
</Hoverable>
