<script lang="ts">
	import { openTab, selectedTab, tabs, unsavedTabs } from '../../utils/tabs/tabs';
	import { tail } from '../../utils/filesystem/filesystem';
</script>

<div
	class="flex flex-row bg-brand-background w-full items-center overflow-x-auto overflow-y-hidden"
>
	{#each $tabs as path}
		<div
			class="text-brand-text max-w-min transition-colors h-10 pl-4 pr-2 py-1 select-none flex flex-row space-x-1 items-center {path ==
			$selectedTab
				? 'bg-brand-editor-background'
				: 'hover:bg-brand-accent'}  duration-75 cursor-default"
			on:click={() => openTab(path)}
			role="button"
			aria-label="select tab"
			tabindex={0}
		>
			<p>
				{$tabs.filter((tab) => tab == path).length == 1 ? tail(path) : path}
			</p>

			<div class="flex flex-row items-center justify-between w-4 ">
				{#if $unsavedTabs.includes(path)}
					<div
						class="transition-all bg-brand-text rounded-full ml-1.5 h-1.5 w-1.5"
						data-testid="unsaved-dot"
					/>
				{/if}
			</div>
		</div>
	{/each}
</div>
