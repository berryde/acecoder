<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	export let variant: string;
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
		if (e.dataTransfer.getData('variant') == variant) {
			dispatch('dropped', e.dataTransfer.getData('text'));
		}
		count = 0;
	}
</script>

<div on:dragenter={enter} on:dragleave={leave} on:dragover={over} on:drop={drop}>
	<slot dropping={count > 0} />
</div>
