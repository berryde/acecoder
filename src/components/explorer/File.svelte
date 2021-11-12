<script lang="ts">
	// Icons
	import Trash from 'svelte-icons/io/IoMdTrash.svelte';
	import Hoverable from '../common/Hoverable.svelte';
	import FileIcon from 'svelte-icons/io/IoMdDocument.svelte';
	import Pen from 'svelte-icons/fa/FaPen.svelte';

	// Components
	import ExplorerInput from './ExplorerInput.svelte';

	// Utils
	import {
		tail,
		deleteFile,
		filesystem,
		getParentDir,
		getExistingFiles,
		navigateToFile,
		renameFile
	} from '../../utils/filesystem/filesystem';
	import { closeTab, openTab, renameTab, selectedTab } from '../../utils/tabs/tabs';

	// Props
	/**
	 * The full path to this file including the filename.
	 */
	export let path: string;

	/**
	 * The depth of this file in the file tree.
	 */
	export let depth: number = 0;

	// Variables
	let renaming = false;
	$: name = tail(path);

	/**
	 * Update whether the renaming input field should be shown.
	 * @param isRenaming Whether the user is renaming this file.
	 */
	function setRenaming(isRenaming: boolean) {
		renaming = isRenaming;
	}

	/**
	 * Called when the user starts dragging this file to
	 * move it to another location in the filesystem.
	 * @param e The drag event.
	 */
	function handleDragStart(e: DragEvent) {
		e.dataTransfer.setData('text', path);
	}

	/**
	 * Delete the file when the delete button is pressed.
	 */
	function handleDelete() {
		deleteFile(path);
		closeTab(path);
	}

	/**
	 * Called when the user renames the file.
	 * @param newName The new name for the file.
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
	 * Rename this file.
	 * @param name The new name for the file.
	 */
	function rename(name: string) {
		renameFile(path, name);
		renameTab(path, name);
	}

	/**
	 * Called when the user clicks on this file.
	 * Clicking on the file should open a tab to edit the file if there isn't
	 * already a tab open for this file.
	 */
	function handleClick() {
		openTab(path);
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
			<div class="h-4">
				<FileIcon />
			</div>
		</ExplorerInput>
	{:else}
		<Hoverable let:hovering>
			<div
				class="flex transition flex-row items-center space-x-2 text-bluegray-light h-8 {$selectedTab ===
					path && 'bg-gray-800'}"
				style="padding-left: {(depth + 1) * 0.5}rem;"
				draggable="true"
				on:dragstart={handleDragStart}
				on:click={handleClick}
			>
				<div class="h-4">
					<FileIcon />
				</div>
				<p class="truncate">{name}</p>
				<div
					class="flex flex-row justify-end items-center flex-grow transition-opacity pr-2 space-x-1 {hovering
						? 'opacity-100'
						: 'opacity-0'}"
				>
					<div on:click={() => setRenaming(true)} class="h-3" data-testid="rename-file">
						<Pen />
					</div>
					<div on:click={handleDelete} class="h-4" data-testid="delete-file">
						<Trash />
					</div>
				</div>
			</div>
		</Hoverable>
	{/if}
</div>
