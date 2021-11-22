<script lang="ts">
	import type { SidebarTab } from 'src/utils/types';

	import { createEventDispatcher } from 'svelte';
	import Icon from '../common/Icon.svelte';

	const dispatch = createEventDispatcher();

	/**
	 * The selected sidebar item's index.
	 */
	export let selected: number;

	/**
	 * Whether the sidebar is collapsed.
	 */
	export let collapsed: boolean;

	/**
	 * Called when the user selects a sidebar item.
	 * @param index the index of the selected item.
	 */
	function select(index: number) {
		if (!collapsed && selected == index) {
			dispatch('collapse');
		} else {
			selected = index;
			dispatch('select', selected);
		}
	}

	export let tabs: SidebarTab[];
</script>

<div class="h-screen flex flex-row bg-light-bglight dark:bg-dark-bglight">
	<div class="flex flex-col">
		{#each tabs as tab, index}
			<div
				class="p-4 {!collapsed && selected == index
					? 'border-l-2 dark:border-dark-text border-light-text'
					: 'sidebar-item'}"
				on:click={() => select(index)}
				data-testid={tab.name}
			>
				<Icon size="large" button={true}>
					<svelte:component this={tab.icon} />
				</Icon>
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
	.sidebar-item {
		@apply ml-0.5 opacity-50 hover:opacity-100 transition-opacity;
	}
</style>
