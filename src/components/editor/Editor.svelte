<script lang="ts">
	import type { Editor, IEditSession, Position } from 'brace';
	import { getExtension, getFile } from 'src/utils/filesystem/filesystem';
	import { selectedTab, unsavedTabs } from 'src/utils/tabs/tabs';
	import type { FSFile } from 'src/utils/types';
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/env';
	import { contents, format } from 'src/utils/editor/editor';
	import { formatOnSave } from 'src/utils/settings/settings';
	import { save } from 'src/utils/editor/editor';
	import { page } from '$app/stores';

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
		editor.setShowPrintMargin(false);
		editor.setOptions({ enableBasicAutocompletion: true, fontSize: '1rem' });
		editor.on('change', () => {
			contents.set(editor.getValue());
			if (!$unsavedTabs.includes($selectedTab)) {
				unsavedTabs.update((tabs) => [...tabs, $selectedTab]);
			} else if (editor.getValue() === (getFile($selectedTab) as FSFile).value) {
				unsavedTabs.update((tabs) => {
					tabs.splice(tabs.indexOf($selectedTab), 1);
					return tabs;
				});
			}
		});
		loaded = true;
	}

	function handleFormat() {
		const pos: Position = editor.getCursorPosition();
		editor.setValue(format(editor.getValue(), getExtension($selectedTab)));
		editor.moveCursorToPosition(pos);
		editor.clearSelection();
	}

	function handleSave() {
		if ($formatOnSave) handleFormat();
		save($page.params.projectID);
	}

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
				if (getExtension($selectedTab) == 'svelte') {
					session.setUseWorker(false);
				}
				session.setUseWrapMode(true);
				sessions[$selectedTab] = session;
			}
			editor.setSession(sessions[$selectedTab]);
		}
	}

	function handleResize() {
		editor.resize();
	}

	$: loaded && $selectedTab && updateSession();
	$: clientWidth && editor && handleResize();
	let clientWidth: number;
</script>

<div class="h-full w-full pt-3 bg-brand-editor-background" bind:clientWidth>
	<div bind:this={element} class="h-full w-full" />
</div>
