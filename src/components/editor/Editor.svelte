<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	import { EditorView, keymap } from '@codemirror/view';
	import { EditorState } from '@codemirror/state';
	import {
		defaultExtensions,
		getLanguageSupport,
		getParser,
		isSupported
	} from '../../utils/codemirror/codemirror';
	import prettier from 'prettier';
	import type { ViewUpdate } from '@codemirror/view';
	import type { KeyBinding, Command } from '@codemirror/view';

	/**
	 * The langauge to use for this editor.
	 */
	export let language: string;

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
	 * The basic editor config before language specific features.
	 */
	const baseConfig = [
		defaultExtensions,
		EditorView.updateListener.of((viewUpdate: ViewUpdate) => {
			// Emit an event to allow parent components to listen to the editor's value.
			if (viewUpdate.docChanged) {
				dispatch('docchanged', getValue());
			}
		})
	];

	/**
	 * CodeMirror command to format the editor with prettier.
	 *
	 * @param view The editor to format
	 * @returns Whether the format was successful
	 */
	const formatEditor: Command = (view: EditorView): boolean => {
		if (isSupported(language)) {
			const result = prettier.format(view.state.doc.toString(), getParser(language));
			view.dispatch({
				changes: { from: 0, to: view.state.doc.length, insert: result }
			});
			return true;
		}
		return false;
	};

	const saveContent: Command = (view: EditorView): boolean => {
		dispatch('save');
		return true;
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
	 * The state of the editor.
	 */
	$: state = EditorState.create({
		doc: initialValue,
		extensions: isSupported(language)
			? [baseConfig, getLanguageSupport(language), keymap.of([format, save])]
			: baseConfig
	});

	/**
	 * Get the text value of the editor.
	 */
	function getValue() {
		return view == undefined ? '' : view.state.doc.toString();
	}

	onMount(updateEditor);

	$: changeLanguage(language);

	function changeLanguage(language: string) {
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
</script>

<div bind:this={element} class="editor {!selected && 'hidden'}" />

<style lang="postcss">
	.editor {
		flex-grow: 1;
	}
	:global(.cm-editor) {
		@apply h-full overflow-auto;
	}
</style>
