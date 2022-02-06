<script lang="ts">
	import type { Badge } from 'src/utils/types';
	import { getImage } from 'src/utils/firebase';
	import Score from '../profile/Score.svelte';
	import { onMount } from 'svelte';
	import Hoverable from '../common/Hoverable.svelte';

	export let badge: Badge;
	export let showAmount = true;
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
			<div class="relative flex flex-col items-center space-y-2">
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
			{#if showAmount}
				<div class="mt-3 bg-brand-background px-2 py-0.5 rounded">
					<Score useScore={false} amount={badge.reward} />
				</div>
			{/if}
		</div>
		<div
			class="absolute bg-brand-editor-background {hovering
				? 'opacity-100'
				: 'opacity-0'} z-30 transition-opacity mt-2 rounded px-2 py-1 transform text-xs duration-300"
		>
			{badge.description}
		</div>
	</div>
</Hoverable>
