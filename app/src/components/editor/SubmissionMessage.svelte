<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { SUBMISSION_MESSAGES } from 'src/utils/constants';

	let progress = 0;

	let interval: number;

	onMount(() => {
		interval = window.setInterval(() => {
			progress = progress + 1;
		}, 5000);
	});

	onDestroy(() => {
		window.clearInterval(interval);
	});

	$: progress == SUBMISSION_MESSAGES.length - 1 && window.clearInterval(interval);
</script>

{#key progress}
	<div
		role="tooltip"
		class=" min-w-max transform bg-brand-accent rounded shadow-xl custom z-50 flex items-center py-1 px-3"
		in:fly={{ y: 200 }}
	>
		<p class=" z-10">{SUBMISSION_MESSAGES[progress]}</p>
	</div>
{/key}
