<script lang="ts">
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';
	import { onMount } from 'svelte';
	import Button from 'src/components/common/Button.svelte';
	import Navbar from 'src/components/navbar/Navbar.svelte';
	import { getProject, getProjectSettings, getStats } from 'src/utils/project/project';
	import { page } from '$app/stores';
	import type { Project, Badge as BadgeType } from 'src/utils/types';
	import Badge from 'src/components/projects/Badge.svelte';
	import { completeProject } from 'src/utils/firebase';
	import { points } from 'src/utils/exercise/exercise';

	let project: Project;
	let completed: boolean;
	let badges: BadgeType[] = [];
	let loading = true;
	onMount(async () => {
		loading = true;
		project = await getProject($page.params.projectID);
		const settings = await getProjectSettings($page.params.projectID);
		completed = settings.completed;
		if (!completed) {
			badges = await completeProject($page.params.projectID);
			points.set((await getStats()).points);
		}

		loading = false;
	});

	function handleDownload() {}
</script>

<PrivateRoute {loading}>
	<div
		class="w-screen min-h-screen bg-brand-editor-background flex flex-col items-center text-brand-text overflow-y-auto"
	>
		<Navbar />
		<div class="w-full lg:max-w-5xl h-full p-20 space-y-5">
			<div>
				<p class="text-3xl font-bold">Project completed</p>
				<p class="uppercase ">{project.name}</p>
			</div>

			{#if !completed && badges.length != 0}
				<div class="space-y-3 max-w-full overflow-x-auto">
					<p class="text-xl font-bold">New badges unlocked!</p>
					<div class="flex space-x-5">
						{#each badges as badge}
							<Badge {badge} />
						{/each}
					</div>
				</div>
			{/if}

			<div class="bg-brand-accent p-5 rounded">
				<p class="text-xl font-bold">Your project</p>
				<p>Download the finished project to share it with the world, or continue working on it.</p>
				<div class="flex justify-end space-x-3 mt-3">
					<!-- <Button text="Share on LinkedIn" outline={true} /> -->
					<Button text="Download" on:click={handleDownload} />
				</div>
			</div>
		</div>
	</div>
</PrivateRoute>
