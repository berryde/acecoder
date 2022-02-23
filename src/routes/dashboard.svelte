<script lang="ts">
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';
	import { collection, getDocs } from 'firebase/firestore';
	import { getName } from 'src/utils/auth/auth';
	import type { Badge as BadgeType, Project } from 'src/utils/types';
	import { onMount } from 'svelte';
	import { auth, db } from 'src/utils/firebase';
	import ProjectCard from 'src/components/projects/ProjectCard.svelte';
	import { getBadges } from 'src/utils/project/project';
	import Page from 'src/components/common/Page.svelte';
	import Badges from 'src/components/profile/Badges.svelte';

	let projects: {
		id: string;
		project: Project;
	}[] = [];
	let greeting = getGreeting();
	let name = '';

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
		if (!auth.currentUser) {
			throw new Error('You need to be logged in to perform that action');
		}
		badges = await getBadges(auth.currentUser!.uid, {
			limit: 4
		});
		name = await getName(auth.currentUser.uid);
		loading = false;
	}
</script>

<svelte:head>
	<title>Dashboard - Acecoder</title>
</svelte:head>

<PrivateRoute {loading} on:authenticated={loadUserData}>
	<Page>
		<p class="text-3xl font-bold">{greeting}, {name}</p>
		{#if badges.length > 0}
			<div class=" items-center">
				<p class="text-lg font-bold">Recent achievements</p>
				<p class="mb-3">Unlock more achievements by completing projects.</p>
				<Badges {badges} />
			</div>
		{/if}
		<div>
			<div class=" items-center mb-3">
				<p class="text-lg font-bold">Projects</p>
				<p>Get started creating eye-catching, responsive websites.</p>
			</div>
			<div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
				{#each projects as project}
					<ProjectCard projectID={project.id} project={project.project} />
				{/each}
			</div>
		</div>
	</Page>
</PrivateRoute>
