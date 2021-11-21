<script lang="ts">
	import Trash from 'svelte-icons/io/IoMdTrash.svelte';
	import Hoverable from '../common/Hoverable.svelte';
	import FileIcon from 'svelte-icons/fa/FaRegFile.svelte';
	import Pen from 'svelte-icons/fa/FaPen.svelte';
	import ExplorerInput from './ExplorerInput.svelte';
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
	import { latestError } from '../../utils/console/console';
	import Icon from '../common/Icon.svelte';

	/**
	 * The full path to this file including the filename.
	 */
	export let path: string;

	/**
	 * The depth of this file in the file tree.
	 */
	export let depth: number = 0;

	/**
	 * Whether the user is renaming this file.
	 */
	let renaming = false;

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

	$: name = tail(path);
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
			<Icon>
				<FileIcon />
			</Icon>
		</ExplorerInput>
	{:else}
		<Hoverable let:hovering>
			<div
				class="flex transition flex-row items-center space-x-2 {$latestError &&
				$latestError.location == path
					? 'text-red-400'
					: 'dark:text-dark-text'} h-8 {$selectedTab === path && 'dark:bg-gray-800'}"
				style="padding-left: {(depth + 1.5) * 0.5}rem;"
				draggable="true"
				on:dragstart={handleDragStart}
				on:click={handleClick}
			>
				<Icon>
					<FileIcon />
				</Icon>

				<p class="truncate">{name}</p>
				<div
					class="flex flex-row dark:text-dark-text justify-end items-center flex-grow pr-2 space-x-1 {!hovering &&
						'hidden'}"
				>
					<Icon on:click={() => setRenaming(true)} testId="rename-file" button={true}>
						<Pen />
					</Icon>
					<Icon on:click={handleDelete} testId="delete-file" button={true}>
						<Trash />
					</Icon>
				</div>
			</div>
		</Hoverable>
	{/if}
</div>
