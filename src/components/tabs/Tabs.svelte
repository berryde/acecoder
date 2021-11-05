<script lang="ts">
	import { tabs, openTab, selectedTab, unsavedTabs } from '../../utils/tabs/tabs';
</script>

<div class="flex flex-row text-bluegray-light bg-bluegray-dark h-8">
	{#each $tabs as path}
		<div
			class="px-3 py-1 selected flex flex-row items-center space-x-3 {path == $selectedTab &&
				'bg-bluegray-default'}"
			on:click={() => openTab(path)}
		>
			<p>{path}</p>
			<div
				class="bg-bluegray-light rounded-full h-2 w-2 {!$unsavedTabs.includes(path) && 'invisible'}"
			/>
		</div>
	{/each}
</div>
