<script lang="ts">
	import SplitPane from 'src/components/splitpane/SplitPane.svelte';
	import PreviewContainer from '../../components/preview/PreviewContainer.svelte';
	import {
		chapter,
		exercise,
		passed,
		project,
		result,
		test,
		testing
	} from 'src/utils/exercise/exercise';

	import Sidebar from 'src/components/sidebar/Sidebar.svelte';
	import Navbar from 'src/components/navbar/Navbar.svelte';
	import Button from 'src/components/common/Button.svelte';
	import { page } from '$app/stores';
	import { auth, db } from 'src/utils/firebase';
	import Toast from 'src/components/common/Toast.svelte';
	import { save, format, toastMessage } from 'src/utils/editor/editor';
	import Tabs from 'src/components/tabs/Tabs.svelte';
	import Editor from 'src/components/editor/Editor.svelte';
	import { getProjectSettings } from 'src/utils/project/project';
	import { doc, updateDoc } from 'firebase/firestore';
	import { ERR_NO_AUTH } from 'src/utils/general';
	import { unsavedTabs } from 'src/utils/tabs/tabs';
	import Modal from '../common/Modal.svelte';
	import Tutorial from '../tutorial/Tutorial.svelte';
	import { onDestroy, onMount } from 'svelte';

	/**
	 * The index of the exercise
	 */
	let index = parseInt($page.params.index);

	async function incrementProgress(project: string, progress: number) {
		if (!auth.currentUser) throw new Error(ERR_NO_AUTH);
		await updateDoc(doc(db, 'projects', project, 'settings', auth.currentUser.uid), {
			progress: progress + 1
		});
	}

	/**
	 * Called when the user clicks the 'next' button
	 */
	async function handleNext() {
		const progress = (await getProjectSettings($page.params.projectID)).progress;
		if (progress == parseInt($page.params.index)) {
			await incrementProgress($page.params.projectID, progress);
		}
		window.location.href = `/project/${$page.params.projectID}/exercise-${index + 1}`;
	}

	/**
	 * Called when the user clicks the 'previous' button
	 */
	function handlePrevious() {
		if (index > 0) {
			window.location.href = `/project/${$page.params.projectID}/exercise-${index - 1}`;
		}
	}

	/**
	 * Whether the submission is pending
	 */
	let loading = false;

	/**
	 * Called when the user submits the exercise for evaluation
	 */
	async function handleSubmit() {
		if ($unsavedTabs.length > 0) {
			toastMessage.set({
				message: `Save your changes with CTRL+S before submitting`,
				variant: 'warning'
			});
			return;
		}

		loading = true;
		try {
			const _chapter = $chapter;
			testing.set(true);
			toastMessage.set({
				message: 'Submitted successfully',
				variant: 'info'
			});
			const _result = await test($page.params.projectID, $page.params.index);

			result.update((result) => ({
				...result,
				..._result
			}));
			chapter.update((chapter) => {
				if (chapter < $exercise.chapters.length && chapter in _result && _result[chapter].passed) {
					return chapter + 1;
				}
				return chapter;
			});

			if (passed(_result)) {
				toastMessage.set({
					message: 'Exercise completed!',
					variant: 'success'
				});
			} else if (_chapter < $chapter) {
				toastMessage.set({
					message: `Task ${_chapter + 1} passed`,
					variant: 'success'
				});
			} else {
				toastMessage.set({
					message: `Task failed`,
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
		testing.set(false);
		loading = false;
	}

	let tutorial = false;
	function closeTutorial() {
		tutorial = false;
	}

	function openTutorial() {
		tutorial = true;
	}

	function keydownListener(e: KeyboardEvent) {
		if (e.ctrlKey || e.metaKey) {
			if (e.code == 'KeyS') {
				e.preventDefault();
				save.update((save) => save + 1);
			} else if (e.altKey && e.code == 'KeyL') {
				e.preventDefault();
				format.update((format) => format + 1);
			}
		}
	}

	onMount(() => {
		if (!window.localStorage['tutorial']) {
			openTutorial();
			window.localStorage['tutorial'] = true;
		}
		window.addEventListener('keydown', keydownListener);
	});

	onDestroy(() => {
		window.removeEventListener('keydown', keydownListener);
	});
</script>

<div class="h-screen max-h-screen text-brand-text bg-brand-accent flex flex-col relative">
	{#if tutorial}
		<Modal title="Tutorial" on:close={closeTutorial}>
			<Tutorial on:finish={closeTutorial} />
		</Modal>
	{/if}
	<Navbar expanded={true} />
	<SplitPane pane1Size={25} pane2Size={75}>
		<div slot="pane1" class="h-full">
			<Sidebar on:tutorial={openTutorial} />
		</div>
		<div slot="pane2" class="h-full flex flex-col">
			<SplitPane minPane2Size={'10rem'} pane1Size={66} pane2Size={34}>
				<div slot="pane1" class="flex flex-col h-full">
					<Tabs />
					<Editor />
				</div>
				<div slot="pane2" class="h-full" let:resizing>
					<PreviewContainer {resizing} />
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
			{#if $exercise.assessed && !passed($result)}
				<Button text="Submit" on:click={handleSubmit} {loading} />
			{:else if index + 1 == $project.exerciseCount}
				<a href={`/project/${$page.params.projectID}/finish`}
					><Button text="Finish" link={true} /></a
				>
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
