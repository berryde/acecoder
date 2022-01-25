<script lang="ts">
	import SplitPane from 'src/components/splitpane/SplitPane.svelte';
	import EditorContainer from './EditorContainer.svelte';
	import PreviewContainer from './PreviewContainer.svelte';
	import { onMount } from 'svelte';
	import { initialising, loadExercise, project } from 'src/utils/exercise/exercise';
	import OrbitProgressIndicator from 'src/components/loaders/OrbitProgressIndicator.svelte';
	import { loadSettings } from 'src/utils/settings/settings';
	import Sidebar from 'src/components/sidebar/Sidebar.svelte';
	import Navbar from 'src/components/navbar/Navbar.svelte';
	import Button from 'src/components/common/Button.svelte';
	import { page } from '$app/stores';

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
		index = parseInt($page.params.index) + 1;
		loadExercise();
		loadSettings();
	});

	function handleNext() {
		if (index == $project.exerciseCount) {
			window.location.href = `/project/${$page.params.projectID}`;
		} else {
			window.location.href = `/project/${$page.params.projectID}/exercise-${$page.params.index}`;
		}
	}

	function handlePrevious() {
		if (index > 1) {
			window.location.href = `/project/${$page.params.projectID}/exercise-${index - 1}`;
		}
	}
</script>

{#if $initialising}
	<div class="h-screen w-screen bg-brand-background flex justify-center items-center">
		<OrbitProgressIndicator />
	</div>
{:else}
	<div class="h-screen max-h-screen text-brand-text bg-brand-accent flex flex-col">
		<Navbar />
		<SplitPane pane1Size={33} pane2Size={67}>
			<div slot="pane1" class="h-full">
				<Sidebar />
			</div>
			<div slot="pane2" class="h-full flex flex-col">
				<SplitPane let:resizing={resizingX} minPane2Size={'10rem'}>
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
			<div>
				{#if $page.params.index !== '0'}
					<Button text="Previous" on:click={handlePrevious} />
				{/if}
			</div>

			<p>{index}/{$project.exerciseCount}</p>
			<Button text={index == $project.exerciseCount ? 'Finish' : 'Next'} on:click={handleNext} />
		</div>
	</div>
{/if}
