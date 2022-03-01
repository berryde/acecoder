<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	/**
	 * The drop event variant that this is. Only drop events matching this variant will be handled.
	 */
	export let variant: string;

	export let classes: string = '';

	let count = 0;

	function enter() {
		count += 1;
	}

	function leave() {
		count -= 1;
	}

	function over(e: DragEvent) {
		e.preventDefault();
	}

	function drop(e: DragEvent) {
		if (e.dataTransfer && e.dataTransfer.getData('variant') == variant) {
			dispatch('dropped', e.dataTransfer.getData('text'));
		}
		count = 0;
	}
</script>

<div
	on:dragenter={enter}
	on:dragleave={leave}
	on:dragover={over}
	on:drop={drop}
	data-testid="dropzone"
	class={classes}
>
	<slot dropping={count > 0} />
</div>
