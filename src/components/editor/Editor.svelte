<script lang="ts">
	import { Editor, EditSession, IEditSession } from 'brace';
	import { getExtension, getFile } from 'src/utils/filesystem/filesystem';
	import { selectedTab } from 'src/utils/tabs/tabs';
	import type { FSFile } from 'src/utils/types';
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/env';

	let element: HTMLElement;
	let editor: Editor;
	let sessions: Record<string, IEditSession> = {};

	onMount(async () => {
		const ace = await import('brace');
		await import('brace/mode/javascript');
		await import('brace/ext/language_tools');
		await import('./AceTheme');

		editor = ace.edit(element);
		editor.getSession().setMode('ace/mode/javascript');
		editor.setTheme('ace/theme/folio');
		editor.setOptions({ enableBasicAutocompletion: true, fontSize: '1rem' });
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
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
			default:
				await import('brace/mode/plain_text');
				return 'ace/mode/plain_text';
		}
	}

	async function updateSession() {
		if (browser) {
			if (!($selectedTab in sessions)) {
				const session = new EditSession((getFile($selectedTab) as FSFile).value);
				session.setMode(await importMode($selectedTab));
				session.setUseWrapMode(true);
				sessions[$selectedTab] = session;
			}
			editor.setSession(sessions[$selectedTab]);
		}
	}

	$: editor && $selectedTab && updateSession();
</script>

<div class="h-full w-full p-3 bg-brand-editor-background">
	<div bind:this={element} class="h-full w-full" />
</div>
