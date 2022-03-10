<script lang="ts">
	import type { Editor, IEditSession } from 'brace';
	import { getExtension } from 'src/utils/filesystem/filesystem';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { browser } from '$app/env';
	import { updateUnsaved } from 'src/utils/tabs/tabs';
	import { EDITOR_FONT_SIZE, EDITOR_TAB_SIZE } from 'src/utils/constants';

	const dispatch = createEventDispatcher();

	/**
	 * The value of the editor
	 */
	export let value: string;

	/**
	 * The filename of the tab open in this editor
	 */
	export let filename: string;

	/**
	 * A backup of the editor's content
	 */
	let backup = '';

	/**
	 * A map of filename to editor session for that file
	 */
	let sessions: Record<string, IEditSession> = {};

	/**
	 * The container for the editor
	 */
	let element: HTMLElement;

	/**
	 * The Ace editor instance
	 */
	let editor: Editor;

	/**
	 * The width of the editor
	 */
	let clientWidth: number;

	/**
	 * The ace editor instance
	 */
	let ace: { edit: any; EditSession: any; UndoManager: any; default?: any };

	/**
	 * Set up the editor with the default theme and configuration when the component is rendered.
	 */
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
		editor.setOptions({
			enableBasicAutocompletion: true,
			enableLiveAutocompletion: true,
			fontSize: EDITOR_FONT_SIZE
		});
		setValue(value);

		editor.on('change', () => {
			handleInput();
		});
	}

	/**
	 * Update the editor session when the user selects a different tab
	 * @param filename The filename of the newly selected tab
	 */
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
				session.setTabSize(EDITOR_TAB_SIZE);
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

	/**
	 * Update the value of the editor
	 * @param value The value to use
	 */
	function updateValue(value: string) {
		if (backup != value && editor) {
			setValue(value);
			backup = value;
		}
	}

	/**
	 * Called whenever input is added to the editor
	 */
	function handleInput() {
		value = editor.getValue();
		dispatch('input', value);
		updateUnsaved(filename, value);
		backup = value;
	}

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

	$: clientWidth && editor && handleResize();
	$: updateSession(filename);
	$: updateValue(value);
</script>

<div class="h-full w-full pt-3 bg-brand-editor-background" bind:clientWidth>
	<div bind:this={element} class="h-full w-full" id="ace-editor" />
</div>
