<script lang="ts">
	import {
		submit as submitExercise,
		result,
		pending,
		exercise,
		aborted
	} from 'src/utils/exercise/exercise';
	import Error from './Error.svelte';
	import Button from '../common/Button.svelte';
	import CircularProgressIndicator from '../loaders/CircularProgressIndicator.svelte';
	import Checkbox from './Checkbox.svelte';

	async function submit() {
		// If we are not already waiting for a submission
		if (!$pending) {
			await submitExercise();
		}
	}

	function nextExercise() {}
</script>

{#if $exercise}
	<div class="px-3 h-full">
		<p class="font-bold mb-1">{$exercise.name}</p>
		<p class="uppercase text-xs mb-1">Description</p>
		<p class="leading-5">{$exercise.description}</p>
		<p class="mt-3 uppercase text-xs mb-1">Requirements</p>
		<div class="space-y-3">
			{#if $result}
				{#each $result.results as result}
					<div class="flex flex-row items-center w-full">
						<p class="leading-5 flex-grow mr-1">{@html result.name}</p>
						<Checkbox value={result.passed} />
					</div>
					{#if !result.passed}
						<Error message={result.message} />
					{/if}
				{/each}
			{:else}
				{#each $exercise.requirements as requirement}
					<div class="flex flex-row items-center w-full">
						<p class="leading-5 flex-grow mr-1">{@html requirement}</p>
						<Checkbox />
					</div>
				{/each}
			{/if}
		</div>
		<Button
			text="Submit"
			classes="{$result && $result.passed == $result.total
				? 'bg-light-bglight dark:bg-dark-bglight'
				: 'bg-blue-700'} text-light-text hover:bg-opacity-50  dark:hover:bg-opacity-50 dark:text-dark-text h-7 mt-3"
			loading={$pending}
			on:click={submit}
		/>
		{#if $aborted}
			<div class="text-sm mt-3 p-2 bg-red-900 bg-opacity-50 rounded text-red-500">
				<p>Submission timed out.</p>
			</div>
		{:else if $result && $result.passed == $result.total}
			<Button
				text="Next exercise"
				classes="bg-blue-700 text-light-text hover:bg-opacity-50 dark:hover:bg-opacity-50 dark:text-dark-text h-7 mt-3"
				on:click={nextExercise}
			/>
		{/if}
	</div>
{:else}
	<div class="w-full flex justify-center">
		<CircularProgressIndicator />
	</div>
{/if}

<style lang="postcss">
	:global(code) {
		@apply font-bold;
	}
</style>
