<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let value: boolean | undefined = undefined;
	export let classes: string = '';
	export let disabled: boolean = false;
	export let aria = '';

	type Variant = 'true-false' | 'default' | 'text';
	export let variant: Variant = 'default';

	const dispatch = createEventDispatcher();

	function getColour(value: boolean | undefined) {
		switch (variant) {
			case 'true-false':
				return `border-brand-text ${value ? 'bg-green-500' : 'bg-red-500'}`;
			case 'text':
				return 'border-brand-text';
			default:
				return `border-brand-primary ${
					value ? 'bg-brand-primary' : disabled ? '' : 'hover:bg-brand-primary hover:bg-opacity-50'
				}`;
		}
	}

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
