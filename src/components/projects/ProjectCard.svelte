<script lang="ts">
	import Button from 'src/components/common/Button.svelte';
	import Progress from 'src/components/projects/Progress.svelte';
	import Checkbox from 'src/components/exercise/Checkbox.svelte';
	import { goto } from '$app/navigation';
	import type { Project } from 'src/utils/types';

	export let project: Project;

	function getCompletion(project: Project) {
		return Math.trunc(
			(project.exercises.filter((ex) => ex.completed).length / project.exercises.length) * 100
		);
	}

	function handleClick(project: Project) {
		goto('exercise/' + project.exercises.find((ex) => !ex.completed).id);
	}
</script>

<div class="p-10 bg-dark-bglight rounded space-y-3">
	<div class="flex flex-row justify-between">
		<p class="text-xl font-bold">{project.name}</p>
		<div class="flex flex-col items-end">
			<p class="mb-1">{getCompletion(project)}%</p>
			<Progress percentage={getCompletion(project)} />
		</div>
	</div>
	<p>{project.description}</p>
	<div>
		{#each project.exercises as exercise}
			<div class="flex flex-row items-center space-x-2">
				<Checkbox value={exercise.completed ? true : undefined} />
				<a class="hover:underline" href="exercise/{exercise.id}">{exercise.title}</a>
			</div>
		{/each}
	</div>
	{#if project.exercises.filter((ex) => !ex.completed).length > 0}
		<Button
			text="Start"
			classes="bg-blue-700 px-10 ml-auto w-24"
			on:click={() => handleClick(project)}
		/>
	{/if}
</div>
