<script lang="ts">
	import type { Editor, IEditSession } from 'brace';
	import { getExtension, getFile } from 'src/utils/filesystem/filesystem';
	import { unsavedTabs } from 'src/utils/tabs/tabs';
	import type { FSFile } from '~shared/types';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { browser } from '$app/env';

	const TAB_SIZE = 2;
	const FONT_SIZE = '1rem';

	export let value: string;
	export let filename: string;

	let sessions: Record<string, IEditSession> = {};
	let element: HTMLElement;
	let editor: Editor;

	function updateUnsaved() {
		if (!$unsavedTabs.includes(filename)) {
			unsavedTabs.update((tabs) => [...tabs, filename]);
		} else if (editor.getValue() === (getFile(filename) as FSFile).value) {
			unsavedTabs.update((tabs) => {
				tabs.splice(tabs.indexOf(filename));
				return tabs;
			});
		}
	}

	async function configureEditor() {
		await import('brace/mode/javascript');
		await import('brace/ext/language_tools');
		await import('./AceTheme');

		editor = ace.edit(element);
		editor.$blockScrolling = Infinity;

		editor.commands.removeCommand('find');
		editor.commands.addCommand({
			name: 'format',
			bindKey: { win: 'Ctrl-Alt-l', mac: 'Command-Alt-l' },
			exec: () => {
				dispatch('format');
			}
		});

		editor.setTheme('ace/theme/folio');
		editor.setShowPrintMargin(false);
		editor.setOptions({ enableBasicAutocompletion: true, fontSize: FONT_SIZE });
		setValue(value);

		editor.on('change', () => {
			updateUnsaved();
			handleInput();
		});
	}

	async function updateSession(filename: string) {
		if (browser && editor) {
			if (!(filename in sessions)) {
				const session = new ace.EditSession(value);
				session.setMode(await importMode(filename));
				session.setUndoManager(new ace.UndoManager());
				if (getExtension(filename) === 'svelte') {
					session.setUseWorker(false);
				}
				session.setUseWrapMode(true);
				session.setTabSize(TAB_SIZE);
				sessions[filename] = session;
			}
			editor.setSession(sessions[filename]);
		}
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

	let ace: { edit: any; EditSession: any; UndoManager: any; default?: any };
	onMount(async () => {
		// Brace is imported dynamically since it requires the `window` object to exist.
		ace = await import('brace');
		await import('brace/ext/searchbox');
		await configureEditor();
		updateSession(filename);
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
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

	/**
	 * Resize the editor whenever the container is resized
	 */
	function handleResize() {
		editor.resize();
	}

	// function handleReset() {
	// 	setValue((getFile(filename) as FSFile).value);
	// }

	let backup = '';
	function updateValue(value: string) {
		if (backup != value && editor) {
			setValue(value);
			backup = value;
		}
	}

	const dispatch = createEventDispatcher();
	function handleInput() {
		value = editor.getValue();
		dispatch('input', value);
		backup = value;
	}

	$: clientWidth && editor && handleResize();
	// $: $format > 0 && editor && setValue(handleFormat(editor.getValue(), getExtension(filename)));
	// $: $save > 0 && editor && handleSave(editor.getValue(), $page.params.projectID);
	// $: $reset > 0 && editor && handleReset();
	$: updateSession(filename);
	$: updateValue(value);

	let clientWidth: number;
</script>

<div class="h-full w-full pt-3 bg-brand-editor-background" bind:clientWidth>
	<div bind:this={element} class="h-full w-full" id="ace-editor" />
</div>
