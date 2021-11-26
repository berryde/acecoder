<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	import { EditorView, keymap } from '@codemirror/view';
	import { EditorState } from '@codemirror/state';
	import type { Extension } from '@codemirror/state';
	import {
		defaultExtensions,
		getLanguageSupport,
		format as _format,
		isSupported
	} from '../../utils/codemirror/codemirror';
	import type { ViewUpdate } from '@codemirror/view';
	import type { KeyBinding, Command } from '@codemirror/view';
	import type { Diagnostic } from '@codemirror/lint';
	import { linter } from '@codemirror/lint';
	import { latestError } from '../../utils/console/console';
	import { darkMode, formatOnSave } from '../../utils/settings/settings';
	import { unsavedTabs } from '../../utils/tabs/tabs';
	import { oneDark } from '@codemirror/theme-one-dark';

	/**
	 * The langauge to use for this editor.
	 */
	export let language: string;

	/**
	 * The filename of the file being edited by this editor.
	 */
	export let filename: string;

	/**
	 * Whether this editor is currently used.
	 */
	export let selected: boolean;

	/**
	 * The initial text value of the editor.
	 */
	export let initialValue = '';

	/**
	 * Event dispatcher to send custom events.
	 */
	const dispatch = createEventDispatcher();

	/**
	 * The UI component of the editor.
	 */
	let view: EditorView;

	/**
	 * The parent element for the editor.
	 */
	let element: HTMLDivElement;

	/**
	 * CodeMirror command to format the editor with prettier.
	 *
	 * @param view The editor to format
	 * @returns Whether the format was successful
	 */
	const formatEditor: Command = (view: EditorView): boolean => {
		view.dispatch({
			changes: {
				from: 0,
				to: view.state.doc.length,
				insert: _format(view.state.doc.toString(), language)
			}
		});
		return true;
	};

	const saveContent: Command = (view: EditorView): boolean => {
		if ($unsavedTabs.includes(filename)) {
			if ($formatOnSave) {
				formatEditor(view);
			}
			dispatch('save');
		}
		return true;
	};

	const getError = (view: EditorView): readonly Diagnostic[] => {
		const error = $latestError;
		let output: readonly Diagnostic[] = [];
		if (error && error.location == filename) {
			output = [
				{
					from: Math.max(0, error.pos - 5),
					to: Math.min(view.state.doc.toString().length, error.pos + 5),
					message: error.message,
					severity: 'error',
					source: error.name
				}
			];
		}
		return output;
	};

	/**
	 * A key binding to run prettier formatting.
	 */
	const format: KeyBinding = {
		key: 'Ctrl-Alt-l',
		run: formatEditor
	};

	/**
	 * A key binding to save the file.
	 */
	const save: KeyBinding = {
		key: 'Ctrl-s',
		run: saveContent
	};

	/**
	 * The basic editor config before language specific features.
	 */
	const baseConfig = [
		defaultExtensions,
		EditorView.updateListener.of((viewUpdate: ViewUpdate) => {
			// Emit an event to allow parent components to listen to the editor's value.
			if (viewUpdate.docChanged) {
				dispatch('docchanged', getValue());
			}
		}),
		keymap.of([format, save]),
		linter((view) => getError(view))
	];

	function getExtensions(): Extension {
		const output = [...baseConfig];
		if (isSupported(language)) {
			output.push(getLanguageSupport(language));
		}
		if ($darkMode) {
			output.push(oneDark);
		}
		return output;
	}

	/**
	 * Get the text value of the editor.
	 */
	function getValue() {
		return view == undefined ? '' : view.state.doc.toString();
	}

	function changeLanguage() {
		updateEditor();
	}

	function updateEditor() {
		if (view) {
			view.destroy();
		}
		view = new EditorView({
			state: state,
			parent: element
		});
	}

	function refreshState(value: string) {
		return EditorState.create({
			doc: value,
			extensions: getExtensions()
		});
	}

	function mouseUp() {
		if (window) {
			dispatch('drag', false);
			window.removeEventListener('mouseup', mouseUp);
		}
	}

	function mouseDown() {
		if (window) {
			dispatch('drag', true);
			window.addEventListener('mouseup', mouseUp);
		}
	}

	/**
	 * Update the editor state whenever any of the props change.
	 */
	$: state = refreshState(initialValue);

	/**
	 * Update the editor when the language changes
	 */
	$: language && changeLanguage();

	darkMode.subscribe(() => {
		if (view) {
			state = refreshState(view.state.doc.toString());
		}
		updateEditor();
	});

	onMount(updateEditor);
</script>

<div
	bind:this={element}
	class="editor {!selected && 'hidden'} overflow-y-auto flex-grow"
	on:mousedown={mouseDown}
/>

<style lang="postcss">
	.editor {
		flex-grow: 1;
	}
	:global(.cm-editor) {
		@apply h-full overflow-auto;
	}
	:global(.cm-tooltip) {
		font-family: monospace;
	}
</style>
