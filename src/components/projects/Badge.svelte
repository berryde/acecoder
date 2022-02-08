<script lang="ts">
	import type { Badge } from 'src/utils/types';
	import { getImage } from 'src/utils/firebase';
	import { onMount } from 'svelte';
	import Hoverable from '../common/Hoverable.svelte';

	export let badge: Badge;
	export let isNew: boolean = false;

	let url: string = '';
	onMount(async () => {
		url = await getImage(badge.image);
	});

	let loaded = false;
</script>

<Hoverable let:hovering>
	<div class="flex-grow flex-shrink-0 relative">
		<div class="flex flex-col items-center justify-between p-3 bg-brand-accent rounded text-center">
			<div class="relative flex flex-col items-center space-y-2 w-full">
				{#if isNew}
					<div class="absolute z-30 right-0 bg-brand-success rounded py-0.5 px-1">
						<p class="text-xs uppercase">new</p>
					</div>
				{/if}

				<img
					src={url}
					class="w-16 h-16 rounded-full my-2 {!loaded && 'invisible'} pointer-events-none"
					alt="{badge.name} badge"
					on:load={() => {
						loaded = true;
					}}
				/>

				<p class="font-bold uppercase text-sm">{badge.name}</p>
			</div>
		</div>
		<div
			class="absolute bg-brand-accent min-w-max origin-center left-1/2 transform -translate-x-1/2 {hovering
				? 'opacity-100'
				: 'opacity-0'} z-30 transition-opacity mt-2 rounded px-2 py-1 transform text-xs duration-300 shadow-xl"
		>
			{badge.description}
		</div>
	</div>
</Hoverable>
