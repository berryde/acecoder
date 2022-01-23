<script lang="ts">
	import { page } from '$app/stores';
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';
	import Checkbox from 'src/components/common/Checkbox.svelte';
	import ProfileMenu from 'src/components/profile/ProfileMenu.svelte';
	import { getExercises, getProject } from 'src/utils/project/project';
	import type { ExerciseMetadata, Project } from 'src/utils/types';
	import { onMount } from 'svelte';

	let project: Project;
	let exercises: Record<string, ExerciseMetadata>;
	let loading = true;
	onMount(async () => {
		project = await getProject($page.params.projectID);
		exercises = await getExercises($page.params.projectID);
		loading = false;
	});
</script>

<PrivateRoute {loading}>
	<div
		class="w-screen min-h-screen bg-brand-editor-background flex justify-center text-brand-text overflow-y-auto"
	>
		<div class="flex-grow lg:max-w-7xl h-full p-20 space-y-8">
			<div class="flex flex-row justify-between items-center">
				<p class="text-3xl font-bold">{project.name}</p>
				<ProfileMenu />
			</div>
			<p>{project.description}</p>
			<div>
				<p class="text-lg font-bold">Project outline</p>
				{#each Object.entries(exercises) as [exerciseID, exercise]}
					<div class="flex fkex-row items-center space-x-5">
						<Checkbox />
						<a href="/project/{$page.params.projectID}/{exerciseID}">{exercise.name}</a>
					</div>
				{/each}
			</div>
		</div>
	</div>
</PrivateRoute>
