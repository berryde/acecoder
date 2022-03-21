<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from '../common/Button.svelte';
	import Controls from './Controls.svelte';
	import Features from './Features.svelte';

	let index = 0;

	function handleNext() {
		index = 1;
	}

	function handlePrevious() {
		index = 0;
	}

	const dispatch = createEventDispatcher();
	function handleFinish() {
		dispatch('finish');
	}
</script>

<div class="flex flex-col space-y-2 max-w-3xl h-80">
	{#if index == 0}
		<Controls />
		<div class="flex justify-end flex-grow items-end">
			<Button on:click={handleNext} text="Next" />
		</div>
	{:else}
		<Features />
		<div class="flex justify-between flex-grow items-end">
			<Button on:click={handlePrevious} text="Go back" outline={true} />
			<Button on:click={handleFinish} text="Let's begin!" />
		</div>
	{/if}
</div>
