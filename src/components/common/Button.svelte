<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from '../common/Icon.svelte';
	import CircularProgressIndicator from '../loaders/CircularProgressIndicator.svelte';
	const dispatch = createEventDispatcher();

	export let text = '';
	export let icon = false;
	export let loading = false;
	export let disabled = false;
	export let expanded = false;
	export let outline = false;

	type Variant = 'default' | 'danger' | 'dark';
	export let variant: Variant = 'default';

	function onclick() {
		if (!disabled) {
			dispatch('click');
		}
	}

	function getStyle() {
		switch (variant) {
			case 'dark':
				return outline
					? 'border-brand-accent text-brand-accent hover:bg-brand-accent'
					: 'bg-brand-accent';
			case 'danger':
				return outline
					? 'border-brand-danger-light text-brand-danger-light hover:bg-brand-danger-light'
					: 'bg-brand-danger-light';
			default:
				return outline
					? 'border-brand-primary text-brand-primary hover:bg-brand-primary'
					: 'bg-brand-primary';
		}
	}
</script>

<div
	class="px-5 py-2 transition-all {getStyle()} {expanded
		? 'w-full'
		: 'w-max'} rounded hover:cursor-pointer {disabled && 'opacity-50'} {outline &&
		'border-2 hover:text-brand-text'} flex justify-center"
	on:click={() => onclick()}
>
	{#if loading}
		<CircularProgressIndicator />
	{:else}
		<div class="flex flex-row items-center">
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
