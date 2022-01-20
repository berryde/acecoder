<script lang="ts">
	import Button from '../common/Button.svelte';
	import Close from 'svelte-icons/io/IoIosClose.svelte';
	import Input from '../common/Input.svelte';
	import Icon from '../common/Icon.svelte';
	import Hoverable from '../common/Hoverable.svelte';
	import type { Project } from 'src/utils/types';
	import { capitalise } from 'src/utils/general';

	/**
	 * Whether these settings are for the creation of a new project.
	 */
	export let creating = false;
	/**
	 * The ID of the project being updated.
	 */
	export let id: string = undefined;
	export let index;
	export let project: Project;
	let editing = creating;

	let name: string;
	let icon: string;
	let description: string;
	let files: { [language: string]: FileList } = {};
	let errors: string[] = [];
	let loading = false;

	function submit() {
		console.log(files);
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
			<Input variant="dark" bind:value={name} />
		{:else}
			<p>{name}</p>
		{/if}
	</div>
	<div class="space-y-1">
		<p>Icon</p>
		{#if editing}
			<Input variant="dark" bind:value={icon} />
		{:else}
			<p>{name}</p>
		{/if}
	</div>
	<div class="space-y-1">
		<p>Description</p>
		{#if editing}
			<textarea
				class="bg-brand-background rounded p-2 w-full h-28"
				name="description"
				bind:value={description}
			/>
		{:else}
			<p>{description}</p>
		{/if}
	</div>
	<p class="text-xl font-bold">Files</p>
	<div class="space-y-3">
		<span
			>Upload a folder to use as the template for this project. As a minimum, the <code
				>package.json</code
			>, <code>public/index.html</code>
			and an entry-point file such as <code>src/index.js</code> are required. The
			<code>main</code> property in <code>package.json</code> should be used to specify the entry-point.
		</span>
		{#each project.languages as language}
			<div class="bg-brand-background p-5 rounded space-y-3">
				<p>{capitalise(language)}</p>
				{#if files[language]}
					<div class="pl-5 font-mono">
						{#each files[language] as file}
							<Hoverable let:hovering classes="max-w-max">
								<div class="flex flex-row items-center">
									<p class="mr-10">{file.name}</p>
									<div
										class="{hovering
											? 'opacity-100 visible'
											: 'opacity-0 invisible'} transition-all hover:cursor-pointer bg-brand-background rounded"
									>
										<Icon size="medium">
											<Close />
										</Icon>
									</div>
								</div>
							</Hoverable>
						{/each}
					</div>
				{/if}
				<label
					class="flex flex-col max-w-max min-w-max px-3 py-1 items-center rounded shadow tracking-wide cursor-pointer border-2 border-brand-primary hover:text-brand-text hover:bg-brand-primary text-brand-primary ease-linear transition-all"
				>
					<span class="leading-normal">Select files</span>
					<input type="file" class="hidden" bind:files={files['react']} webkitdirectory directory />
				</label>
			</div>
		{/each}
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

<style lang="postcss">
	code {
		@apply bg-brand-background px-2 py-1 text-yellow-400 rounded;
	}
</style>
