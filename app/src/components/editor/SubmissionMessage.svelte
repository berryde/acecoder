<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let progress = 0;
	const messages = [
		'💾 Downloading submission',
		'🗄️ Installing dependencies',
		'🧪 Running tests',
		'📝 Parsing results',
		'🧮 Returning scores',
		'🧹 Tidying up'
	];

	let interval: number;

	onMount(() => {
		interval = window.setInterval(() => {
			progress = progress + 1;
		}, 5000);
	});

	onDestroy(() => {
		window.clearInterval(interval);
	});
</script>

{#key progress}
	<div
		role="tooltip"
		class=" min-w-max transform bg-brand-accent rounded shadow-xl custom z-50 flex items-center py-1 px-3"
		in:fly={{ y: 200 }}
	>
		<p class=" z-10">{messages[progress]}</p>
	</div>
{/key}
