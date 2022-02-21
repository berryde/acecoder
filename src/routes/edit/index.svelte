<script lang="ts">
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';
	import Button from 'src/components/common/Button.svelte';
	import Claim from 'src/components/admin/Claim.svelte';
	import { getDocs, collection } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { db } from 'src/utils/firebase';
	import type { Project } from 'src/utils/types';

	import ProjectCard from 'src/components/projects/ProjectCard.svelte';
	import Page from 'src/components/common/Page.svelte';

	let projects: { id: string; project: Project }[];
	let loading = true;
	onMount(async () => {
		loading = true;
		const snapshot = await getDocs(collection(db, 'projects'));
		projects = snapshot.docs.map((doc) => ({ id: doc.id, project: doc.data() as Project }));
		loading = false;
	});
</script>

<svelte:head>
	<title>Admin Dashboard - Acecoder</title>
</svelte:head>

<PrivateRoute restricted={true} {loading}>
	<Page>
		<p class="text-3xl font-bold">Admin dashboard</p>
		<Claim />
		<div class="flex flex-row items-center justify-between bg-brand-accent p-5 rounded">
			<div>
				<p class="font-bold">Create something new</p>
				<p>Open the project editor to create a new project.</p>
			</div>
			<Button
				text="New project"
				on:click={() => {
					window.location.href = '/edit/new';
				}}
			/>
		</div>
		<div class="flex flex-row items-center justify-between bg-brand-accent p-5 rounded">
			<div>
				<p class="font-bold">Modify badges</p>
				<p>Open the badge editor to create and update badges.</p>
			</div>
			<Button
				text="Badge editor"
				on:click={() => {
					window.location.href = '/edit/badges';
				}}
			/>
		</div>
		<div class="grid grid-cols-3 gap-4">
			{#each projects as project}
				<ProjectCard projectID={project.id} project={project.project} url={`/edit/${project.id}`} />
			{/each}
		</div>
	</Page>
</PrivateRoute>
