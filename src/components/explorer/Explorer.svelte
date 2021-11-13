<script lang="ts">
	// Icons
	import FolderIcon from 'svelte-icons/fa/FaFolder.svelte';
	import FileIcon from 'svelte-icons/fa/FaFile.svelte';
	import OutlineFileIcon from 'svelte-icons/fa/FaRegFile.svelte';
	import OutlineFolderIcon from 'svelte-icons/fa/FaRegFolder.svelte';
	import ExplorerInput from './ExplorerInput.svelte';

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
	<div class="flex flex-row items-center p-2 space-x-2">
		<div on:click={() => setCreatingFile(true)} data-testid="add-file" class="h-4">
			<FileIcon />
		</div>
		<div on:click={() => setCreatingFolder(true)} data-testid="add-folder" class="h-4">
			<FolderIcon />
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
			<div class="h-4">
				{#if creatingFile}
					<OutlineFileIcon />
				{:else}
					<OutlineFolderIcon />
				{/if}
			</div>
		</ExplorerInput>
	{/if}
</div>
