<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let files: FileList;
	let url: string;
	export let editing = false;
	export let title: string;
	export let subtitle: string;
	export let file: File;

	async function upload() {
		try {
			file = files[0];
		} catch (err) {
			dispatch('error');
		}
	}
</script>

<div>
	<p class="font-bold">{title}</p>
	<p class="text-sm mb-1">{subtitle}</p>
	{#if (files && files.length > 0) || url}
		<div class="p-3">
			<img src={url ? url : URL.createObjectURL(files[0])} alt="Preview of upload" class="w-32" />
		</div>
	{/if}
	{#if editing}
		<input type="file" bind:files on:change={upload} />
	{/if}
</div>
