<script lang="ts">
	import { tabs, openTab, selectedTab, unsavedTabs, closeTab } from '../../utils/tabs/tabs';
	import X from 'phosphor-svelte/lib/X';
	import Hoverable from '../explorer/Hoverable.svelte';
</script>

<div class="flex flex-row text-bluegray-light bg-bluegray-dark h-8">
	{#each $tabs as path}
		<div
			class="pl-4 pr-2 py-1 selected flex flex-row space-x-1 justify-between items-center {path ==
				$selectedTab && 'bg-bluegray-default'} hover:bg-gray-800"
			on:click={() => openTab(path)}
		>
			<p>{path}</p>
			<Hoverable let:hovering>
				<div class="flex justify-center w-5 p-1">
					{#if hovering}
						<div
							on:click={() => closeTab(path)}
							class="flex justify-center w-5 p-1 rounded hover:bg-gray-700"
						>
							<X size={12} />
						</div>
					{:else}
						<div
							class="bg-bluegray-light rounded-full h-1.5 w-1.5 {!$unsavedTabs.includes(path) &&
								'invisible'}"
						/>
					{/if}
				</div>
			</Hoverable>
		</div>
	{/each}
</div>
