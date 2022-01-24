<script lang="ts">
	import ProjectSettings from 'src/components/admin/ProjectSettings.svelte';
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';
	import ProfileImage from 'src/components/profile/ProfileImage.svelte';
	import { page } from '$app/stores';
	import Button from 'src/components/common/Button.svelte';
	import { onMount } from 'svelte';
	import type { ExerciseMetadata, Project } from 'src/utils/types';
	import { getExercises, getProject } from 'src/utils/project/project';

	let project: Project;
	let loading = true;
	let exercises: Record<string, ExerciseMetadata>;
	onMount(async () => {
		try {
			project = await getProject($page.params.projectID);
			exercises = await getExercises($page.params.projectID);
			loading = false;
		} catch (err) {
			window.location.href = '/error/404';
		}
	});

	function handleClick(exerciseID: string) {
		window.location.href = `/edit/${$page.params.projectID}/exercise-${exerciseID.slice(
			$page.params.projectID.length
		)}`;
	}
</script>

<PrivateRoute restricted={true} {loading}>
	<div
		class="w-screen min-h-screen bg-brand-editor-background flex justify-center items-center text-brand-text"
	>
		<div class="flex-grow lg:max-w-7xl h-full p-20 space-y-8">
			<div class="flex flex-row items-center justify-between">
				<p class="text-3xl font-bold">Project editor</p>
				<ProfileImage />
			</div>
			<ProjectSettings {project} projectID={$page.params.projectID} />
			<div class="flex flex-col bg-brand-accent p-8 rounded space-y-3">
				<div>
					<p class="text-xl font-bold">Exercises</p>
					<p>Select an exercise to open the exercise editor.</p>
				</div>
				{#each Object.entries(exercises) as [exerciseID, exercise]}
					<div
						class="bg-brand-background p-3 max-w-max rounded cursor-pointer"
						on:click={() => handleClick(exerciseID)}
					>
						<p>{exercise.name}</p>
					</div>
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
		</div>
	</div>
</PrivateRoute>
