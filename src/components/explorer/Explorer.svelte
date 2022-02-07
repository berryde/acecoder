<script lang="ts">
	import FolderIcon from 'svelte-icons/fa/FaFolder.svelte';
	import FileIcon from 'svelte-icons/fa/FaFile.svelte';
	import ArchiveIcon from 'svelte-icons/io/IoIosFiling.svelte';
	import OutlineFileIcon from 'svelte-icons/fa/FaRegFile.svelte';
	import OutlineFolderIcon from 'svelte-icons/fa/FaRegFolder.svelte';
	import ExplorerInput from './ExplorerInput.svelte';
	import File from './File.svelte';
	import Folder from './Folder.svelte';
	import {
		compareFile,
		createFile,
		createFolder,
		exists,
		filesystem,
		getExistingFiles,
		getParentDir,
		renameFile,
		tail
	} from '../../utils/filesystem/filesystem';
	import { openTab, renameTab } from '../../utils/tabs/tabs';
	import Icon from '../common/Icon.svelte';
	import Droppable from '../common/Droppable.svelte';

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

	/**
	 * Called when a draggable object is hovered over this folder.
	 * @param data The drag event data.
	 */
	function dropped(data: string) {
		// A file can't be moved into itself or into the parent directory as it's already in it.
		const path = '';
		if (
			exists(data) &&
			path !== data &&
			getParentDir(data) !== path &&
			getParentDir(path) !== data
		) {
			const oldName = tail(data);
			renameFile(data, oldName);
			renameTab(data, oldName);
		}
	}
</script>

<div class="flex items-center px-5 py-3 justify-between bg-brand-accent">
	<div class="flex items-center space-x-5 ">
		<Icon>
			<ArchiveIcon />
		</Icon>
		<p>Files</p>
	</div>
	<div class="flex items-center space-x-3 mr-3">
		<Icon
			on:click={() => setCreatingFile(true)}
			testId="add-file"
			button={true}
			label="New file"
			card={true}
			size="small"
		>
			<FileIcon />
		</Icon>
		<Icon
			on:click={() => setCreatingFolder(true)}
			testId="add-folder"
			button={true}
			label="New folder"
			card={true}
			size="small"
		>
			<FolderIcon />
		</Icon>
	</div>
</div>
<div class="flex flex-row space-x-2 px-5 pt-3" />
<div class="w-full p-3">
	{#each Object.entries($filesystem).sort(compareFile) as [path, object]}
		{#if object.type === 'file' && object.modifiable}
			<File {path} modifiable={object.modifiable} />
		{:else if object.type == 'folder'}
			<Folder {path} children={object.children} modifiable={object.modifiable} />
		{/if}
	{/each}
	{#if creating}
		<ExplorerInput
			on:submit={(e) => {
				handleCreate(e.detail);
			}}
			on:cancelled={() => {
				setCreating(false);
			}}
			reservedNames={getExistingFiles($filesystem)}
		>
			<Icon>
				{#if creatingFile}
					<OutlineFileIcon />
				{:else}
					<OutlineFolderIcon />
				{/if}
			</Icon>
		</ExplorerInput>
	{/if}
	<Droppable
		let:dropping
		on:dropped={(e) => dropped(e.detail)}
		variant="explorer"
		classes="w-full h-full"
	>
		<div class="{dropping && 'bg-blue-500 bg-opacity-50'} w-full h-full transition-all" />
	</Droppable>
</div>
