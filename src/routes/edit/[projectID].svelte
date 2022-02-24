<script lang="ts">
	import ProjectSettings from 'src/components/admin/ProjectSettings.svelte';
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';
	import Page from 'src/components/common/Page.svelte';
	import { page } from '$app/stores';
	import Button from 'src/components/common/Button.svelte';
	import { onMount } from 'svelte';
	import type { ExerciseMetadata, Project } from 'src/utils/types';
	import { getProjectExercises, getProject } from 'src/utils/project/project';

	/**
	 * The selected project
	 */
	let project: Project;

	/**
	 * Whether the page is loading
	 */
	let loading = true;

	/**
	 * The exercises in the project
	 */
	let exercises: Record<string, ExerciseMetadata>;

	onMount(async () => {
		try {
			project = await getProject($page.params.projectID);
			exercises = await getProjectExercises($page.params.projectID);
			loading = false;
		} catch (err) {
			window.location.href = '/error/404';
		}
	});
</script>

<svelte:head>
	<title>Project editor - Acecoder</title>
</svelte:head>

<PrivateRoute restricted={true} {loading}>
	<Page>
		<p class="text-3xl font-bold">Project editor</p>
		<a href={`/edit`} class="text-brand-primary">Back to projects</a>
		<ProjectSettings {project} projectID={$page.params.projectID} />
		<div class="flex flex-col bg-brand-accent p-8 rounded space-y-3">
			<div>
				<p class="text-xl font-bold">Exercises</p>
				<p>Select an exercise to open the exercise editor.</p>
			</div>
			{#each Object.entries(exercises) as [exerciseID, exercise]}
				<a href={`/edit/${$page.params.projectID}/exercise-${exerciseID}`}>
					<div class="bg-brand-background p-3 max-w-max rounded cursor-pointer">
						<p>{exercise.name}</p>
					</div>
				</a>
			{/each}
			<div class="flex justify-end">
				<Button
					text="New exercise"
					on:click={() => {
						window.location.href = '/edit/' + $page.params.projectID + '/new';
					}}
				/>
			</div>
		</div>
	</Page>
</PrivateRoute>
