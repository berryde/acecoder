<script lang="ts">
	import type { Editor, IEditSession } from 'brace';
	import { getExtension, getFile } from 'src/utils/filesystem/filesystem';
	import { selectedTab, unsavedTabs } from 'src/utils/tabs/tabs';
	import type { FSFile } from 'src/utils/types';
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/env';
	import { contents } from 'src/utils/editor/editor';
	import { save } from 'src/utils/editor/editor';
	import { page } from '$app/stores';

	const TAB_SIZE = 2;
	const FONT_SIZE = '1rem';

	let element: HTMLElement;
	let editor: Editor;
	let sessions: Record<string, IEditSession> = {};
	let loaded = false;

	async function configureEditor() {
		await import('brace/mode/javascript');
		await import('brace/ext/language_tools');
		await import('./AceTheme');

		editor = ace.edit(element);
		editor.$blockScrolling = Infinity;
		editor.setTheme('ace/theme/folio');

		// Disable the find command
		editor.commands.removeCommand('find');

		editor.setShowPrintMargin(false);
		editor.setOptions({ enableBasicAutocompletion: true, fontSize: FONT_SIZE });
		editor.on('change', () => {
			contents.set(editor.getValue());
			if (!$unsavedTabs.includes($selectedTab)) {
				unsavedTabs.update((tabs) => [...tabs, $selectedTab]);
			} else if (editor.getValue() === (getFile($selectedTab) as FSFile).value) {
				unsavedTabs.update((tabs) => {
					tabs.splice(tabs.indexOf($selectedTab));
					return tabs;
				});
			}
		});
		loaded = true;
	}

	/**
	 * Set the contents of the current editor, restoring the cursor position.
	 * @param value The text to set
	 */
	function setValue(value: string) {
		if (editor) {
			const pos = editor.getCursorPosition();
			editor.setValue(value);
			editor.moveCursorToPosition(pos);
			editor.clearSelection();
		}
	}

	/**
	 * Save the contents of the editor when the user presses ctrl+s
	 */
	function handleSave() {
		if ($contents == '') return;
		save($page.params.projectID);
	}

	/**
	 *
	 * @param e
	 */
	function keydownListener(e: KeyboardEvent) {
		if (e.ctrlKey && e.code == 'KeyS') {
			e.preventDefault();
			handleSave();
		}
	}

	let ace: { edit: any; EditSession: any; UndoManager: any; default?: any };
	onMount(async () => {
		// Brace is imported dynamically since it requires the `window` object to exist.
		ace = await import('brace');
		await import('brace/ext/searchbox');
		configureEditor();
		window.addEventListener('keydown', keydownListener);
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
		window.removeEventListener('keydown', keydownListener);
	});

	/**
	 * Dynamically imports the required brace mode. Note that dynamic import strings cannot include variables in order to be resolved by vite.
	 * @param filename The filename to import the brace mode for.
	 */
	async function importMode(filename: string) {
		switch (getExtension(filename)) {
			case 'tsx':
				await import('brace/mode/tsx');
				return 'ace/mode/tsx';
			case 'jsx':
				await import('brace/mode/jsx');
				return 'ace/mode/jsx';
			case 'js':
				await import('brace/mode/javascript');
				return 'ace/mode/javascript';
			case 'ts':
				await import('brace/mode/typescript');
				return 'ace/mode/typescript';
			case 'svelte':
			case 'html':
				await import('brace/mode/html');
				return 'ace/mode/html';
			case 'css':
				await import('brace/mode/css');
				return 'ace/mode/css';
			default:
				await import('brace/mode/plain_text');
				return 'ace/mode/plain_text';
		}
	}

	async function updateSession() {
		if (browser) {
			if (!($selectedTab in sessions)) {
				const session = new ace.EditSession((getFile($selectedTab) as FSFile).value);
				session.setMode(await importMode($selectedTab));
				session.setUndoManager(new ace.UndoManager());
				if (getExtension($selectedTab) === 'svelte') {
					session.setUseWorker(false);
				}
				session.setUseWrapMode(true);
				session.setTabSize(TAB_SIZE);
				sessions[$selectedTab] = session;
			}
			editor.setSession(sessions[$selectedTab]);
		}
	}

	/**
	 * Resize the editor whenever the container is resized
	 */
	function handleResize() {
		editor.resize();
	}

	/**
	 * Update the value of the editor if the contents state changes due to side effects.
	 */
	function updateContents() {
		if (editor) {
			setValue($contents);
		}
	}

	$: loaded && $selectedTab && updateSession();
	$: clientWidth && editor && handleResize();
	$: $contents && updateContents();
	let clientWidth: number;
</script>

<div class="h-full w-full pt-3 bg-brand-editor-background" bind:clientWidth>
	<div bind:this={element} class="h-full w-full" />
</div>
