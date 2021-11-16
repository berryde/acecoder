<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let size: 'small' | 'medium' | 'large' = 'medium';
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

<div class="{getDimensions()} flex-shrink-0 flex-grow-0" on:click={click} data-testid={testId}>
	<slot />
</div>
