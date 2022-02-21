<script lang="ts">
	import Navbar from '../navbar/Navbar.svelte';
</script>

<div
	class="w-full min-h-screen bg-brand-background flex flex-col items-center text-brand-text overflow-y-auto"
>
	<Navbar />
	<div class="w-full lg:max-w-6xl h-full px-20 py-10 space-y-8">
		<slot />
	</div>
</div>
