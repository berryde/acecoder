<script lang="ts">
	import {
		submit as submitExercise,
		result,
		pending,
		exercise,
		aborted,
		nextExercise
	} from 'src/utils/exercise/exercise';
	import Error from './Error.svelte';
	import Button from '../common/Button.svelte';
	import Checkbox from './Checkbox.svelte';
	import { onMount } from 'svelte';

	let message: string | void;
	async function submit() {
		// If we are not already waiting for a submission
		if (!$pending) {
			message = await submitExercise();
		}
	}

	$: $aborted && (message = 'Submission timed out.');

	type Result = {
		passed: boolean | undefined;
		message?: string;
	};
	let results: Record<string, Result> = {};

	onMount(() => {
		if (!$result) {
			for (let i = 0; i < $exercise.requirements.length; i++) {
				results[$exercise.requirements[i]] = { passed: undefined };
			}
			results = results;
		}
	});

	function updateResults() {
		results = {};
		for (let i = 0; i < $result.results.length; i++) {
			results[$result.results[i].name] = {
				passed: $result.results[i].passed,
				message: $result.results[i].message
			};
		}
		results = results;
	}

	$: $result && updateResults();
</script>

<div class="px-3 h-full">
	<p class="font-bold mb-1">{$exercise.name}</p>
	<p class="uppercase text-xs mb-1">Description</p>
	<p class="leading-5">{$exercise.description}</p>
	<p class="mt-3 uppercase text-xs mb-1">Requirements</p>
	<div class="space-y-3">
		{#each Object.entries(results) as [name, result]}
			<div class="flex flex-row items-center w-full">
				<p class="leading-5 flex-grow mr-1">{@html name}</p>
				<Checkbox value={result.passed} />
			</div>
			{#if !result.passed && result.message}
				<Error message={result.message} />
			{/if}
		{/each}
	</div>
	<Button
		text="Submit"
		classes="{$result && $result.passed == $result.total
			? 'bg-light-bglight dark:bg-dark-bglight'
			: 'bg-blue-700'} text-light-text hover:bg-opacity-50  dark:hover:bg-opacity-50 dark:text-dark-text h-7 mt-3"
		loading={$pending}
		on:click={submit}
	/>
	{#if message}
		<div class="text-sm mt-3 p-2 bg-red-900 bg-opacity-50 rounded text-red-500">
			<p>{message}</p>
		</div>
	{/if}
	{#if $result && $result.passed == $result.total}
		<Button
			text="Next exercise"
			classes="bg-blue-700 text-light-text hover:bg-opacity-50 dark:hover:bg-opacity-50 dark:text-dark-text h-7 mt-3"
			on:click={nextExercise}
		/>
	{/if}
</div>

<style lang="postcss">
	:global(code) {
		@apply font-bold;
	}
</style>
