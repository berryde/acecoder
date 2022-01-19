<svelte:options accessors />

<script lang="ts">
	import type { Editor } from 'brace';
	import { onDestroy, onMount } from 'svelte';

	let element: HTMLElement;
	let editor: Editor;

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
</script>

<div class="h-full w-full p-3 bg-brand-editor-background">
	<div bind:this={element} class="h-full w-full" />
</div>
