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
		badges = await getBadges({
			limit: 4
		});
		loading = false;
	}
</script>

<svelte:head>
	<title>Folio</title>
</svelte:head>

<PrivateRoute {loading} on:authenticated={loadUserData}>
	<div
		class="w-screen min-h-screen bg-brand-background flex flex-col items-center text-brand-text overflow-y-auto"
	>
		<Navbar />
		<div class="w-full lg:max-w-5xl h-full p-20 space-y-8">
			<p class="text-3xl font-bold">{greeting}, {getName()}</p>
			{#if badges.length > 0}
				<div class=" items-center">
					<p class="text-lg font-bold">Recent achievements</p>
					<p class="mb-3">Unlock more achievements by completing projects.</p>
					<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
						{#each badges as badge}
							<Badge {badge} />
						{/each}
					</div>
				</div>
			{/if}
			<div>
				<div class=" items-center mb-3">
					<p class="text-lg font-bold">Projects</p>
					<p>Get started creating eye-catching, responsive websites.</p>
				</div>
				<div class="grid grid-cols-3 gap-4">
					{#each projects as project}
						<ProjectCard projectID={project.id} project={project.project} />
					{/each}
				</div>
			</div>
		</div>
	</div>
</PrivateRoute>
