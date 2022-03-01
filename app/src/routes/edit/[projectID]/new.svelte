<script lang="ts">
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';
	import ExerciseSettings from 'src/components/admin/exercise/ExerciseSettings.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import { getProject } from 'src/utils/project/project';
	import ProfileMenu from 'src/components/profile/ProfileMenu.svelte';
	import type { Project } from '~shared/types';

	/**
	 * The selected project
	 */
	let project: Project;

	onMount(async () => {
		project = await getProject($page.params.projectID);
	});
</script>

<svelte:head>
	<title>New exercise - Acecoder</title>
</svelte:head>

<PrivateRoute restricted={true} loading={!project}>
	<div
		class="max-w-screen min-h-screen bg-brand-background flex justify-center items-center text-brand-text overflow-y-auto"
	>
		<div class="flex-grow lg:max-w-6xl h-full px-20 py-10 space-y-8">
			<div class="flex flex-row items-center justify-between">
				<p class="text-3xl font-bold">New exercise</p>
				<ProfileMenu />
			</div>
			<ExerciseSettings creating={true} projectID={$page.params.projectID} {project} />
		</div>
	</div>
</PrivateRoute>
