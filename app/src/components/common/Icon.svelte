<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import Hoverable from './Hoverable.svelte';

	/**
	 * The icon size to display.
	 */
	export let size: 'small' | 'medium' | 'large' | 'xl' = 'medium';

	/**
	 * Whether this icon is also a button.
	 */
	export let button: boolean = false;

	/**
	 * The label to show under this icon
	 */
	export let label: string | undefined = undefined;

	/**
	 * An aria role for this element
	 */
	export let aria: string | undefined = undefined;

	/**
	 * Whether this icon should be wrapped with a card
	 */
	export let card: boolean = false;

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
			case 'xl':
				return 'h-8 w-8';
			case 'medium':
			default:
				return 'h-4 w-4';
		}
	}
</script>

{#if label}
	<Hoverable let:hovering>
		<div class="relative">
			<div class="flex flex-col items-center">
				<div
					class="flex flex-col justify-center items-center {card &&
						'bg-brand-editor-background rounded-lg'} {size == 'small' ? 'p-1.5' : 'p-1'}"
					data-testid={testId}
					aria-label={aria}
					role={button ? 'button' : undefined}
					on:click={click}
				>
					<div class="{getDimensions()} flex-shrink-0 flex-grow-0">
						<slot />
					</div>
				</div>
			</div>
			{#if hovering}
				<div
					transition:fade={{ duration: 200 }}
					role="tooltip"
					class="absolute bg-brand-editor-background min-w-max origin-center left-1/2 -translate-x-1/2 z-30 mt-1 rounded px-2 py-1 transform text-xs shadow-xl"
				>
					{label[0].toUpperCase() + label.slice(1)}
				</div>
			{/if}
		</div>
	</Hoverable>
{:else}
	<div class="flex flex-col items-center">
		<div
			class="flex flex-col justify-center items-center {card &&
				'bg-brand-editor-background rounded-lg'} {size == 'small' ? 'p-1.5' : 'p-1'}"
		>
			{#if button}
				<button
					on:click={click}
					class="{getDimensions()} flex-shrink-0 flex-grow-0 text-brand-text text-light-text"
					aria-label={aria}
					data-testid={testId}><slot /></button
				>
			{:else}
				<div class="{getDimensions()} flex-shrink-0 flex-grow-0" data-testid={testId}>
					<slot />
				</div>
			{/if}
		</div>
	</div>
{/if}
