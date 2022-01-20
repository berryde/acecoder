<script lang="ts">
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';
	import ProfileImage from 'src/components/profile/ProfileImage.svelte';
	import ExerciseSettings from 'src/components/admin/ExerciseSettings.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { Project } from 'src/utils/types';
	import { loadProject } from 'src/utils/project/project';

	let project: Project;
	onMount(async () => {
		project = await loadProject($page.params.slug);
	});
</script>

<PrivateRoute restricted={true} loading={project == undefined}>
	<div
		class="w-screen h-screen bg-brand-editor-background flex justify-center items-center text-brand-text overflow-y-auto"
	>
		<div class="flex-grow lg:max-w-7xl h-full p-20 space-y-8">
			<div class="flex flex-row items-center justify-between">
				<p class="text-3xl font-bold">New exercise</p>
				<ProfileImage />
			</div>
			<ExerciseSettings creating={true} index={0} {project} />
		</div>
	</div>
</PrivateRoute>
