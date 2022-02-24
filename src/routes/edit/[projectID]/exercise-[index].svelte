<script lang="ts">
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';
	import ExerciseSettings from 'src/components/admin/exercise/ExerciseSettings.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { Exercise, Project } from 'src/utils/types';
	import { getExercise } from 'src/utils/admin/admin';
	import ProfileMenu from 'src/components/profile/ProfileMenu.svelte';
	import { getProject } from 'src/utils/project/project';

	/**
	 * The selected project
	 */
	let project: Project;

	/**
	 * The exercise being edited
	 */
	let exercise: Exercise;

	/**
	 * Whether the page is loading
	 */
	let loading = true;

	onMount(async () => {
		try {
			project = await getProject($page.params.projectID);
			exercise = await getExercise($page.params.projectID, $page.params.index, project.languages);
			loading = false;
		} catch (err) {
			console.error(err);
			window.location.href = '/error/404';
		}
	});
</script>

<svelte:head>
	<title>Exercise editor - Acecoder</title>
</svelte:head>

<PrivateRoute restricted={true} {loading}>
	<div
		class="max-w-screen min-h-screen bg-brand-background flex justify-center items-center text-brand-text overflow-y-auto"
	>
		<div class="flex-grow lg:max-w-6xl h-full px-20 py-10 space-y-8">
			<div class="flex flex-row items-center justify-between">
				<p class="text-3xl font-bold">Exercise editor</p>
				<ProfileMenu />
			</div>
			<a href={`/edit/${$page.params.projectID}`} class="text-brand-primary">Back to project</a>
			<ExerciseSettings
				projectID={$page.params.projectID}
				exerciseID={$page.params.index}
				{exercise}
				{project}
			/>
		</div>
	</div>
</PrivateRoute>
