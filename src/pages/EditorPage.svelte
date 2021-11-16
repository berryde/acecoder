<script lang="ts">
	import Preview from '../components/preview/Preview.svelte';
	import Editor from '../components/editor/Editor.svelte';
	import type { Filesystem, WorkerError, WorkerResponse } from '../utils/types';
	import Tabs from '../components/tabs/Tabs.svelte';
	import { addMessage, latestError, messages } from '../utils/console/console';
	import { tabs, selectedTab, unsavedTabs, saveTab } from '../utils/tabs/tabs';
	import {
		createFile,
		filesystem,
		getAllFiles,
		getExtension,
		getFile,
		updateFile
	} from '../utils/filesystem/filesystem';
	import { onMount } from 'svelte';
	import { reactTemplate } from '../utils/templates/templates';
	import SplitPane from '../components/splitpane/SplitPane.svelte';
	import Console from '../components/console/Console.svelte';
	import Sidebar from '../components/sidebar/Sidebar.svelte';
	import { darkMode } from '../utils/settings/settings';

	let compiled: WorkerResponse = {
		css: '',
		js: '',
		public: {}
	};

	let worker: Worker;

	let editorContent: { [key: string]: string } = {};

	onMount(() => {
		worker = new Worker('./worker.js');

		// Add a listener for compiler responses.
		worker.addEventListener('message', (event) => {
			const e = event.data.error as WorkerError;
			if (e) {
				addMessage({
					data: e.message,
					type: 'error'
				});
				latestError.set(e);
			} else {
				latestError.set(undefined);
				compiled = event.data as WorkerResponse;
			}
		});

		// Load the react template.
		loadTemplate(reactTemplate);

		/**
		 * Reload the preview whenever the filesystem is changed.
		 */
		filesystem.subscribe((fs) => {
			refresh(fs);
		});
	});

	// When the editor source is changed, send it to the web worker.
	// Send the results to the preview.
	function handleCodeChanged(code: string) {
		editorContent[$selectedTab] = code;
		unsavedTabs.update((unsavedTabs) =>
			unsavedTabs.includes($selectedTab) ? unsavedTabs : [...unsavedTabs, $selectedTab]
		);
	}

	function loadTemplate(template: { [key: string]: string }) {
		for (const [path, value] of Object.entries(template)) {
			createFile(path, value);
		}
	}

	function refresh(fs: Filesystem) {
		worker.postMessage(getAllFiles('', fs));
	}

	function handleSave() {
		if ($selectedTab != '') {
			saveTab($selectedTab);
			updateFile($selectedTab, editorContent[$selectedTab]);
		}
	}

	function loadEditorContent(tab: string) {
		const result = getFile($filesystem, tab);
		if (result.type == 'file') {
			return result.value;
		}
		return '';
	}

	let selecting = false;
	function toggleSelecting(e: CustomEvent<boolean>) {
		selecting = e.detail;
	}
</script>

<div class="h-screen {$darkMode && 'dark'} dark:bg-bluegray-600 flex flex-row">
	<SplitPane isHorizontal={true} minPane1Size="58px" pane1Size={20} pane2Size={80}>
		<left slot="pane1">
			<Sidebar />
		</left>
		<right slot="pane2">
			<SplitPane isHorizontal={true}>
				<left slot="pane1">
					<div class="flex flex-col h-full dark:bg-bluegray-600 bg-gray-100">
						<Tabs selected={$selectedTab} tabs={$tabs} unsaved={$unsavedTabs} />
						{#each $tabs as tab}
							<Editor
								selected={tab === $selectedTab}
								language={getExtension(tab)}
								filename={tab}
								on:save={() => handleSave()}
								on:docchanged={(e) => handleCodeChanged(e.detail)}
								on:drag={(e) => toggleSelecting(e)}
								initialValue={loadEditorContent(tab)}
							/>
						{/each}
					</div>
				</left>
				<right slot="pane2" let:resizing={resizingX}>
					<SplitPane minPane2Size="2.5rem" isHorizontal={false} pane1Size={100} pane2Size={0}>
						<top slot="pane1" let:resizing={resizingY}>
							<Preview
								{compiled}
								resizing={resizingX || resizingY || selecting}
								error={$latestError}
								on:refresh={() => refresh($filesystem)}
							/>
						</top>
						<bottom slot="pane2">
							<Console messages={$messages} />
						</bottom>
					</SplitPane>
				</right>
			</SplitPane>
		</right>
	</SplitPane>
</div>
