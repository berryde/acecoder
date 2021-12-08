<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	import { EditorView, keymap } from '@codemirror/view';
	import { Compartment, EditorState } from '@codemirror/state';
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
	import { selectedTab, unsavedTabs } from '../../utils/tabs/tabs';
	import { oneDark } from '@codemirror/theme-one-dark';
	import { getExtension, getFile } from 'src/utils/filesystem/filesystem';
	import type { FSFile } from 'src/utils/types';

	/**
	 * Event dispatcher to send custom events.
	 */
	const dispatch = createEventDispatcher();

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
		view.state.update({
			changes: {
				from: 0,
				to: view.state.doc.length,
				insert: _format(view.state.doc.toString(), getExtension($selectedTab))
			}
		});

		return true;
	};

	const saveContent: Command = (view: EditorView): boolean => {
		if ($unsavedTabs.includes($selectedTab)) {
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
		if (error && error.location == $selectedTab) {
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
	 * Get the text value of the editor.
	 */
	function getValue() {
		return view == undefined ? '' : view.state.doc.toString();
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

	function getTheme(): Extension {
		return $darkMode ? oneDark : EditorView.theme({});
	}

	function getLanguage(): Extension {
		const language = getExtension($selectedTab);
		return isSupported(language) ? getLanguageSupport(language) : [];
	}

	let languageSupport = new Compartment();
	let theme = new Compartment();
	let view: EditorView;

	onMount(() => {
		view = new EditorView({
			state: EditorState.create({
				doc: '',
				extensions: [
					defaultExtensions,
					EditorView.updateListener.of((viewUpdate: ViewUpdate) => {
						// Emit an event to allow parent components to listen to the editor's value.
						if (viewUpdate.docChanged) dispatch('docchanged', getValue());
					}),
					keymap.of([format, save]),
					linter((view) => getError(view)),
					// Create a dummy extension when no language support is available.
					languageSupport.of(getLanguage()),
					theme.of(getTheme())
				]
			}),
			parent: element
		});

		selectedTab.subscribe((tab) => {
			if (tab) {
				// Update the contents and language support
				const value = (getFile(tab) as FSFile).value;
				view.dispatch({
					changes: [{ from: 0, to: view.state.doc.length, insert: value }],
					effects: [languageSupport.reconfigure(getLanguage())]
				});
			}
		});

		darkMode.subscribe(() => {
			view.dispatch({
				effects: [theme.reconfigure(getTheme())]
			});
		});
	});
</script>

<div bind:this={element} class="text-sm" on:mousedown={mouseDown} />

<style lang="postcss">
	:global(.cm-editor) {
		@apply h-full;
	}
	:global(.cm-tooltip) {
		font-family: monospace;
	}
	:global(.cm-content) {
		min-width: 0 !important;
	}
</style>
