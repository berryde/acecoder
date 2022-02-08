<script lang="ts">
	import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
	import Button from 'src/components/common/Button.svelte';
	import Input from 'src/components/common/Input.svelte';
	import Checkbox from 'src/components/common/Checkbox.svelte';
	import { db } from 'src/utils/firebase';
	import type { Project } from 'src/utils/types';
	import { capitalise } from 'src/utils/general';

	/**
	 * Whether these settings are for the creation of a new project.
	 */
	export let creating = false;
	let editing = creating;
	/**
	 * The ID of the project being updated.
	 */
	export let projectID: string | null = null;
	export let project: Project = {
		languages: [],
		name: '',
		description: '',
		exerciseCount: 0,
		icon: ''
	};
	let errors: string[] = [];
	const languages: string[] = ['react', 'svelte'];

	function toggleProjectLanguage(language: string) {
		if (project.languages.includes(language)) {
			project.languages.splice(project.languages.indexOf(language), 1);
		} else {
			project.languages.push(language);
		}
		project = project;
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
					window.location.href = '/edit/' + ref.id;
				} else if (projectID != null) {
					await updateDoc(doc(db, 'projects', projectID), project);
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
		<p>Icon</p>
		{#if editing}
			<a href="https://svelte-icons-explorer.vercel.app/" class="text-brand-primary text-xs"
				>Browse icons</a
			>
			<Input variant="dark" bind:value={project.icon} />
		{:else}
			<code class="bg-brand-background p-1 rounded">{project.icon}</code>
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
			{#each languages as language}
				<div class="flex flex-row items-center space-x-3">
					<Checkbox
						disabled={!editing}
						value={project.languages.includes(language)}
						on:click={() => toggleProjectLanguage(language)}
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
