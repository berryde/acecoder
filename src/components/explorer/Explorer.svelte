<script lang="ts">
	import FolderIcon from 'svelte-icons/fa/FaFolder.svelte';
	import FileIcon from 'svelte-icons/fa/FaFile.svelte';
	import OutlineFileIcon from 'svelte-icons/fa/FaRegFile.svelte';
	import OutlineFolderIcon from 'svelte-icons/fa/FaRegFolder.svelte';
	import ExplorerInput from './ExplorerInput.svelte';
	import FaDownload from 'svelte-icons/fa/FaDownload.svelte';
	import File from './File.svelte';
	import Folder from './Folder.svelte';
	import {
		compareFile,
		createFile,
		createFolder,
		exists,
		exportFilesystem,
		filesystem,
		getExistingFiles,
		getParentDir,
		renameFile,
		tail
	} from '../../utils/filesystem/filesystem';
	import { openTab, renameTab } from '../../utils/tabs/tabs';
	import Icon from '../common/Icon.svelte';
	import Droppable from '../common/Droppable.svelte';
	import { initialising } from 'src/utils/exercise/exercise';
	import CircularProgressIndicator from '../loaders/CircularProgressIndicator.svelte';

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

	function handleExport() {
		exportFilesystem();
	}
</script>

<div class="flex flex-col h-full">
	<div class="flex flex-row space-x-2 pl-3 pb-1">
		<Icon on:click={() => setCreatingFile(true)} testId="add-file" button={true}>
			<FileIcon />
		</Icon>
		<Icon on:click={() => setCreatingFolder(true)} testId="add-folder" button={true}>
			<FolderIcon />
		</Icon>
		<Icon on:click={() => handleExport()} testId="export" button={true}>
			<FaDownload />
		</Icon>
	</div>
	{#if $initialising}
		<div class="h-full flex items-center justify-center">
			<CircularProgressIndicator />
		</div>
	{:else}
		<div class="w-full">
			{#each Object.entries($filesystem).sort(compareFile) as [path, object]}
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
		</div>
		<Droppable
			let:dropping
			on:dropped={(e) => dropped(e.detail)}
			variant="explorer"
			classes="w-full h-full"
		>
			<div class="{dropping && 'bg-blue-500 bg-opacity-50'} w-full h-full transition-all" />
		</Droppable>
	{/if}
</div>
