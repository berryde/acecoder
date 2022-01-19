<script lang="ts">
	import { onMount } from 'svelte';

	export let value: boolean = undefined;
	export let classes: string = '';

	let color = '';
	function getColour() {
		if (value != undefined) {
			color = value ? 'bg-green-500' : 'bg-red-500';
		} else {
			color = '';
		}
	}

	onMount(() => {
		getColour();
	});

	$: value && getColour();
</script>

<div
	class="h-3 w-3 border-2 {classes} rounded border-dark-text {color} border-brand-text flex-shrink-0"
/>
