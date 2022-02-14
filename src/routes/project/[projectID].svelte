<script lang="ts">
	import { page } from '$app/stores';
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';
	import Button from 'src/components/common/Button.svelte';
	import More from 'svelte-icons/io/IoIosMore.svelte';
	import Checkbox from 'src/components/common/Checkbox.svelte';
	import Navbar from 'src/components/navbar/Navbar.svelte';
	import { startProject } from 'src/utils/firebase';
	import { capitalise } from 'src/utils/general';
	import {
		getProjectExercises,
		getProject,
		getProjectSettings,
		restartProject
	} from 'src/utils/project/project';
	import type { ExerciseMetadata, Project, ProjectSettings } from 'src/utils/types';
	import { onMount } from 'svelte';
	import Icon from 'src/components/common/Icon.svelte';
	import Dropdown from 'src/components/common/Dropdown.svelte';
	import Download from 'src/components/projects/Download.svelte';
	import Card from 'src/components/common/Card.svelte';
	import CircularProgressIndicator from 'src/components/loaders/CircularProgressIndicator.svelte';

	let project: Project;
	let exercises: Record<string, ExerciseMetadata>;
	let settings: ProjectSettings;
	let loading = true;

	onMount(async () => {
		project = await getProject($page.params.projectID);
		exercises = await getProjectExercises($page.params.projectID);
		try {
			settings = await getProjectSettings($page.params.projectID, project.languages[0]);
		} catch (err) {
			settings = { progress: 0, language: project.languages[0], completed: false };
		}
		loading = false;
	});

	async function handleClick(index: string | number) {
		index = index.toString();
		if (index == '0') {
			await startProject($page.params.projectID, settings.language);
		}
		window.location.href = `/project/${$page.params.projectID}/exercise-${index}`;
	}

	let restarting = false;
	async function handleRestart(e: MouseEvent) {
		e.stopPropagation();
		restarting = true;
		await restartProject($page.params.projectID);
		location.reload();
	}
</script>

<svelte:head>
	<title>Project</title>
</svelte:head>

<PrivateRoute {loading}>
	<div
		class="w-screen min-h-screen bg-brand-background flex flex-col items-center text-brand-text overflow-y-auto"
	>
		<Navbar />
		<div class="w-full lg:max-w-5xl h-full p-20 space-y-8">
			<h1 class="text-3xl font-bold">{project.name}</h1>
			<p>{project.description}</p>
			<Card title="Project outline">
				<Dropdown slot="action">
					<div slot="button">
						<Icon card={true} button={true} aria="project settings">
							<More />
						</Icon>
					</div>
					<div slot="menu" class="block origin-top-right">
						{#if restarting}
							<div class="p-3 w-20 flex items-center justify-center">
								<CircularProgressIndicator variant="dark" />
							</div>
						{:else}
							<div
								class="p-3 text-brand-danger-light block"
								on:click={handleRestart}
								role="button"
								aria-label="project settings"
							>
								<p>Restart project</p>
							</div>
						{/if}
					</div>
				</Dropdown>

				<div>
					{#each Object.entries(exercises) as [index, exercise]}
						<div
							class="flex items-center space-x-5 {settings.progress < parseInt(index) &&
								'opacity-50'}"
						>
							<Checkbox
								value={settings.progress > parseInt(index) || settings.completed}
								disabled={true}
								aria="exercise completed"
								variant={settings.progress >= parseInt(index) ? 'default' : 'text'}
							/>
							<p
								on:click={() => handleClick(index)}
								role="link"
								tabindex={settings.progress >= parseInt(index) ? 0 : undefined}
								class={settings.progress >= parseInt(index) ? 'cursor-pointer ' : 'cursor-default'}
							>
								{exercise.name}
							</p>
						</div>
					{/each}
				</div>
				{#if settings.progress == 0}
					<div>
						<p class="text-lg font-bold">Project settings</p>
						<p>
							Select a front-end framework to use for this project. It is not possible to change
							this choice later on without restarting the project.
						</p>
						{#each project.languages as language}
							<div class="flex items-center space-x-5">
								<input
									type="radio"
									bind:group={settings.language}
									value={language}
									id="radio-{language}"
								/>
								<label for="radio-language">{capitalise(language)}</label>
							</div>
						{/each}
					</div>
				{/if}
				<div class="flex justify-end">
					<Button
						text={settings.progress == 0 ? 'Start' : 'Resume'}
						on:click={() => handleClick(settings.progress)}
					/>
				</div>
			</Card>
			{#if settings.completed}
				<Download {settings} />
			{/if}
		</div>
	</div>
</PrivateRoute>
