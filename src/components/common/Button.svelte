<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from '../common/Icon.svelte';
	import CircularProgressIndicator from '../loaders/CircularProgressIndicator.svelte';
	const dispatch = createEventDispatcher();

	export let text = '';
	export let icon = false;
	export let loading = false;
	export let disabled = false;

	type Variant = 'default' | 'outline' | 'dark';
	export let variant: Variant = 'default';

	function onclick() {
		if (!disabled) {
			dispatch('click');
		}
	}

	function getStyle() {
		switch (variant) {
			case 'outline':
				return 'border-brand-primary border-2 text-brand-primary hover:text-brand-text hover:bg-brand-primary ';
			case 'dark':
				return 'bg-brand-accent';
			default:
				return 'bg-brand-primary';
		}
	}
</script>

<div
	class="px-5 py-1 transition-all {getStyle()} rounded hover:cursor-pointer w-min {disabled &&
		'opacity-50'}"
	on:click={() => onclick()}
>
	{#if loading}
		<CircularProgressIndicator />
	{:else}
		<div class="flex flex-row">
			{#if icon}
				<div class="mr-3">
					<Icon>
						<slot />
					</Icon>
				</div>
			{/if}
			<p>{text}</p>
		</div>
	{/if}
</div>
