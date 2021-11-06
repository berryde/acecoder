<script lang="ts">
	// Icons
	import FilePlus from 'phosphor-svelte/lib/FilePlus';
	import FolderPlus from 'phosphor-svelte/lib/FolderPlus';
	import ExplorerInput from './ExplorerInput.svelte';
	import FolderIcon from 'phosphor-svelte/lib/Folder';
	import FileIcon from 'phosphor-svelte/lib/File';

	// Components
	import File from './File.svelte';
	import Folder from './Folder.svelte';

	// Utils
	import type { Filesystem } from '../../utils/types';
	import {
		compareFile,
		createFile,
		createFolder,
		filesystem,
		getExistingFiles
	} from '../../utils/filesystem/filesystem';
	import { openTab } from '../../utils/tabs/tabs';

	// Props
	export let files: Filesystem;

	// Variables
	let creating = false;
	let creatingFile = false;

	function setCreatingFolder(isCreating: boolean) {
		creating = isCreating;
		creatingFile = false;
	}

	function setCreatingFile(isCreating: boolean) {
		creating = isCreating;
		creatingFile = true;
	}

	function setCreating(isCreating: boolean) {
		creating = isCreating;
	}

	function handleCreate(name: string) {
		if (creatingFile) {
			createFile(name);
			openTab(name);
		} else {
			createFolder(name);
		}
		creating = false;
	}
</script>

<div class="bg-bluegray-dark h-screen text-bluegray-light">
	<div class="flex flex-row p-2 space-x-2">
		<div on:click={() => setCreatingFile(true)} class="">
			<FilePlus />
		</div>
		<div on:click={() => setCreatingFolder(true)} class="">
			<FolderPlus />
		</div>
	</div>

	{#each Object.entries(files).sort(compareFile) as [path, object]}
		{#if object.type === 'file'}
			<File {path} />
		{:else}
			<Folder {path} children={object.children} />
		{/if}
	{/each}
	{#if creating}
		<ExplorerInput
			on:submit={(e) => {
				handleCreate(e.detail);
			}}
			on:cancelled={(e) => {
				setCreating(false);
			}}
			reservedNames={getExistingFiles($filesystem)}
		>
			{#if creatingFile}
				<FileIcon />
			{:else}
				<FolderIcon />
			{/if}
		</ExplorerInput>
	{/if}
</div>
