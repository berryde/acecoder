<script lang="ts">
	import SplitPane from 'src/components/splitpane/SplitPane.svelte';
	import EditorContainer from './EditorContainer.svelte';
	import PreviewContainer from './PreviewContainer.svelte';
	import { chapter, exercise, project, test } from 'src/utils/exercise/exercise';

	import Sidebar from 'src/components/sidebar/Sidebar.svelte';
	import Navbar from 'src/components/navbar/Navbar.svelte';
	import Button from 'src/components/common/Button.svelte';
	import { page } from '$app/stores';
	import { incrementProgress } from 'src/utils/firebase';
	import Toast from 'src/components/common/Toast.svelte';
	import { save, toastMessage } from 'src/utils/editor/editor';

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
	let index = parseInt($page.params.index);

	async function handleNext() {
		await incrementProgress($page.params.projectID, $page.params.index);
		window.location.href = `/project/${$page.params.projectID}/exercise-${index + 1}`;
	}

	async function handleFinish() {
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
		try {
			await save($page.params.projectID);
			const previousChapter = $chapter;
			await test($page.params.projectID, $page.params.index);
			if ($chapter >= $exercise.chapters.length) {
				toastMessage.set({
					message: 'Exercise completed!',
					variant: 'success'
				});
			} else if ($chapter > previousChapter) {
				toastMessage.set({
					message: `Task ${previousChapter} passed`,
					variant: 'success'
				});
			} else {
				toastMessage.set({
					message: `Task ${previousChapter} failed`,
					variant: 'danger'
				});
			}
		} catch (e) {
			//set toast message
			toastMessage.set({
				message: 'Unable to submit exercise',
				variant: 'danger'
			});
		}

		loading = false;
	}
</script>

<div class="h-screen max-h-screen text-brand-text bg-brand-accent flex flex-col">
	<Navbar expanded={true} />
	<SplitPane pane1Size={25} pane2Size={75}>
		<div slot="pane1" class="h-full">
			<Sidebar />
		</div>
		<div slot="pane2" class="h-full flex flex-col">
			<SplitPane minPane2Size={'10rem'} pane1Size={66} pane2Size={34}>
				<div slot="pane1" class="h-full">
					<EditorContainer on:drag={toggleSelecting} />
				</div>
				<div slot="pane2" class="h-full" let:resizing>
					<PreviewContainer {resizing} {selecting} />
				</div>
			</SplitPane>
		</div>
	</SplitPane>
	<div
		class="px-5 py-3 flex flex-row w-full justify-between bg-brand-background items-center relative"
	>
		<div class="flex-grow w-full">
			{#if $page.params.index !== '0'}
				<Button text="Previous" on:click={handlePrevious} outline={true} link={true} />
			{/if}
		</div>

		<p>{index}/{$project.exerciseCount - 1}</p>
		<div class="flex space-x-5 flex-grow justify-end w-full">
			{#if $exercise.assessed && $chapter < $exercise.chapters.length}
				<Button text="Submit" on:click={handleSubmit} {loading} />
			{:else if index + 1 == $project.exerciseCount}
				<Button text="Finish" on:click={handleFinish} link={true} />
			{:else}
				{#if $exercise.assessed}
					<Button text="Re-submit" on:click={handleSubmit} outline={true} {loading} />
				{/if}
				<Button text="Next" on:click={handleNext} link={true} />
			{/if}
		</div>
		<Toast />
	</div>
</div>
