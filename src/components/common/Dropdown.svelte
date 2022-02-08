<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { scale } from 'svelte/transition';
	let visible = false;
	let element: HTMLDivElement;

	function toggleMenu() {
		visible = !visible;
		console.log('clicked', visible);
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
	{#if visible}
		<div
			transition:scale={{ duration: 200 }}
			class="origin-top-right z-50 absolute right-0 mt-4 text-sm min-w-max rounded-md shadow-lg bg-white transition ease-out duration-100"
		>
			<slot name="menu" />
		</div>
	{/if}
</div>
