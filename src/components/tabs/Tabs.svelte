<script lang="ts">
	import { openTab, closeTab, rearrange, unsavedTabs } from '../../utils/tabs/tabs';

	export let tabs: string[];
	export let selected: string;
	export let unsaved: string[];
	export let temporary: string;

	import IoMdClose from 'svelte-icons/io/IoMdClose.svelte';
	import Hoverable from '../common/Hoverable.svelte';

	import Draggable from '../common/Draggable.svelte';
	import { latestError } from '../../utils/console/console';
	import Droppable from '../common/Droppable.svelte';
	import { tail } from '../../utils/filesystem/filesystem';
	import Modal from '../common/Modal.svelte';
	import Button from '../common/Button.svelte';
	import { save } from 'src/utils/codemirror/codemirror';

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

	let closing: string;
	function handleClose(path: string) {
		if ($unsavedTabs.includes(path)) {
			closing = path;
		} else {
			close(path);
		}
	}

	function close(path) {
		closing = undefined;
		closeTab(path);
	}

	function saveThenClose(path: string) {
		save();
		close(path);
	}
</script>

{#if closing}
	<Modal title="Unsaved changes" on:close={() => (closing = undefined)}>
		<p>Are you sure you want to close {closing}? Your unsaved changes will be lost.</p>
		<div class="flex flex-row space-x-2">
			<Button
				text="Don't save"
				classes="bg-brand-background bg-light-bglight py-1 px-3"
				on:click={() => close(closing)}
			/>
			<Button
				text="Cancel"
				classes="bg-brand-background bg-light-bglight py-1 px-3"
				on:click={() => (closing = undefined)}
			/>
			<Button
				text="Save"
				classes="bg-brand-background bg-light-bglight py-1 px-3"
				on:click={() => saveThenClose(closing)}
			/>
		</div>
	</Modal>
{/if}
<div class="flex flex-row bg-gray-200 bg-brand-background justify-between w-full items-center">
	{#each tabs as path}
		<Draggable data={path} variant="tabs">
			<Droppable let:dropping on:dropped={(e) => handleDropped(path, e.detail)} variant="tabs">
				<Hoverable let:hovering>
					<div
						class="{$latestError && $latestError.location == path
							? 'text-red-400'
							: ' text-brand-text'} transition-colors pl-4 pr-2 py-1 selected flex flex-row space-x-1 justify-between items-center {path ==
							selected &&
							'bg-gray-100 bg-brand-accent'} hover:bg-gray-300 hover:bg-gray-800 {dropping &&
							'bg-blue-500'} {path == temporary && 'italic'}"
						on:click={() => openTab(path)}
					>
						<p>{tabs.filter((tab) => tab == path).length == 1 ? tail(path) : path}</p>

						<div class="flex flex-row items-center justify-between w-4 text-brand-text">
							{#if !hovering && unsaved.includes(path)}
								<div
									class="transition-all bg-light-text bg-dark-text rounded-full ml-1.5 h-1.5 w-1.5"
									data-testid="unsaved-dot"
								/>
							{:else}
								<div
									on:click={() => handleClose(path)}
									class="flex flex-col justify-center h-4 w-4 rounded bg-gray-100 bg-gray-700 transition-opacity {hovering
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
