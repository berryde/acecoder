<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	let visible = false;
	let element: HTMLDivElement;

	function toggleMenu() {
		visible = !visible;
	}

	onMount(async () => {
		window.addEventListener('click', handleClickAway);
		element.addEventListener('click', toggleMenu);
	});

	function handleClickAway(e: MouseEvent) {
		if (!element.contains(e.target as Node)) {
			visible = false;
		}
	}

	onDestroy(() => {
		window.removeEventListener('click', handleClickAway);
		element.removeEventListener('click', toggleMenu);
	});
</script>

<div bind:this={element} class="cursor-pointer relative">
	<slot name="button" />
	<div
		class="origin-top-right absolute right-0 mt-4 text-sm min-w-max rounded-md shadow-lg bg-white transition ease-out duration-100 {!visible
			? 'transform opacity-0 scale-95'
			: 'transform opacity-100 scale-100'}"
	>
		{#if visible}
			<div>
				<slot name="menu" />
			</div>
		{/if}
	</div>
</div>
