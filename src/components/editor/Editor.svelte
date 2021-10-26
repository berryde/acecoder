<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	import { EditorView } from '@codemirror/view';
	import { EditorState } from '@codemirror/state';
	import { defaultExtensions, getLanguageSupport } from '../../utils/codemirror';
	import type { ViewUpdate } from '@codemirror/view';

	/**
	 * The langauge to use for this editor.
	 */
	export let language: string;

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
	 * The state of the editor.
	 */
	const state = EditorState.create({
		doc: initialValue,
		extensions: [
			defaultExtensions,
			EditorView.updateListener.of((viewUpdate: ViewUpdate) => {
				// Emit an event to allow parent components to listen to the editor's value.
				if (viewUpdate.docChanged) {
					dispatch('docchanged', getValue());
				}
			}),
			getLanguageSupport(language)
		]
	});

	/**
	 * Get the text value of the editor.
	 */
	function getValue() {
		return view == undefined ? '' : view.state.doc.toString();
	}

	onMount(() => {
		view = new EditorView({
			state: state,
			parent: element
		});
	});
</script>

<div bind:this={element} />
