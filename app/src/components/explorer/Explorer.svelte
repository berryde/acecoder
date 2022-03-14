<script lang="ts">
	import ArchiveIcon from 'svelte-icons/io/IoIosFiling.svelte';
	import OutlineFileIcon from 'svelte-icons/fa/FaRegFile.svelte';
	import OutlineFolderIcon from 'svelte-icons/fa/FaRegFolder.svelte';
	import ExplorerInput from './ExplorerInput.svelte';
	import File from './File.svelte';
	import Folder from './Folder.svelte';
	import {
		sort,
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

	/**
	 * Whether the user is creating
	 */
	let creating = false;

	/**
	 * Whether the user is creating a file
	 */
	let creatingFile = false;

	/**
	 * Called when the user starts or stops creating a new file
	 * @param isCreating Whether the user is creating a new file
	 */
	function setCreating(isCreating: boolean) {
		creating = isCreating;
	}

	/**
	 * Called when the user submits a new file for creation
	 * @param name The name of the file to create
	 */
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

<div class="flex items-center px-5 py-3 space-x-5 bg-brand-accent">
	<Icon>
		<ArchiveIcon />
	</Icon>
	<h1>Files</h1>
</div>
<div class="w-full p-5" role="tree">
	{#each Object.entries(sort($filesystem)) as [path, object]}
		{#if object.type === 'file' && object.modifiable}
			<File {path} />
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
