<script lang="ts">
	import { filesystem } from '../../utils/filesystem/filesystem';

	import IoIosFiling from 'svelte-icons/io/IoIosFiling.svelte';
	import IoIosSettings from 'svelte-icons/io/IoIosSettings.svelte';
	import Icon from '../common/Icon.svelte';
	import Explorer from '../explorer/Explorer.svelte';
	import Settings from '../settings/Settings.svelte';

	let selected = 0;

	function select(index: number) {
		selected = index;
	}
</script>

<div class="h-screen flex flex-row bg-gray-100 dark:bg-bluegray-600">
	<div class="flex flex-col">
		<div
			class="dark:text-bluegray-300 p-4 {selected == 0
				? 'border-l-2 border-aqua-default'
				: 'ml-0.5'}"
			on:click={() => select(0)}
			data-testid="explorer"
		>
			<Icon size="large" button={true}>
				<IoIosFiling />
			</Icon>
		</div>
		<div
			class="dark:text-bluegray-300 p-4 {selected == 1
				? 'border-l-2 border-aqua-default'
				: 'ml-0.5'}"
			on:click={() => select(1)}
			data-testid="settings"
		>
			<Icon size="large" button={true}>
				<IoIosSettings />
			</Icon>
		</div>
	</div>
	<div class="flex-grow  overflow-x-auto overflow-y-hidden">
		{#if selected == 0}
			<Explorer files={$filesystem} />
		{:else if selected == 1}
			<Settings />
		{/if}
	</div>
</div>
