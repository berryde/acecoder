<script lang="ts">
	import { openTab, rearrange, selectedTab, tabs, unsavedTabs } from '../../utils/tabs/tabs';
	import Hoverable from '../common/Hoverable.svelte';
	import Draggable from '../common/Draggable.svelte';
	import Droppable from '../common/Droppable.svelte';
	import { tail } from '../../utils/filesystem/filesystem';

	/**
	 * Called when a tab is dropped on this tab to rearrange the tabs.
	 * @param target The target tab filename.
	 * @param source The source tab filename.
	 */
	function handleDropped(target: string, source: string) {
		if (target != source) {
			// Rearrange the tabs such that this tab is to the right of the dropped tab.
			rearrange(target, source);
		}
	}
</script>

<div
	class="flex flex-row bg-brand-background w-full items-center overflow-x-auto overflow-y-hidden"
>
	{#each $tabs as path}
		<Draggable data={path} variant="tabs">
			<Droppable let:dropping on:dropped={(e) => handleDropped(path, e.detail)} variant="tabs">
				<Hoverable let:hovering>
					<div
						class="text-brand-text max-w-min transition-colors h-10 pl-4 pr-2 py-1 selected flex flex-row space-x-1 items-center {path ==
						$selectedTab
							? 'bg-brand-editor-background'
							: 'hover:bg-brand-accent'}  duration-75 cursor-default {dropping && 'bg-blue-500'}"
						on:click={() => openTab(path)}
					>
						<p>{$tabs.filter((tab) => tab == path).length == 1 ? tail(path) : path}</p>

						<div class="flex flex-row items-center justify-between w-4 ">
							{#if $unsavedTabs.includes(path)}
								<div
									class="transition-all bg-brand-text rounded-full ml-1.5 h-1.5 w-1.5"
									data-testid="unsaved-dot"
								/>
							{/if}
						</div>
					</div>
				</Hoverable>
			</Droppable>
		</Draggable>
	{/each}
</div>
