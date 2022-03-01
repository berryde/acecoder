<script lang="ts">
	import Checkbox from 'src/components/common/Checkbox.svelte';
	import Hoverable from 'src/components/common/Hoverable.svelte';
	import Icon from 'src/components/common/Icon.svelte';
	import Close from 'svelte-icons/io/IoIosClose.svelte';
	import { extractZip } from 'src/utils/filesystem/filesystem';
	import { capitalise } from 'src/utils/general';
	import type { Exercise, FSFile, Project } from '~shared/types';
	import Modal from 'src/components/common/Modal.svelte';
	import Button from 'src/components/common/Button.svelte';

	export let exercise: Exercise;
	export let project: Project;
	let uploads: { [language: string]: FileList } = {};
	export let editing: boolean;

	async function handleUpload(language: string) {
		let extracted = await extractZip(uploads[language][0]);
		const result: Record<string, FSFile> = Object.keys(extracted).reduce(
			(result: Record<string, FSFile>, key) => {
				result[key] = { value: extracted[key], modifiable: false, type: 'file' };
				return result;
			},
			{}
		);
		exercise.files[language] = result;
		exercise = exercise;
	}

	function deleteFile(language: string, filename: string) {
		delete exercise.files[language][filename];
		exercise = exercise;
	}

	function toggleEditable(language: string, filename: string) {
		exercise.files[language][filename].modifiable = !exercise.files[language][filename].modifiable;
		exercise = exercise;
	}

	let showingModal = false;
	let modalLanguage: string;
	let modalFilename: string;
	let modalText: string;

	function openModal(language: string, filename: string) {
		if (editing) {
			modalText = exercise.files[language][filename].value;
			modalLanguage = language;
			modalFilename = filename;
			showingModal = true;
		}
	}

	function saveModal() {
		exercise.files[modalLanguage][modalFilename].value = modalText;
	}

	function closeModal(save: boolean) {
		if (save) {
			saveModal();
		}
		modalText = '';
		modalLanguage = '';
		modalFilename = '';
		showingModal = false;
	}
</script>

<div class="space-y-2">
	<p class="text-xl font-bold">Files</p>

	<div class="space-y-2">
		{#if editing}
			<span
				>Upload an archive to use as the template for this project. As a minimum, the <code
					>package.json</code
				>
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
						{#if showingModal}
							<Modal title="File editor" on:close={() => closeModal(false)}>
								<textarea
									class="bg-brand-background rounded p-2 file-editor"
									bind:value={modalText}
								/>
								<div class="flex space-x-5 justify-end">
									<Button
										text="Cancel"
										variant="danger"
										outline={true}
										on:click={() => closeModal(false)}
									/>
									<Button text="Apply" on:click={() => closeModal(true)} />
								</div>
							</Modal>
						{/if}
						<div class="font-mono">
							{#each Object.entries(exercise.files[language]) as [name, file]}
								<Hoverable let:hovering>
									<div class="flex flex-row items-center">
										<div class="w-20 mr-3 flex justify-center">
											<Checkbox
												value={file.modifiable}
												disabled={!editing}
												on:click={() => toggleEditable(language, name)}
											/>
										</div>
										<p class="mr-5 cursor-pointer" on:click={() => openModal(language, name)}>
											{name}
										</p>
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
						<label for="file-upload-{language}" class="cursor-pointer text-brand-primary"
							>Upload files</label
						>
						<p class="font-mono">
							{uploads[language] && exercise.files[language] && uploads[language].length > 0
								? uploads[language][0].name
								: ''}
						</p>
						<input
							type="file"
							id="file-upload-{language}"
							class="hidden"
							bind:files={uploads[language]}
							accept=".zip"
							on:change={() => handleUpload(language)}
						/>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
	code {
		@apply bg-brand-background px-2 py-1 text-yellow-400 rounded;
	}
	.file-editor {
		width: 60vw;
		height: 50vh;
	}
</style>
