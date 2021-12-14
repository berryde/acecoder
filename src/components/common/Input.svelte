<script lang="ts">
	import Icon from '../common/Icon.svelte';

	export let placeholder = '';
	export let icon = false;
	export let type = 'text';
	export let classes = '';
	export let value: string | number = '';

	function oninput(e: Event) {
		const element = e.target as HTMLInputElement;
		value = element.value;
	}
</script>

<div class="flex flex-row {classes} rounded">
	{#if icon}
		<div class="mx-3 h-full flex items-center">
			<Icon size="large">
				<slot />
			</Icon>
		</div>
	{/if}
	<input
		{placeholder}
		class="bg-transparent p-2 flex-grow focus:outline-none appearance-none rounded w-full"
		{type}
		{value}
		on:input={oninput}
	/>
</div>
