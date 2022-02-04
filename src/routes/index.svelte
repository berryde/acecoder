<script lang="ts">
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';
	import { collection, getDocs } from 'firebase/firestore';
	import { getName } from 'src/utils/auth/auth';
	import type { Badge as BadgeType, Project } from 'src/utils/types';
	import { onMount } from 'svelte';
	import { db } from 'src/utils/firebase';
	import ProjectCard from 'src/components/projects/ProjectCard.svelte';
	import Navbar from 'src/components/navbar/Navbar.svelte';
	import { getBadges, getStats } from 'src/utils/project/project';
	import Badge from 'src/components/projects/Badge.svelte';
	import { points } from 'src/utils/exercise/exercise';

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

	let badges: BadgeType[] = [];
	onMount(() => {
		getProjects();
	});

	let loading = true;
	async function loadUserData() {
		points.set((await getStats()).points);
		badges = await getBadges(4);
		loading = false;
	}
</script>

<svelte:head>
	<title>Svelte Application</title>
</svelte:head>

<PrivateRoute {loading} on:authenticated={loadUserData}>
	<div
		class="w-screen min-h-screen bg-brand-editor-background flex flex-col items-center text-brand-text overflow-y-auto"
	>
		<Navbar />
		<div class="w-full lg:max-w-5xl h-full p-20 space-y-8">
			<p class="text-3xl font-bold">{greeting}, {getName()}</p>
			{#if badges.length > 0}
				<div class=" items-center">
					<p class="text-lg font-bold">Recent badges</p>
					<p class="mb-8">
						Unlock more badges by completing projects and levelling up. Select a badge to view its
						unique certificate.
					</p>
					<div class="flex flex-row space-x-3 w-full overflow-x-auto">
						{#each badges as badge}
							<div class="cursor-pointer">
								<Badge {badge} showAmount={false} />
							</div>
						{/each}
					</div>
				</div>
			{/if}
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
