<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from '../common/Icon.svelte';
	const dispatch = createEventDispatcher();

	export let text = '';
	export let icon: boolean = false;

	export let classes = '';
</script>

<div
	class="flex flex-row transition-colors {classes} py-2 font-bold rounded justify-center items-center hover:cursor-pointer"
	on:click={() => dispatch('click')}
>
	{#if icon}
		<div class="mr-3">
			<Icon>
				<slot />
			</Icon>
		</div>
	{/if}
	<p>{text}</p>
</div>
