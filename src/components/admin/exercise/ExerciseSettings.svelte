<script lang="ts">
	import Button from '../../common/Button.svelte';
	import type { Exercise, ExerciseMetadata, Project } from 'src/utils/types';
	import { doc, increment, runTransaction } from 'firebase/firestore';
	import { db } from 'src/utils/firebase';
	import Chapters from './Chapters.svelte';
	import Settings from './Settings.svelte';
	import Files from './Files.svelte';

	/**
	 * Whether these settings are for the creation of a new project.
	 */
	export let creating = false;
	export let projectID: string;
	export let project: Project;
	/**
	 * The ID of the exercise to update.
	 */
	export let exerciseID: string = undefined;
	export let exercise: Exercise = {
		name: '',
		description: '',
		chapters: [],
		files: {},
		assessed: true
	};
	/**
	 * Whether the editing UI should be shown.
	 */
	let editing = creating;

	let errors: string[] = [];
	let loading = false;

	function validate() {
		const output = [];

		if (exercise.name.length == 0) {
			output.push('The exercise name is missing.');
		}
		if (exercise.description.length == 0) {
			output.push('The exercise descripton is missing.');
		}
		for (const language of project.languages) {
			if (!exercise.files[language]) {
				output.push('Files are missing for language "' + language + '"');
			}
		}
		if (exercise.chapters.length == 0) {
			output.push('At least one chapter is required.');
		} else {
			for (let i = 0; i < exercise.chapters.length; i++) {
				const chapter = exercise.chapters[i];
				const name = 'Chapter #' + (i + 1);
				if (chapter.text.length == 0) {
					output.push(name + ' is missing text.');
				}
				if (exercise.assessed) {
					if (chapter.file.length == 0) {
						output.push(name + ' is missing the test file name.');
					}
					if (chapter.spec.length == 0) {
						output.push(name + ' is missing the test spec name.');
					}
				}
			}
		}
		return output;
	}

	function toggleAssessed() {
		exercise.assessed = !exercise.assessed;
		exercise = exercise;
	}

	async function submit() {
		errors = validate();
		if (errors.length == 0) {
			try {
				const metadata: ExerciseMetadata = {
					name: exercise.name,
					description: exercise.description,
					assessed: exercise.assessed,
					chapters: exercise.chapters
				};

				// Use a batch write to create the exercise.
				await runTransaction(db, async (transaction) => {
					// Create or update the exercise metadata.
					if (creating) {
						// Fetch the project to determine the new documentID to use
						const project: Project = (
							await transaction.get(doc(db, 'projects', projectID))
						).data() as Project;
						exerciseID = project.exerciseCount.toString();
						transaction.set(doc(db, 'projects', projectID, 'exercises', exerciseID), metadata);
						transaction.update(doc(db, 'projects', projectID), {
							exerciseCount: increment(1)
						});
					} else {
						transaction.update(doc(db, 'projects', projectID, 'exercises', exerciseID), metadata);
					}

					// Create the files for each language.
					for (let language of Object.keys(exercise.files)) {
						transaction.set(
							doc(db, 'projects', projectID, 'exercises', exerciseID, 'files', language),
							exercise.files[language]
						);
					}
				});

				if (creating) {
					window.location.href = `/edit/${projectID}/exercise-${exerciseID}`;
				} else {
					toggleEdit();
				}
			} catch (err) {
				if (import.meta.env.DEV) console.error(err);

				errors = [
					'The project could not be created due to an error. Please ensure you have the correct permissions and try again later.'
				];
			}
		}
	}

	function toggleEdit() {
		editing = !editing;
	}
</script>

<form class="flex flex-col bg-brand-accent p-8 rounded space-y-5">
	<Settings
		{exercise}
		{editing}
		on:edit={() => (editing = !editing)}
		on:toggleAssessed={toggleAssessed}
	/>
	<Files {project} {exercise} {editing} />
	<Chapters {exercise} {editing} />
</form>

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
