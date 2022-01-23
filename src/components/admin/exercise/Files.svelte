<script lang="ts">
	import Checkbox from 'src/components/common/Checkbox.svelte';
	import Hoverable from 'src/components/common/Hoverable.svelte';
	import Icon from 'src/components/common/Icon.svelte';
	import Close from 'svelte-icons/io/IoIosClose.svelte';
	import { extractZip } from 'src/utils/filesystem/filesystem';
	import { capitalise } from 'src/utils/general';

	import type { Exercise, ExerciseFile, Project } from 'src/utils/types';

	export let exercise: Exercise;
	export let project: Project;
	let uploads: { [language: string]: FileList } = {};
	export let editing: boolean;

	async function handleUpload(language: string) {
		let extracted = await extractZip(uploads[language][0]);
		const result: Record<string, ExerciseFile> = Object.keys(extracted).reduce((result, key) => {
			result[key] = { contents: extracted[key], editable: false };
			return result;
		}, {});
		exercise.files[language] = result;
		exercise = exercise;
	}

	function deleteFile(language: string, filename: string) {
		delete exercise.files[language][filename];
		exercise = exercise;
	}

	function toggleEditable(language: string, filename: string) {
		exercise.files[language][filename].editable = !exercise.files[language][filename].editable;
		exercise = exercise;
	}
</script>

<div class="space-y-2">
	<p class="text-xl font-bold">Files</p>

	<div class="space-y-2">
		{#if editing}
			<span
				>Upload an archive to use as the template for this project. As a minimum, the <code
					>package.json</code
				>, <code>public/index.html</code>
				and an entry-point file such as <code>src/index.js</code> are required. The
				<code>main</code> property in <code>package.json</code> should be used to specify the
				entry-point. Ensure that you don't upload the <code>node_modules</code> directory, since this
				is too large to be handled by the server.
			</span>
		{/if}

		{#each project.languages as language}
			<div class="bg-brand-background p-5 rounded space-y-3">
				<p class="font-bold">{capitalise(language)}</p>
				{#if exercise.files[language]}
					<div>
						<div class="flex flex-row mb-2">
							<div class="w-20 mr-3 text-center">
								<p>Editable</p>
							</div>
							<p>Filename</p>
						</div>

						<div class="font-mono">
							{#each Object.entries(exercise.files[language]) as [name, file]}
								<Hoverable let:hovering>
									<div class="flex flex-row items-center">
										<div class="w-20 mr-3 flex justify-center">
											<Checkbox
												value={file.editable}
												disabled={!editing}
												on:click={() => toggleEditable(language, name)}
											/>
										</div>
										<p class="mr-5">{name}</p>
										<div
											class="{hovering && editing
												? 'visible opacity-100 cursor-pointer'
												: 'invisible opacity-0'} transition-all bg-brand-accent rounded"
											on:click={() => deleteFile(language, name)}
										>
											<Icon>
												<Close />
											</Icon>
										</div>
									</div>
								</Hoverable>
							{/each}
						</div>
					</div>
				{/if}
				{#if editing}
					<div class="flex flex-row space-x-3">
						<label for="file-upload" class="cursor-pointer text-brand-primary">Upload files</label>
						<p class="font-mono">
							{uploads[language] && exercise.files[language] && uploads[language].length > 0
								? uploads[language][0].name
								: ''}
						</p>
					</div>
				{/if}
				<input
					type="file"
					id="file-upload"
					class="hidden"
					bind:files={uploads['react']}
					accept=".zip"
					on:change={() => handleUpload(language)}
				/>
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
	code {
		@apply bg-brand-background px-2 py-1 text-yellow-400 rounded;
	}
</style>
