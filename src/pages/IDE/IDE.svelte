<script lang="ts">
	import SplitPane from 'src/components/splitpane/SplitPane.svelte';
	import EditorContainer from './EditorContainer.svelte';
	import PreviewContainer from './PreviewContainer.svelte';
	import { onMount } from 'svelte';
	import {
		chapter,
		exercise,
		initialising,
		loadExercise,
		project,
		submit
	} from 'src/utils/exercise/exercise';
	import OrbitProgressIndicator from 'src/components/loaders/OrbitProgressIndicator.svelte';
	import { loadSettings } from 'src/utils/settings/settings';
	import Sidebar from 'src/components/sidebar/Sidebar.svelte';
	import Navbar from 'src/components/navbar/Navbar.svelte';
	import Button from 'src/components/common/Button.svelte';
	import { page } from '$app/stores';
	import { incrementProgress } from 'src/utils/firebase';

	/**
	 * Whether the user is currently drawing a selection over the editor.
	 * This allows us to ignore pointer events in the preview iframe.
	 */
	let selecting = false;

	/**
	 * Update the value of whether the user is currently drawing a selection over the editor.
	 * @param e The triggering event.
	 */
	function toggleSelecting(e: CustomEvent<boolean>) {
		selecting = e.detail;
	}
	let index: number;

	// Add a listener for key combinations
	onMount(async () => {
		index = parseInt($page.params.index);
		loadExercise();
		loadSettings();
	});

	async function handleNext() {
		await incrementProgress($page.params.projectID, $page.params.index);
		window.location.href = `/project/${$page.params.projectID}/exercise-${index + 1}`;
	}

	async function handleFinish() {
		// If the user has modified the exercise, write those changes.
		// Increment the progress
		loading = true;
		await submit($page.params.projectID, $page.params.index, false);
		loading = false;
		window.location.href = `/project/${$page.params.projectID}/finish`;
	}

	function handlePrevious() {
		if (index > 0) {
			window.location.href = `/project/${$page.params.projectID}/exercise-${index - 1}`;
		}
	}

	let loading = false;
	async function handleSubmit() {
		loading = true;
		await submit($page.params.projectID, $page.params.index);
		loading = false;
	}
</script>

{#if $initialising}
	<div class="h-screen w-screen bg-brand-background flex justify-center items-center">
		<OrbitProgressIndicator />
	</div>
{:else}
	<div class="h-screen max-h-screen text-brand-text bg-brand-accent flex flex-col">
		<Navbar expanded={true} />
		<SplitPane pane1Size={25} pane2Size={75}>
			<div slot="pane1" class="h-full">
				<Sidebar />
			</div>
			<div slot="pane2" class="h-full flex flex-col">
				<SplitPane let:resizing={resizingX} minPane2Size={'10rem'} pane1Size={66} pane2Size={34}>
					<div slot="pane1" class="h-full">
						<EditorContainer on:drag={toggleSelecting} />
					</div>
					<div slot="pane2" class="h-full">
						<PreviewContainer {resizingX} {selecting} />
					</div>
				</SplitPane>
			</div>
		</SplitPane>
		<div class="px-5 py-3 flex flex-row w-full justify-between bg-brand-background items-center">
			<div class="flex-grow w-full">
				{#if $page.params.index !== '0'}
					<Button text="Previous" on:click={handlePrevious} outline={true} />
				{/if}
			</div>

			<p>{index}/{$project.exerciseCount - 1}</p>
			<div class="flex space-x-5 flex-grow justify-end w-full">
				{#if $exercise.assessed && $chapter < $exercise.chapters.length}
					<Button text="Submit" on:click={handleSubmit} {loading} />
				{:else if index + 1 == $project.exerciseCount}
					<Button text="Finish" on:click={handleFinish} />
				{:else}
					{#if $exercise.assessed}
						<Button text="Re-submit" on:click={handleSubmit} outline={true} {loading} />
					{/if}
					<Button text="Next" on:click={handleNext} />
				{/if}
			</div>
		</div>
	</div>
{/if}
