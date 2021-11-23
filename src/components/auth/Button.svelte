<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from '../common/Icon.svelte';
	import CircularProgressIndicator from '../loaders/CircularProgressIndicator.svelte';
	const dispatch = createEventDispatcher();

	export let text = '';
	export let icon = false;
	export let loading = false;
	export let classes = '';
	export let disabled = false;

	function onclick() {
		if (!disabled) {
			dispatch('click');
		}
	}
</script>

<div
	class="flex flex-row transition-colors py-2 font-bold rounded justify-center items-center hover:cursor-pointer {classes}"
	on:click={() => onclick()}
>
	{#if icon}
		<div class="mr-3">
			<Icon>
				<slot />
			</Icon>
		</div>
	{/if}
	{#if loading}
		<CircularProgressIndicator />
	{:else}
		<p>{text}</p>
	{/if}
</div>
