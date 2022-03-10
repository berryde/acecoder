<script lang="ts">
	import SplitPane from 'src/components/splitpane/SplitPane.svelte';
	import PreviewContainer from '../../components/preview/PreviewContainer.svelte';
	import { reset, submit, testing } from 'src/utils/exercise/exercise';
	import Sidebar from 'src/components/sidebar/Sidebar.svelte';
	import Navbar from 'src/components/navbar/Navbar.svelte';
	import { page } from '$app/stores';
	import { handleFormat, handleSave, toastMessage } from 'src/utils/editor/editor';
	import Tabs from 'src/components/tabs/Tabs.svelte';
	import Editor from 'src/components/editor/Editor.svelte';
	import { selectedTab, unsavedTabs } from 'src/utils/tabs/tabs';
	import Modal from '../common/Modal.svelte';
	import Tutorial from '../tutorial/Tutorial.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { getExtension, getFile } from 'src/utils/filesystem/filesystem';
	import type { FSFile } from '~shared/types';
	import Footer from '../footer/Footer.svelte';

	/**
	 * Whether the submission is pending
	 */
	let loading = false;
	/**
	 * The value of the editor
	 */
	let value: string = '';
	/**
	 * Whether the tutorial is showing
	 */
	let tutorial = false;

	/**
	 * Format the contents of the editor
	 */
	function format() {
		value = handleFormat(value, getExtension($selectedTab));
	}

	/**
	 * Write the contents of the editor to memory
	 */
	async function save(silent = false) {
		await handleSave(value, $page.params.projectID, silent);
	}

	/**
	 * Called when the user submits the exercise for evaluation
	 */
	async function handleSubmit() {
		if ($testing) {
			toastMessage.set({
				message: 'Please wait for your current submission to finish',
				variant: 'warning'
			});
		} else {
			if ($unsavedTabs.length > 0) {
				await save(true);
			}
			loading = true;
			await submit($page.params.projectID, $page.params.index);
			loading = false;
		}
	}

	/**
	 * Listen for keyboard events to process keybinds
	 * @param e The keyboard event
	 */
	function keydownListener(e: KeyboardEvent) {
		if (e.ctrlKey || e.metaKey) {
			if (e.code == 'KeyS') {
				e.preventDefault();
				save();
			} else if (e.altKey && e.code == 'KeyL') {
				e.preventDefault();
				format();
			}
		}
	}

	/**
	 * Update the value of the editor with the value of the given file.
	 *
	 * @param filename The file to get the value for
	 */
	function updateEditor(filename: string) {
		value = (getFile(filename) as FSFile).value;
	}

	/**
	 * Reset the exercise
	 */
	async function handleReset() {
		await reset($page.params.projectID, $page.params.index);
		updateEditor($selectedTab);
	}

	onMount(() => {
		if (!window.localStorage['tutorial']) {
			tutorial = true;
			window.localStorage['tutorial'] = true;
		}
		window.addEventListener('keydown', keydownListener);
	});

	onDestroy(() => {
		window.removeEventListener('keydown', keydownListener);
	});

	$: updateEditor($selectedTab);
</script>

<div
	class="h-screen max-h-screen text-brand-text bg-brand-accent flex flex-col relative overflow-hidden"
>
	{#if tutorial}
		<Modal title="Tutorial" on:close={() => (tutorial = false)}>
			<Tutorial on:finish={() => (tutorial = false)} />
		</Modal>
	{/if}
	<Navbar expanded={true} />
	<SplitPane pane1Size={25} pane2Size={75}>
		<div slot="pane1" class="h-full">
			<Sidebar
				on:tutorial={() => (tutorial = true)}
				on:reset={handleReset}
				on:format={format}
				on:save={() => save()}
			/>
		</div>
		<div slot="pane2" class="h-full flex flex-col">
			<SplitPane minPane2Size={'10rem'} pane1Size={66} pane2Size={34}>
				<div slot="pane1" class="flex flex-col h-full">
					<Tabs />
					<Editor filename={$selectedTab} bind:value on:format={format} />
				</div>
				<div slot="pane2" class="h-full" let:resizing>
					<PreviewContainer {resizing} />
				</div>
			</SplitPane>
		</div>
	</SplitPane>
	<Footer on:submit={handleSubmit} {loading} />
</div>
