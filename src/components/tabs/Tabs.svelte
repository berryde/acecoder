<script lang="ts">
	import { openTab, closeTab, rearrange } from '../../utils/tabs/tabs';

	export let tabs: string[];
	export let selected: string;
	export let unsaved: string[];

	import IoMdClose from 'svelte-icons/io/IoMdClose.svelte';
	import Hoverable from '../common/Hoverable.svelte';
	import Draggable from '../common/Draggable.svelte';
	import { latestError } from '../../utils/console/console';
	import Droppable from '../common/Droppable.svelte';
	import { tail } from '../../utils/filesystem/filesystem';

	function handleDropped(target: string, source: string) {
		if (target != source) {
			// Rearrange the tabs such that this tab is to the right of the dropped tab.
			rearrange(target, source);
		}
	}
</script>

<div class="flex flex-row bg-gray-200 dark:bg-dark-bgdark  overflow-x-auto">
	{#each tabs as path}
		<Draggable data={path} variant="tabs">
			<Droppable let:dropping on:dropped={(e) => handleDropped(path, e.detail)} variant="tabs">
				<Hoverable let:hovering>
					<div
						class="{$latestError && $latestError.location == path
							? 'text-red-400'
							: ' dark:text-dark-text'} transition-colors pl-4 pr-2 py-1 selected flex flex-row space-x-1 justify-between items-center {path ==
							selected &&
							'bg-gray-100 dark:bg-dark-bglight'} hover:bg-gray-300 dark:hover:bg-gray-800 {dropping &&
							'bg-blue-500'}"
						on:click={() => openTab(path)}
					>
						<p>{tabs.filter((tab) => tab == path).length == 1 ? tail(path) : path}</p>

						<div class="flex flex-row items-center justify-between w-4 dark:text-dark-text">
							{#if !hovering && unsaved.includes(path)}
								<div
									class="transition-all bg-light-text dark:bg-dark-text rounded-full ml-1.5 h-1.5 w-1.5"
									data-testid="unsaved-dot"
								/>
							{:else}
								<div
									on:click={() => closeTab(path)}
									class="flex flex-col justify-center h-4 w-4 rounded bg-gray-100 dark:bg-gray-700 transition-opacity {hovering
										? 'opacity-100'
										: 'opacity-0'}"
								>
									<button>
										<IoMdClose />
									</button>
								</div>
							{/if}
						</div>
					</div>
				</Hoverable>
			</Droppable>
		</Draggable>
	{/each}
</div>
