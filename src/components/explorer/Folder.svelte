<script lang="ts">
	// Icons
	import FolderOpen from 'phosphor-svelte/lib/FolderOpen';
	import Folder from 'phosphor-svelte/lib/Folder';
	import FileIcon from 'phosphor-svelte/lib/File';
	import Pencil from 'phosphor-svelte/lib/Pencil';
	import FilePlus from 'phosphor-svelte/lib/FilePlus';
	import Trash from 'phosphor-svelte/lib/Trash';
	import FolderPlus from 'phosphor-svelte/lib/FolderPlus';

	// Components
	import ExplorerInput from './ExplorerInput.svelte';
	import File from './File.svelte';
	import Hoverable from './Hoverable.svelte';

	// Utils
	import {
		tail,
		renameFile,
		deleteFile,
		getParentDir,
		getExistingFiles,
		filesystem,
		navigateToFile,
		createFile,
		createFolder,
		compareFile
	} from '../../utils/filesystem/filesystem';
	import type { Filesystem } from '../../utils/types';
	import { renameTabs, closeTabs, openTab } from '../../utils/tabs/tabs';

	// Props
	/**
	 * The path to this folder.
	 */
	export let path: string;
	/**
	 * The children of this folder (more folders and files).
	 */
	export let children: Filesystem;
	/**
	 * The depth of this folder in the filesystem.
	 */
	export let depth: number = 0;

	// Variables
	let renaming = false;
	let creating = false;
	let creatingFile = false;
	let dragCount = 0;
	let collapsed = false;
	$: name = tail(path);

	/**
	 * Shows/hides the input to rename this folder.
	 * @param renaming Whether this folder is currently being renamed.
	 */
	function setRenaming(isRenaming: boolean) {
		renaming = isRenaming;
	}

	/**
	 * Shows/hides the input to create new objects within this folder.
	 * @param creating Whether a file is being added to this folder
	 */
	function setCreating(isCreating: boolean, isCreatingFile = true) {
		creating = isCreating;
		creatingFile = isCreatingFile;
	}

	/**
	 * Called when the user starts dragging this folder to move it to another folder.
	 * @param e The drag event.
	 */
	function handleDragStart(e: DragEvent) {
		e.dataTransfer.setData('text', path);
	}

	/**
	 * Called when a folder being dragged starts passing over this folder.
	 * A drag count is used to cancel out any unintented dragenter or dragleave events.
	 */
	function handleDragEnter() {
		dragCount += 1;
	}

	/**
	 * Called when a folder being dragged stops passing over this folder.
	 */
	function handleDragLeave() {
		dragCount -= 1;
	}

	/**
	 * Called when an object is dropped onto this folder
	 * @param e The DragEvent of the drop.
	 */
	function handleFileDropped(e: DragEvent) {
		const oldPath = e.dataTransfer.getData('text');
		// A file can't be moved into itself or into the parent directory as it's already in it.
		if (path !== oldPath && getParentDir(oldPath) !== path && getParentDir(path) !== oldPath) {
			const oldName = tail(oldPath);
			renameFile(oldPath, path + '/' + oldName);
		}
		dragCount = 0;
	}

	/**
	 * Rename this folder. Any tabs containing this folder's path should also be renamed.
	 * @param newName
	 */
	function handleRename(newName: string) {
		if (path.includes('/')) {
			const parent = getParentDir(path);
			rename(parent + '/' + newName);
		} else {
			rename(newName);
		}
		renaming = false;
	}

	/**
	 * Called when the user clicks the delete button for this folder.
	 */
	function handleDelete() {
		deleteFile(path);
		closeTabs(path);
	}

	/**
	 * Rename the path to this folder.
	 * @param name The new value for the path to this folder.
	 */
	function rename(name: string) {
		renameFile(path, name);
		renameTabs(path, name);
	}

	/**
	 * Show/hide the folder's contents.
	 */
	function toggleCollapse() {
		collapsed = !collapsed;
	}

	/**
	 * Called when the user clicks either of the buttons to create a child object in this folder.
	 * @param name The name of the new child object.
	 */
	function handleCreate(name: string) {
		const fullPath = path + '/' + name;
		if (creatingFile) {
			createFile(fullPath, '');
			openTab(fullPath);
		} else {
			createFolder(fullPath);
		}
		creating = false;
	}
</script>

<div>
	{#if renaming}
		<ExplorerInput
			reservedNames={getExistingFiles(navigateToFile($filesystem, path))}
			{depth}
			initialValue={name}
			on:submit={(e) => handleRename(e.detail)}
			on:cancelled={() => setRenaming(false)}
		>
			<Folder />
		</ExplorerInput>
	{:else}
		<Hoverable let:hovering>
			<div
				class="flex transition flex-row items-center space-x-2 text-bluegray-light h-8 {dragCount >
					0 && 'bg-blue-500'}"
				draggable="true"
				on:dragstart={handleDragStart}
				on:dragenter={handleDragEnter}
				on:dragover={(e) => e.preventDefault()}
				on:dragleave={handleDragLeave}
				on:drop={handleFileDropped}
				style="padding-left: {(depth + 1) * 0.5}rem;"
			>
				<div class="flex flex-row items-center flex-grow space-x-2" on:click={toggleCollapse}>
					{#if collapsed}
						<Folder />
					{:else}
						<FolderOpen />
					{/if}
					<p>{name}</p>
				</div>

				<div
					class="flex flex-row transition-opacity pr-2 space-x-1 {hovering
						? 'opacity-100'
						: 'opacity-0'}"
				>
					<div on:click={() => setRenaming(true)}>
						<Pencil />
					</div>
					<div on:click={() => setCreating(true, true)}>
						<FilePlus />
					</div>
					<div on:click={() => setCreating(true, false)}>
						<FolderPlus />
					</div>
					<div on:click={handleDelete}>
						<Trash />
					</div>
				</div>
			</div>
		</Hoverable>
	{/if}
	{#if !collapsed}
		<div>
			{#each Object.entries(children).sort(compareFile) as [name, object]}
				{#if object.type === 'file'}
					<File path={path + '/' + name} depth={depth + 1} />
				{:else}
					<svelte:self children={object.children} path={path + '/' + name} depth={depth + 1} />
				{/if}
			{/each}
		</div>
	{/if}
	{#if creating}
		<ExplorerInput
			on:submit={(e) => handleCreate(e.detail)}
			on:cancelled={() => setCreating(false)}
			depth={depth + 1}
			reservedNames={getExistingFiles(children)}
		>
			{#if creatingFile}
				<FileIcon />
			{:else}
				<Folder />
			{/if}
		</ExplorerInput>
	{/if}
</div>
