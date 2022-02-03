<script lang="ts">
	import { page } from '$app/stores';
	import { doc, setDoc, updateDoc } from 'firebase/firestore';

	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';
	import Button from 'src/components/common/Button.svelte';
	import Checkbox from 'src/components/common/Checkbox.svelte';
	import Navbar from 'src/components/navbar/Navbar.svelte';
	import { auth, db } from 'src/utils/firebase';
	import { capitalise } from 'src/utils/general';
	import {
		getAllExerciseMetadata,
		getProject,
		getProjectSettings
	} from 'src/utils/project/project';
	import type { ExerciseMetadata, Project, ProjectSettings } from 'src/utils/types';
	import { onMount } from 'svelte';

	let project: Project;
	let exercises: Record<string, ExerciseMetadata>;
	let settings: ProjectSettings;
	let loading = true;

	onMount(async () => {
		project = await getProject($page.params.projectID);
		exercises = await getAllExerciseMetadata($page.params.projectID);
		try {
			settings = await getProjectSettings($page.params.projectID);
		} catch (err) {
			settings = { progress: 0, language: project.languages[0], completed: false };
		}
		loading = false;
	});

	async function handleClick(index: string | number) {
		index = index.toString();
		if (index == '0') {
			await setDoc(doc(db, 'projects', $page.params.projectID, 'settings', auth.currentUser.uid), {
				language: settings.language,
				progress: index
			});
		} else {
			await updateDoc(
				doc(db, 'projects', $page.params.projectID, 'settings', auth.currentUser.uid),
				{
					progress: index
				}
			);
		}
		window.location.href = `/project/${$page.params.projectID}/exercise-${index}`;
	}
</script>

<svelte:head>
	<title>Project</title>
</svelte:head>

<PrivateRoute {loading}>
	<div
		class="w-screen min-h-screen bg-brand-editor-background flex flex-col items-center text-brand-text overflow-y-auto"
	>
		<Navbar />
		<div class="w-full lg:max-w-5xl h-full p-20 space-y-8">
			<p class="text-3xl font-bold">{project.name}</p>
			<p>{project.description}</p>
			<div class="bg-brand-accent rounded p-8 space-y-3">
				<div>
					<p class="text-lg font-bold">Project outline</p>
					{#each Object.entries(exercises) as [index, exercise]}
						<div
							class="flex items-center space-x-5 {settings.progress < parseInt(index) &&
								'opacity-50'}"
						>
							<Checkbox
								value={settings.progress > parseInt(index)}
								disabled={true}
								variant={settings.progress >= parseInt(index) ? 'default' : 'text'}
							/>
							<p
								on:click={() => handleClick(index)}
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
			</div>
		</div>
	</div>
</PrivateRoute>
