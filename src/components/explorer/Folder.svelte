<script lang="ts">
	// Icons
	import FolderOpen from 'svelte-icons/fa/FaRegFolderOpen.svelte';
	import Folder from 'svelte-icons/fa/FaFolder.svelte';
	import FolderOutline from 'svelte-icons/fa/FaRegFolder.svelte';
	import FileIcon from 'svelte-icons/io/IoMdDocument.svelte';
	import FileOutline from 'svelte-icons/fa/FaRegFile.svelte';
	import Trash from 'svelte-icons/io/IoMdTrash.svelte';
	import Pen from 'svelte-icons/fa/FaPen.svelte';

	// Components
	import ExplorerInput from './ExplorerInput.svelte';
	import File from './File.svelte';
	import Hoverable from '../common/Hoverable.svelte';

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
		compareFile,
		exists
	} from '../../utils/filesystem/filesystem';
	import type { Filesystem } from '../../utils/types';
	import { renameTabs, closeTabs, openTab, renameTab } from '../../utils/tabs/tabs';
	import Droppable from '../common/Droppable.svelte';
	import Draggable from '../common/Draggable.svelte';
	import Icon from '../common/Icon.svelte';

	/**
	 * The path to this folder.
	 */
	export let path = '';

	/**
	 * The children of this folder (more folders and files).
	 */
	export let children: Filesystem;

	/**
	 * The depth of this folder in the filesystem.
	 */
	export let depth = 0;

	/**
	 * Whether the renaming text area should be shown.
	 */
	let renaming = false;

	/**
	 * Whether the user is creating a new child object.
	 */
	let creating = false;

	/**
	 * Whether the user is creating a new child file.
	 */
	let creatingFile = false;

	/**
	 * Whether the children section is collapsed.
	 */
	let collapsed = false;

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
	 * Called when a draggable object is hovered over this folder.
	 * @param data The drag event data.
	 */
	function dropped(data: string) {
		// A file can't be moved into itself or into the parent directory as it's already in it.
		if (
			exists($filesystem, data) &&
			path !== data &&
			getParentDir(data) !== path &&
			getParentDir(path) !== data
		) {
			const oldName = tail(data);
			renameFile(data, path + '/' + oldName);
			renameTab(data, path + '/' + oldName);
		}
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

	/**
	 * The name of the folder.
	 */
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
				<FolderOutline />
			</Icon>
		</ExplorerInput>
	{:else}
		<Droppable let:dropping on:dropped={(e) => dropped(e.detail)} variant="explorer">
			<Draggable data={path} variant="explorer">
				<Hoverable let:hovering>
					<div
						class="flex transition flex-row items-center space-x-2 dark:text-dark-text h-8 {dropping &&
							'bg-blue-500 bg-opacity-50'}"
						style="padding-left: {(depth + 1.5) * 0.5}rem;"
					>
						<div on:click={toggleCollapse}>
							{#if collapsed}
								<Icon>
									<FolderOutline />
								</Icon>
							{:else}
								<Icon>
									<FolderOpen />
								</Icon>
							{/if}
						</div>
						<p class="truncate">{name}</p>
						<div
							class="flex flex-row flex-grow items-center justify-end pr-2 space-x-1 {!hovering &&
								'hidden'}"
						>
							<Icon on:click={() => setRenaming(true)} testId="rename-folder" button={true}>
								<Pen />
							</Icon>
							<Icon
								on:click={() => setCreating(true, true)}
								testId="create-child-file"
								button={true}
							>
								<FileIcon />
							</Icon>
							<Icon
								on:click={() => setCreating(true, false)}
								testId="create-child-folder"
								button={true}
							>
								<Folder />
							</Icon>
							<Icon on:click={handleDelete} testId="delete-folder" button={true}>
								<Trash />
							</Icon>
						</div>
					</div>
				</Hoverable>
			</Draggable>
		</Droppable>

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
	{/if}

	{#if creating}
		<ExplorerInput
			on:submit={(e) => handleCreate(e.detail)}
			on:cancelled={() => setCreating(false)}
			depth={depth + 1}
			reservedNames={getExistingFiles(children)}
		>
			{#if creatingFile}
				<Icon>
					<FileOutline />
				</Icon>
			{:else}
				<Icon>
					<Folder />
				</Icon>
			{/if}
		</ExplorerInput>
	{/if}
</div>
