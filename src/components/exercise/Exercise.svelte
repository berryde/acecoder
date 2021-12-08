<script lang="ts">
	import {
		submit as submitExercise,
		result,
		listen,
		pending,
		exercise,
		exerciseID,
		aborted
	} from 'src/utils/exercise/exercise';
	import { filesystem } from 'src/utils/filesystem/filesystem';
	import Error from './Error.svelte';
	import Button from '../common/Button.svelte';
	import CircularProgressIndicator from '../loaders/CircularProgressIndicator.svelte';
	import { auth } from 'src/utils/auth/auth';
	import { onMount } from 'svelte';

	async function submit() {
		// If we are not already waiting for a submission
		if (!$pending) {
			const uid = $auth.uid;
			const eid = $exerciseID;
			await submitExercise($filesystem, uid, eid);
		}
	}

	function getResult(requirement: string) {
		return $result.results.find((res) => res.name == requirement);
	}

	function getColor(result: boolean) {
		return result ? 'bg-green-500' : 'bg-red-500';
	}

	onMount(() => {
		listen();
	});
</script>

{#if $exercise}
	<div class="px-3 h-full">
		<p class="uppercase text-xs mb-1">Description</p>
		<p class="leading-5">{$exercise.description}</p>

		<p class="mt-3 uppercase text-xs mb-1">Requirements</p>
		{#each $exercise.requirements as requirement}
			<div class="flex flex-row items-center w-full">
				<p class="leading-5 flex-grow">{requirement}</p>
				<div
					class="h-3 w-3 border-2 ml-2 rounded dark:border-dark-text {$result &&
						getColor(getResult(requirement).passed)} border-light-text flex-shrink-0"
				/>
			</div>
			{#if $result && !getResult(requirement).passed}
				<Error message={getResult(requirement).message} />
			{/if}
		{/each}
		<Button
			text="Submit"
			classes="bg-light-bglight text-light-text hover:bg-opacity-50 dark:bg-dark-bglight dark:hover:bg-opacity-50 dark:text-dark-text h-7 mt-2"
			loading={$pending}
			on:click={() => submit()}
		/>
		{#if $aborted}
			<div class="text-sm mt-3 p-2 bg-red-900 bg-opacity-50 rounded text-red-500">
				<p>Submission timed out.</p>
			</div>
		{/if}
	</div>
{:else}
	<div class="w-full flex justify-center">
		<CircularProgressIndicator />
	</div>
{/if}
