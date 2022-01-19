<script lang="ts">
	import Trash from 'svelte-icons/io/IoMdTrash.svelte';
	import Hoverable from '../common/Hoverable.svelte';
	import FileIcon from 'svelte-icons/fa/FaRegFile.svelte';
	import Pen from 'svelte-icons/fa/FaPen.svelte';
	import ExplorerInput from './ExplorerInput.svelte';
	import {
		tail,
		deleteFile,
		getParentDir,
		getExistingFiles,
		navigateToFile,
		renameFile
	} from '../../utils/filesystem/filesystem';
	import { closeTab, openTab, renameTab, selectedTab } from '../../utils/tabs/tabs';
	import { latestError } from '../../utils/console/console';
	import Icon from '../common/Icon.svelte';
	import Draggable from '../common/Draggable.svelte';

	/**
	 * The full path to this file including the filename.
	 */
	export let path: string;

	export let modifiable: boolean;

	/**
	 * The depth of this file in the file tree.
	 */
	export let depth = 0;

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

{#if renaming}
	<ExplorerInput
		reservedNames={getExistingFiles(navigateToFile(path))}
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
	<Draggable data={path} variant="explorer" enabled={modifiable}>
		<Hoverable let:hovering>
			<div
				class="flex transition flex-row items-center space-x-2 {$latestError &&
				$latestError.location == path
					? 'text-red-400'
					: 'text-brand-text'} h-8 {$selectedTab === path && 'bg-gray-800 bg-gray-100 '}"
				style="padding-left: {(depth + 1.5) * 0.5}rem;"
				draggable="true"
				on:dragstart={handleDragStart}
				on:click={handleClick}
			>
				<Icon>
					<FileIcon />
				</Icon>

				<p class="truncate">{name}</p>
				{#if modifiable}
					<div
						class="flex flex-row text-brand-text justify-end items-center flex-grow pr-2 space-x-1 transition-opacity {!hovering
							? 'opacity-0'
							: 'opacity-100'}"
					>
						<Icon
							on:click={() => setRenaming(true)}
							testId="rename-file"
							button={true}
							label="Rename"
						>
							<Pen />
						</Icon>
						<Icon on:click={handleDelete} testId="delete-file" button={true} label="Delete">
							<Trash />
						</Icon>
					</div>
				{/if}
			</div>
		</Hoverable>
	</Draggable>
{/if}
