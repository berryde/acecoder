<script lang="ts">
	import Icon from '../common/Icon.svelte';

	export let placeholder = '';
	export let icon = false;
	export let type = 'text';
	export let classes = '';
	export let value: string | number = '';

	let focused = false;

	function oninput(e: Event) {
		const element = e.target as HTMLInputElement;
		value = element.value;
	}
</script>

<div
	class="flex flex-row bg-dark-bglight border items-center rounded {focused
		? 'border-blue-500'
		: 'border-dark-bglight'} {classes}"
>
	{#if icon}
		<div class="mx-3">
			<Icon>
				<slot />
			</Icon>
		</div>
	{/if}
	<input
		{placeholder}
		class="bg-dark-bglight p-2 flex-grow focus:outline-none appearance-none rounded"
		{type}
		{value}
		on:focus={() => (focused = true)}
		on:focusout={() => (focused = false)}
		on:input={oninput}
	/>
</div>
