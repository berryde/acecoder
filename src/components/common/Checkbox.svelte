<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let value: boolean = undefined;
	export let classes: string = '';
	export let disabled = false;

	type Variant = 'true-false' | 'default';
	export let variant: Variant = 'default';

	const dispatch = createEventDispatcher();

	function getColour(value) {
		if (value != undefined) {
			switch (variant) {
				case 'true-false':
					return value ? 'bg-green-500' : 'bg-red-500';
				default:
					return value
						? 'bg-brand-primary hover:bg-opacity-50'
						: disabled
						? ''
						: 'hover:bg-brand-primary hover:bg-opacity-50';
			}
		} else {
			return '';
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
	class="h-4 w-4 border-2 {classes} rounded border-dark-text {color} {variant == 'true-false'
		? 'border-brand-text'
		: 'border-brand-primary'} flex-shrink-0"
	on:click={handleClick}
/>
