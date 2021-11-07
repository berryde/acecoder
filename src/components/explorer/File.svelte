<script lang="ts">
	// Icons
	import Trash from 'phosphor-svelte/lib/Trash';
	import Hoverable from '../common/Hoverable.svelte';
	import File from 'phosphor-svelte/lib/File';
	import Pencil from 'phosphor-svelte/lib/Pencil';

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
			<File />
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
				<div>
					<File />
				</div>
				<p class="truncate">{name}</p>
				<div
					class="flex flex-row justify-end flex-grow transition-opacity pr-2 space-x-1 {hovering
						? 'opacity-100'
						: 'opacity-0'}"
				>
					<div on:click={() => setRenaming(true)}>
						<Pencil />
					</div>
					<div on:click={handleDelete}>
						<Trash />
					</div>
				</div>
			</div>
		</Hoverable>
	{/if}
</div>
