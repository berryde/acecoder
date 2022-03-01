<script lang="ts">
	import Navbar from '../navbar/Navbar.svelte';

	/**
	 * Whether the navbar should be shown to the user
	 */
	export let navbar: boolean = true;
</script>

<div
	class="w-full min-h-screen bg-brand-background flex flex-col items-center text-brand-text overflow-y-auto"
>
	{#if navbar}
		<Navbar />
	{/if}
	<div class="w-full lg:max-w-6xl h-full px-20 py-10 space-y-8">
		<slot />
	</div>
</div>
