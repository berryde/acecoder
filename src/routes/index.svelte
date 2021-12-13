<script lang="ts">
	import ProjectCard from 'src/components/projects/ProjectCard.svelte';
	import type { Project } from 'src/utils/types';

	import PrivateRoute from '../components/auth/PrivateRoute.svelte';

	const projects: Project[] = [
		{
			name: 'To-Do List',
			description:
				'In this project you will create a to-do list, allowing you to add tasks and mark them as done.',
			exercises: [
				{ title: 'The list item', completed: true, id: 'vteMX6qHVEy6uku8sS3Z' },
				{ title: 'The list container', completed: true, id: 'vteMX6qHVEy6uku8sS3Z' },
				{ title: 'Adding state', completed: false, id: 'vteMX6qHVEy6uku8sS3Z' }
			]
		},
		{
			name: 'Tic-Tac-Toe',
			description:
				'In this project you will create a simple Tic-Tac-Toe game that you can share and play with your friends.',
			exercises: [
				{ title: 'The Tile Component', completed: false, id: 'YuZlEIWFL1dFUSwvWGGv' },
				{ title: 'The Grid Container', completed: false, id: 'YuZlEIWFL1dFUSwvWGGv' }
			]
		}
	];
</script>

<svelte:head>
	<title>Svelte Application</title>
</svelte:head>

<PrivateRoute>
	<div class="h-screen bg-dark-bgdark text-dark-text flex justify-center items-center">
		<div class="flex flex-col max-w-3xl space-y-6">
			<p class="text-2xl font-bold pb-6">Projects</p>
			{#each projects as project}
				<ProjectCard {project} />
			{/each}
		</div>
	</div>
</PrivateRoute>
