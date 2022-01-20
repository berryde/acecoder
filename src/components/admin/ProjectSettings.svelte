<script lang="ts">
	import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
	import Button from 'src/components/common/Button.svelte';
	import Input from 'src/components/common/Input.svelte';
	import Checkbox from 'src/components/common/Checkbox.svelte';
	import { db } from 'src/utils/firebase';
	import { onMount } from 'svelte';
	import type { Project, ProjectDifficulty, ProjectLanguage } from 'src/utils/types';
	import { loadProject } from 'src/utils/project/project';
	import { capitalise } from 'src/utils/general';

	const difficulties: ProjectDifficulty[] = ['easy', 'medium', 'hard'];

	/**
	 * Whether these settings are for the creation of a new project.
	 */
	export let creating = false;
	/**
	 * The ID of the project being updated.
	 */
	export let id: string = undefined;
	let editing = creating;
	let errors: string[] = [];
	const languages: ProjectLanguage[] = ['react', 'svelte'];

	function selectProjectLanguage(index: number) {
		if (!project.languages.includes(languages[index])) {
			project.languages.push(languages[index]);
		}
	}

	function validate() {
		let output = [];
		if (project.languages.length == 0) {
			output.push('At least one language must be activated.');
		}
		if (project.name.length == 0) {
			output.push('The project name is missing.');
		}
		if (project.name.length == 0) {
			output.push('The project description is missing.');
		}
		return output;
	}

	let loading = false;
	async function submit() {
		loading = true;
		errors = validate();
		if (errors.length == 0) {
			try {
				if (creating) {
					const ref = await addDoc(collection(db, 'projects'), project);
					window.location.href = '/projects/' + ref.id;
				} else {
					await setDoc(doc(db, 'projects', id), project);
					toggleEdit();
				}
			} catch (err) {
				errors = [
					'The project could not be created due to an error. Please ensure you have the correct permissions and try again later.'
				];
			}
		}
		loading = false;
	}

	function toggleEdit() {
		editing = !editing;
	}

	let initialising = false;
	let project: Project = {
		difficulty: 'easy',
		languages: [],
		name: '',
		description: ''
	};
	onMount(async () => {
		if (!creating) {
			initialising = true;
			project = await loadProject(id);
			initialising = false;
		}
	});
</script>

<form class="flex flex-col bg-brand-accent p-8 rounded space-y-3">
	<div class="flex flex-row justify-between items-center">
		<p class="text-xl font-bold">Settings</p>
		{#if !creating && !editing}
			<p class="text-brand-primary cursor-pointer" on:click={toggleEdit}>Edit</p>
		{/if}
	</div>
	<div class="space-y-1">
		<p>Name</p>
		{#if editing}
			<Input variant="dark" bind:value={project.name} />
		{:else}
			<p>{project.name}</p>
		{/if}
	</div>
	<div class="space-y-1">
		<p>Difficulty</p>
		{#if editing}
			<select
				bind:value={project.difficulty}
				class="bg-brand-background rounded p-1"
				name="difficulty"
			>
				{#each difficulties as difficulty}
					<option value={difficulty}>{capitalise(difficulty)}</option>
				{/each}
			</select>
		{:else}
			<p>{capitalise(project.difficulty)}</p>
		{/if}
	</div>
	<div class="space-y-1">
		<p>Description</p>
		{#if editing}
			<textarea
				class="bg-brand-background rounded p-2 w-full h-28"
				name="description"
				bind:value={project.description}
			/>
		{:else}
			<p>{project.description}</p>
		{/if}
	</div>
	<div class="space-y-1">
		<p>Language support</p>
		<fieldset id="language" class="flex flex-col">
			{#each languages as language, index}
				<div class="flex flex-row items-center space-x-3">
					<Checkbox
						disabled={!editing}
						value={project.languages.includes(language)}
						on:click={() => selectProjectLanguage(index)}
					/>
					<p>{capitalise(language)}</p>
				</div>
			{/each}
		</fieldset>
	</div>
	{#if errors.length > 0}
		<div class="bg-brand-danger-dark bg-opacity-50 p-3 rounded text-brand-danger-light">
			<p>The following errors were found with this form:</p>
			<ol class="list-decimal flex-col pl-8">
				{#each errors as error}
					<li>{error}</li>
				{/each}
			</ol>
		</div>
	{/if}
	{#if creating}
		<div class="flex flex-row justify-end">
			<Button text="Create" on:click={submit} {loading} />
		</div>
	{:else if editing}
		<div class="flex flex-row justify-end space-x-3">
			<Button text="Cancel" variant="danger" outline={true} on:click={toggleEdit} />
			<Button text="Update" on:click={submit} {loading} />
		</div>
	{/if}
</form>
