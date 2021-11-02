<script lang="ts">
	import { tabs, openTab, selectedTab } from '../../utils/state/state';
</script>

<div class="flex flex-row text-bluegray-light bg-bluegray-dark h-8">
	{#each $tabs as path}
		<div
			class="px-3 py-1 selected {path == $selectedTab && 'bg-bluegray-default'}"
			on:click={() => openTab(path)}
		>
			<p>{path}</p>
		</div>
	{/each}
</div>
