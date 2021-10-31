<script lang="ts">
	// Icons
	import Trash from 'phosphor-svelte/lib/Trash';
	import Hoverable from './Hoverable.svelte';
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

	// Props
	export let path: string;
	export let value: string;
	export let depth: number = 0;

	// Variables
	let renaming = false;
	$: name = tail(path);

	function setRenaming(isRenaming: boolean) {
		renaming = isRenaming;
	}

	function handleDragStart(e: DragEvent) {
		e.dataTransfer.setData('text', path);
	}
	function handleDelete() {
		deleteFile(path);
	}

	function handleRename(newName: string) {
		const parent = getParentDir(path);
		renameFile(path, parent + '/' + newName);
		renaming = false;
	}

	/**
	 * When the file is clicked, the open editors in state should be updated.
	 */
	function handleClick() {}
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
				class="flex transition flex-row items-center space-x-2 text-bluegray-light h-8"
				style="padding-left: {(depth + 1) * 0.5}rem;"
				draggable="true"
				on:dragstart={handleDragStart}
			>
				<File />
				<p class="flex-grow">{name}</p>
				<div
					class="flex flex-row transition-opacity pr-2 space-x-1 {hovering
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
