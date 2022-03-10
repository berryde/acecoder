<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	/**
	 * The state of the checkbox
	 */
	export let value: boolean | undefined = undefined;

	/**
	 * Additional classes to style the checkbox with
	 */
	export let classes: string = '';

	/**
	 * Whether the checkbox is disabled
	 */
	export let disabled: boolean = false;

	/**
	 * The aria roles to use for the checkbox input element
	 */
	export let aria = '';

	type Variant = 'true-false' | 'default' | 'text';

	/**
	 * The variant to use, determining the checkbox's colors
	 */
	export let variant: Variant = 'default';

	const dispatch = createEventDispatcher();

	/**
	 * Get the color based on the variant and state
	 * @param value The state of the input
	 */
	function getColour(value: boolean | undefined) {
		switch (variant) {
			case 'true-false':
				if (value !== undefined) {
					return value
						? 'border-brand-success bg-brand-success'
						: 'border-brand-danger-light bg-brand-danger-light';
				}
				return 'border-brand-text';
			case 'text':
				return 'border-brand-text';
			default:
				return `border-brand-primary ${
					value ? 'bg-brand-primary' : disabled ? '' : 'hover:bg-brand-primary hover:bg-opacity-50'
				}`;
		}
	}

	/**
	 * Called when the component is clicked
	 */
	function handleClick() {
		if (!disabled) {
			dispatch('click');
		}
	}

	$: color = getColour(value);
</script>

<div
	class="transition-all h-4 w-4 border-2 {classes} rounded {color} flex-shrink-0"
	role="checkbox"
	aria-disabled="true"
	aria-label={aria}
	checked={value}
	on:click={handleClick}
/>
