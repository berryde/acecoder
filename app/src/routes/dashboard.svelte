<script lang="ts">
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';
	import { collection, getDocs } from 'firebase/firestore';
	import { getName } from 'src/utils/auth/auth';
	import type { Badge as BadgeType, Project } from '~shared/types';
	import { onMount } from 'svelte';
	import { auth, db } from 'src/utils/firebase';
	import ProjectCard from 'src/components/projects/ProjectCard.svelte';
	import { getBadges } from 'src/utils/project/project';
	import Page from 'src/components/common/Page.svelte';
	import Badges from 'src/components/profile/Badges.svelte';
	import Card from 'src/components/common/Card.svelte';
	import Button from 'src/components/common/Button.svelte';

	/**
	 * The projects available to the user
	 */
	let projects: {
		id: string;
		project: Project;
	}[] = [];

	/**
	 * The greeting to show the user, based on the time of day
	 */
	let greeting = getGreeting();

	/**
	 * The user's name
	 */
	let name = '';

	/**
	 * The user's badges
	 */
	let badges: BadgeType[] = [];

	/**
	 * Whether the user data is currently being set
	 */
	let loading = true;

	/**
	 * Get the greeting based on the time of day
	 */
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

	/**
	 * Get the projects available to the user
	 */
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

	/**
	 * Fetch the name and badges of the current user
	 */
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

	onMount(() => {
		getProjects();
	});
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
					<ProjectCard project={project.project} url={`/project/${project.id}`} />
				{/each}
			</div>
		</div>
		<Card title="Share your thoughts">
			<p>
				In order to improve the application for its users, please use this survey to let us know
				what you think. It's completely anonymous and should only take a few minutes.
			</p>
			<p>
				You should try to complete the 'Personal Portfolio' project before starting the survey, to
				ensure that you have a strong understanding of the application.
			</p>
			<div class="flex justify-end">
				<a href="https://southampton.qualtrics.com/jfe/form/SV_efBcpn2O3c6kSOO">
					<Button text="Take the survey" /></a
				>
			</div>
		</Card>
	</Page>
</PrivateRoute>
