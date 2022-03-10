<script lang="ts">
	import { page } from '$app/stores';
	import { exercise, passed, project, result } from 'src/utils/exercise/exercise';
	import { getProjectSettings, incrementProgress } from 'src/utils/project/project';
	import { createEventDispatcher } from 'svelte';
	import Button from '../common/Button.svelte';
	import Toast from '../common/Toast.svelte';
	import SubmissionMessage from '../editor/SubmissionMessage.svelte';

	/**
	 * The index of the exercise
	 */
	const index = parseInt($page.params.index);

	const dispatch = createEventDispatcher();

	export let loading: boolean;

	/**
	 * Called when the user clicks the 'next' button
	 */
	async function handleNext() {
		const progress = (await getProjectSettings($page.params.projectID)).progress;
		if (progress == parseInt($page.params.index)) {
			await incrementProgress($page.params.projectID, progress);
		}
		window.location.href = `/project/${$page.params.projectID}/exercise-${index + 1}`;
	}

	/**
	 * Called when the user clicks the 'previous' button
	 */
	function handlePrevious() {
		if (index > 0) {
			window.location.href = `/project/${$page.params.projectID}/exercise-${index - 1}`;
		}
	}

	function submit() {
		dispatch('submit');
	}
</script>

<div
	class="px-5 py-3 flex flex-row w-full justify-between bg-brand-background items-center relative"
>
	<div class="flex-grow w-full">
		{#if $page.params.index !== '0'}
			<Button text="Previous" on:click={handlePrevious} outline={true} link={true} />
		{/if}
	</div>
	<p>{index + 1}/{$project.exerciseCount}</p>
	<div class="flex space-x-5 flex-grow justify-end w-full">
		{#if $exercise.assessed}
			<div class="relative flex flex-row space-x-3">
				{#if loading}
					<SubmissionMessage />
				{/if}
				{#if !passed($result)}
					<Button text="Submit" on:click={submit} {loading} />
				{:else}
					<Button text="Re-submit" on:click={submit} outline={true} {loading} />
				{/if}
			</div>
		{/if}
		{#if passed($result) || !$exercise.assessed}
			{#if index + 1 == $project.exerciseCount}
				<a href={`/project/${$page.params.projectID}/finish`}
					><Button text="Finish" link={true} /></a
				>
			{:else}
				<Button text="Next" on:click={handleNext} link={true} />
			{/if}
		{/if}
	</div>
	<Toast />
</div>
