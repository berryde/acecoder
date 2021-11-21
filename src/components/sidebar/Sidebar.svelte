<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import IoIosFiling from 'svelte-icons/io/IoIosFiling.svelte';
	import IoIosSettings from 'svelte-icons/io/IoIosSettings.svelte';
	import IoMdText from 'svelte-icons/io/IoMdText.svelte';
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
</script>

<div class="h-screen flex flex-row bg-light-bglight dark:bg-dark-bglight">
	<div class="flex flex-col">
		<div
			class="p-4 {!collapsed && selected == 0
				? 'border-l-2 dark:border-dark-text border-light-text'
				: 'sidebar-item'}"
			on:click={() => select(0)}
			data-testid="explorer"
		>
			<Icon size="large" button={true}>
				<IoIosFiling />
			</Icon>
		</div>
		<div
			class="p-4 {!collapsed && selected == 1
				? 'border-l-2 dark:border-dark-text border-light-text'
				: 'sidebar-item'}"
			on:click={() => select(1)}
			data-testid="feedback"
		>
			<Icon size="large" button={true}>
				<IoMdText />
			</Icon>
		</div>
		<div
			class="p-4 {!collapsed && selected == 2
				? 'border-l-2 dark:border-dark-text border-light-text'
				: 'sidebar-item'}"
			on:click={() => select(2)}
			data-testid="settings"
		>
			<Icon size="large" button={true}>
				<IoIosSettings />
			</Icon>
		</div>
	</div>
</div>

<style lang="postcss">
	.sidebar-item {
		@apply ml-0.5 opacity-50 hover:opacity-100 transition-opacity;
	}
</style>
