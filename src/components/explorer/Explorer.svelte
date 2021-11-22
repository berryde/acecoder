<script lang="ts">
	// Icons
	import FolderIcon from 'svelte-icons/fa/FaFolder.svelte';
	import FileIcon from 'svelte-icons/fa/FaFile.svelte';
	import OutlineFileIcon from 'svelte-icons/fa/FaRegFile.svelte';
	import OutlineFolderIcon from 'svelte-icons/fa/FaRegFolder.svelte';
	import ExplorerInput from './ExplorerInput.svelte';
	import FaDownload from 'svelte-icons/fa/FaDownload.svelte';

	// Components
	import File from './File.svelte';
	import Folder from './Folder.svelte';

	// Utils

	import {
		compareFile,
		createFile,
		createFolder,
		exportFilesystem,
		filesystem,
		getExistingFiles
	} from '../../utils/filesystem/filesystem';
	import { openTab } from '../../utils/tabs/tabs';
	import Icon from '../common/Icon.svelte';

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

	function handleExport() {
		exportFilesystem($filesystem);
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
	<div class="overflow-auto w-full flex-grow h-full">
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
				on:cancelled={(e) => {
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
</div>
