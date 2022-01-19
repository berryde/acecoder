<script lang="ts">
	import SplitPane from 'src/components/splitpane/SplitPane.svelte';
	import EditorContainer from './EditorContainer.svelte';
	import PreviewContainer from './PreviewContainer.svelte';
	import { onMount } from 'svelte';
	import {
		initialising,
		loadExercise,
		result,
		submitted,
		pending
	} from 'src/utils/exercise/exercise';
	import OrbitProgressIndicator from 'src/components/loaders/OrbitProgressIndicator.svelte';
	import { loadSettings } from 'src/utils/settings/settings';
	import Results from 'src/components/exercise/Results.svelte';
	import Modal from 'src/components/common/Modal.svelte';
	import Sidebar from 'src/components/sidebar/Sidebar.svelte';
	import Navbar from 'src/components/navbar/Navbar.svelte';
	import Button from 'src/components/common/Button.svelte';

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

	// Add a listener for key combinations
	onMount(async () => {
		loadExercise();
		loadSettings();
	});

	let showingResults = false;

	function showResults() {
		showingResults = true;
	}

	function hideResults() {
		showingResults = false;
	}

	$: $submitted && !$pending && $result && showResults();
</script>

{#if $initialising}
	<div class="h-screen w-screen bg-brand-background flex justify-center items-center">
		<OrbitProgressIndicator />
	</div>
{:else}
	{#if showingResults}
		<Modal title="Submission Results" on:close={hideResults}>
			<Results />
		</Modal>
	{/if}
	<div class="h-screen max-h-screen text-brand-text bg-brand-accent flex flex-col">
		<Navbar />
		<SplitPane pane1Size={33} pane2Size={67}>
			<div slot="pane1" class="h-full">
				<Sidebar />
			</div>
			<div slot="pane2" class="h-full flex flex-col">
				<SplitPane let:resizing={resizingX}>
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
			<div />
			<p>1/5</p>
			<Button text="Next" />
		</div>
	</div>
{/if}
