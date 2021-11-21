<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from '../common/Icon.svelte';
	const dispatch = createEventDispatcher();

	export let text = '';
	export let icon: boolean = false;
	export let color: 'primary' | 'dark' | 'light' = 'primary';

	function getStyles() {
		switch (color) {
			case 'light':
				return 'hover:bg-opacity-50 bg-light-bglight';
			case 'dark':
				return 'hover:bg-opacity-50 bg-dark-bglight';
			default:
				return 'hover:bg-blue-800 bg-blue-600';
		}
	}
</script>

<div
	class="flex flex-row transition-colors {getStyles()} py-2 font-bold rounded justify-center items-center hover:cursor-pointer"
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
