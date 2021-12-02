<script lang="ts">
	import Editor from '../../components/editor/Editor.svelte';
	import Tabs from '../../components/tabs/Tabs.svelte';
	import {
		tabs,
		selectedTab,
		unsavedTabs,
		saveTab,
		openTab,
		temporaryTab
	} from '../../utils/tabs/tabs';
	import { filesystem, getExtension, getFile, updateFile } from '../../utils/filesystem/filesystem';
	import { compiled } from 'src/utils/compiler/compiler';
	import { isStandalone, save } from 'src/utils/exercise/exercise';
	import { doc, setDoc } from 'firebase/firestore';
	import { db } from 'src/utils/firebase';
	import { auth } from 'src/utils/auth/auth';

	/**
	 * A map of filename to unsaved changes for that file.
	 */
	let editorContent: { [key: string]: string } = {};

	/**
	 * Update the unsaved changes in memory.
	 * @param code The new unsaved changes.
	 */
	function handleCodeChanged(code: string) {
		editorContent[$selectedTab] = code;
		openTab($selectedTab);
		unsavedTabs.update((tabs) => (tabs.includes($selectedTab) ? tabs : [...tabs, $selectedTab]));
	}

	/**
	 * Save the current file when the user presses Ctrl+S
	 */
	function handleSave() {
		if ($selectedTab != '') {
			saveTab($selectedTab);
			updateFile($selectedTab, editorContent[$selectedTab]);
		}

		compiled.subscribe((compiled) => {
			// Update the compiled value in firebase
			if ($isStandalone && compiled && compiled != { css: '', js: '', public: {} }) {
				console.log("It's standalone");
				setDoc(doc(db, 'preview', $auth.uid), compiled);
			}
		});

		save();
	}

	/**
	 * Load the contents of the file for this tab.
	 * @param tab The tab associated with this file and editor.
	 */
	function loadEditorContent(tab: string) {
		console.log('Loading tab', tab);
		const result = getFile($filesystem, tab);
		if (result.type == 'file') {
			return result.value;
		}
		return '';
	}
</script>

<Tabs selected={$selectedTab} tabs={$tabs} unsaved={$unsavedTabs} temporary={$temporaryTab} />
{#each $tabs as tab}
	<Editor
		selected={tab === $selectedTab}
		language={getExtension(tab)}
		filename={tab}
		on:save={() => handleSave()}
		on:docchanged={(e) => handleCodeChanged(e.detail)}
		on:drag
		initialValue={loadEditorContent(tab)}
	/>
{/each}
