<script lang="ts">
	import Icon from '../common/Icon.svelte';

	export let placeholder = '';
	export let icon = false;
	export let type = 'text';
	export let value: string | number = '';
	export let name = '';
	export let expanded = false;
	type Variant = 'default' | 'dark';
	export let variant: Variant = 'default';

	function onInput(e: Event) {
		const element = e.target as HTMLInputElement;
		value = element.value;
	}

	function getStyle() {
		if (variant == 'dark') return 'bg-brand-background';
		return 'bg-brand-accent';
	}
</script>

<div class="flex flex-row {getStyle()} rounded {!expanded && 'w-max'} items-center">
	{#if icon}
		<div class="mx-3 h-full flex items-center">
			<Icon size="large">
				<slot />
			</Icon>
		</div>
	{/if}
	<input
		{placeholder}
		class="bg-transparent p-2 flex-grow appearance-none rounded w-full"
		{type}
		{value}
		{name}
		on:input={onInput}
	/>
</div>
