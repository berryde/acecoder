<script lang="ts">
	import { openTab, closeTab, rearrange } from '../../utils/tabs/tabs';

	export let tabs: string[];
	export let selected: string;
	export let unsaved: string[];

	import IoMdClose from 'svelte-icons/io/IoMdClose.svelte';
	import Hoverable from '../common/Hoverable.svelte';
	import Draggable from '../common/Draggable.svelte';
	import Droppable from '../common/Droppable.svelte';

	function handleDropped(target: string, source: string) {
		if (target != source) {
			// Rearrange the tabs such that this tab is to the right of the dropped tab.
			rearrange(target, source);
		}
	}
</script>

<div class="flex flex-row text-bluegray-light bg-bluegray-dark h-8">
	{#each tabs as path}
		<Draggable data={path} variant="tabs">
			<Droppable let:dropping on:dropped={(e) => handleDropped(path, e.detail)} variant="tabs">
				<div
					class="transition-colors pl-4 pr-2 py-1 selected flex flex-row space-x-1 justify-between items-center {path ==
						selected && 'bg-bluegray-default'} hover:bg-gray-800 {dropping && 'bg-blue-500'}"
					on:click={() => openTab(path)}
				>
					<p>{path}</p>
					<Hoverable let:hovering>
						<div class="flex flex-row items-center justify-between w-5 p-1 h-5">
							{#if hovering}
								<div
									on:click={() => closeTab(path)}
									class="flex flex-col justify-center p-0.5 rounded bg-gray-700"
								>
									<IoMdClose />
								</div>
							{:else}
								<div
									class="transition-all bg-bluegray-light rounded-full ml-1 h-1.5 w-1.5 {!unsaved.includes(
										path
									) && 'invisible'}"
								/>
							{/if}
						</div>
					</Hoverable>
				</div>
			</Droppable>
		</Draggable>
	{/each}
</div>
