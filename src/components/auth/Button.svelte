<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from '../common/Icon.svelte';
	import CircularProgressIndicator from './CircularProgressIndicator.svelte';
	const dispatch = createEventDispatcher();

	export let text = '';
	export let icon: boolean = false;
	export let loading: boolean = false;
	export let classes = '';
</script>

<div
	class="flex flex-row transition-colors py-2 font-bold rounded justify-center items-center hover:cursor-pointer {classes}"
	on:click={() => dispatch('click')}
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
