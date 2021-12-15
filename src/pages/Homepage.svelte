<script lang="ts">
	import { doc, getDoc } from 'firebase/firestore';
	import OrbitProgressIndicator from 'src/components/loaders/OrbitProgressIndicator.svelte';
	import ProjectCard from 'src/components/projects/ProjectCard.svelte';
	import { auth, db } from 'src/utils/firebase';
	import type { Project, TestResult } from 'src/utils/types';
	import { onMount } from 'svelte';

	let loading = true;
	let projects: Project[] = [];

	onMount(async () => {
		loading = true;
		projects = [
			{
				name: 'Tic-Tac-Toe',
				description:
					'In this project you will create a simple Tic-Tac-Toe game. You can read about the rules of the game <a class="text-blue-600 hover:underline" href="https://en.wikipedia.org/wiki/Tic-tac-toe">here</a>. This project assesses state management and logic skills.',
				exercises: [
					{
						title: 'The Tile Component',
						completed: await getCompletion('UyeKB6A7WDY36JbxJNfv'),
						id: 'UyeKB6A7WDY36JbxJNfv'
					},
					{
						title: 'The Grid Container',
						completed: await getCompletion('jDEy1lLb3VHPfpg4y0Vo'),
						id: 'jDEy1lLb3VHPfpg4y0Vo'
					}
				]
			}
		];
		loading = false;
	});

	async function getCompletion(id: string): Promise<boolean> {
		const result = await getDoc(doc(db, 'results', id + auth.currentUser.uid));
		if (result.exists()) {
			const data = result.data() as TestResult;
			return data.passed === data.total;
		}
		return false;
	}
</script>

<div class="h-screen bg-dark-bgdark text-dark-text flex justify-center items-center">
	{#if loading}
		<OrbitProgressIndicator />
	{:else}
		<div class="flex flex-col max-w-3xl space-y-6">
			<p class="text-2xl font-bold pb-6">Projects</p>
			{#each projects as project}
				<ProjectCard {project} />
			{/each}
		</div>
	{/if}
</div>
