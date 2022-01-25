<script lang="ts">
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';
	import ExerciseSettings from 'src/components/admin/exercise/ExerciseSettings.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { Exercise, Project } from 'src/utils/types';
	import { getExercise, getProject } from 'src/utils/project/project';
	import ProfileMenu from 'src/components/profile/ProfileMenu.svelte';

	let project: Project;
	let exercise: Exercise;
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

<PrivateRoute restricted={true} {loading}>
	<div
		class="max-w-screen min-h-screen bg-brand-editor-background flex justify-center items-center text-brand-text overflow-y-auto"
	>
		<div class="flex-grow lg:max-w-5xl h-full p-20 space-y-8">
			<div class="flex flex-row items-center justify-between">
				<p class="text-3xl font-bold">Exercise editor</p>
				<ProfileMenu />
			</div>
			<ExerciseSettings
				projectID={$page.params.projectID}
				exerciseID={$page.params.index}
				{exercise}
				{project}
			/>
		</div>
	</div>
</PrivateRoute>
