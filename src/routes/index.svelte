<script lang="ts">
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';
	import ProfileMenu from 'src/components/profile/ProfileMenu.svelte';
	import { collection, getDocs } from 'firebase/firestore';
	import { getName } from 'src/utils/auth/auth';
	import type { Project } from 'src/utils/types';
	import { onMount } from 'svelte';
	import { db } from 'src/utils/firebase';
	import ProjectCard from 'src/components/projects/ProjectCard.svelte';

	let projects: {
		id: string;
		project: Project;
	}[] = [];
	let greeting = getGreeting();

	function getGreeting() {
		var today = new Date();
		var hour = today.getHours();

		if (hour < 12) {
			return 'Good morning';
		} else if (hour < 18) {
			return 'Good afternoon';
		} else {
			return 'Good evening';
		}
	}

	async function getProjects() {
		const snapshot = await getDocs(collection(db, 'projects'));
		snapshot.forEach((doc) => {
			projects.push({
				id: doc.id,
				project: doc.data() as Project
			});
		});
		projects = projects;
	}

	onMount(() => {
		getProjects();
	});
</script>

<svelte:head>
	<title>Svelte Application</title>
</svelte:head>

<PrivateRoute loading={projects.length == 0}>
	<div
		class="w-screen min-h-screen bg-brand-editor-background flex justify-center text-brand-text overflow-y-auto"
	>
		<div class="flex-grow lg:max-w-7xl h-full p-20 space-y-8">
			<div class="flex flex-row justify-between items-center">
				<p class="text-3xl font-bold">{greeting}, {getName()}</p>
				<ProfileMenu />
			</div>
			<div class=" items-center">
				<p class="text-lg font-bold">Beginner projects</p>
				<p>Get started creating eye-catching, responsive websites.</p>
			</div>
			<div class="grid grid-cols-3 gap-4">
				{#each projects as project}
					<ProjectCard projectID={project.id} project={project.project} />
				{/each}
			</div>
		</div>
	</div>
</PrivateRoute>
