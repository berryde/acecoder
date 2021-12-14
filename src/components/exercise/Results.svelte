<script lang="ts">
	import { nextExercise, result } from 'src/utils/exercise/exercise';
	import Checkbox from './Checkbox.svelte';
	import Error from './Error.svelte';
	import Button from '../common/Button.svelte';
	import { onMount } from 'svelte';
	import confetti from 'canvas-confetti';

	onMount(async () => {
		if ($result.results.every((res) => res.passed)) {
			await confetti();
		}
	});
</script>

{#each $result.results as result}
	<div class="flex flex-row items-center w-full">
		<p class="leading-5 flex-grow mr-1">{@html result.name}</p>
		<Checkbox value={result.passed} />
	</div>
	{#if !result.passed}
		<Error message={result.message} />
	{/if}
{/each}
{#if $result.results.every((res) => res.passed)}
	<div class="bg-green-900 bg-opacity-50 rounded p-3 text-green-500 mt-3">
		Congratulations! You have passed all of the requirements for this exercise.
	</div>
	<Button text="Next exercise" classes="bg-blue-700 w-32 float-right" on:click={nextExercise} />
{:else}
	<div class="bg-red-900 bg-opacity-50 rounded p-3 text-red-500 mt-3">
		Not quite! You have passed {$result.passed}/{$result.total} requirements for this exercise.
	</div>
{/if}
