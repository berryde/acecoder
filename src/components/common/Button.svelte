<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from '../common/Icon.svelte';
	import CircularProgressIndicator from '../loaders/CircularProgressIndicator.svelte';
	const dispatch = createEventDispatcher();

	export let text: string = '';
	export let icon: boolean = false;
	export let loading: boolean = false;
	export let disabled: boolean = false;
	export let expanded: boolean = false;
	export let outline: boolean = false;
	export let link: boolean = false;

	type Variant = 'default' | 'danger' | 'dark' | 'accent' | 'success';
	export let variant: Variant = 'default';

	function onclick() {
		if (!disabled && !loading) {
			dispatch('click');
			if (link) loading = true;
		}
	}

	function getStyle() {
		switch (variant) {
			case 'dark':
				return outline
					? 'border-brand-background text-brand-background hover:bg-brand-background'
					: 'bg-brand-background';
			case 'accent':
				return outline
					? 'border-brand-accent text-brand-accent hover:bg-brand-accent'
					: 'bg-brand-accent';
			case 'danger':
				return outline
					? 'border-brand-danger-light text-brand-danger-light hover:bg-brand-danger-light'
					: 'bg-brand-danger-light';
			case 'success':
				return outline
					? 'border-brand-success text-brand-success hover:bg-brand-success'
					: 'bg-brand-success';
			default:
				return outline
					? 'border-brand-primary text-brand-primary-light hover:bg-brand-primary'
					: 'bg-brand-primary';
		}
	}
</script>

<div
	class="h-9 px-3 transition-all {getStyle()} {expanded
		? 'w-full'
		: 'w-max'} rounded hover:cursor-pointer {disabled && 'opacity-50'} {outline &&
		'border-2 hover:text-brand-text'} flex justify-center"
	role="button"
	tabindex={0}
	on:click={() => onclick()}
>
	{#if loading}
		<div class="flex items-center justify-center">
			<CircularProgressIndicator />
		</div>
	{:else}
		<div class="flex flex-row items-center justify-center">
			{#if icon}
				<div class="mr-3">
					<Icon size="large">
						<slot />
					</Icon>
				</div>
			{/if}
			<p class="select-none">{text}</p>
		</div>
	{/if}
</div>
