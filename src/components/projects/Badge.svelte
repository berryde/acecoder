<script lang="ts">
	import type { Badge } from 'src/utils/types';
	import { getImage } from 'src/utils/firebase';
	import { onMount } from 'svelte';
	import Hoverable from '../common/Hoverable.svelte';

	/**
	 * The badge to display
	 */
	export let badge: Badge;

	/**
	 * Whether this badge has just been unlocked
	 */
	export let isNew: boolean = false;

	/**
	 * The URL of the badge image
	 */
	let url: string = '';

	/**
	 * Load the URL of the badge image from its URI
	 */
	async function getBadge() {
		url = await getImage(badge.image);
	}

	onMount(() => {
		getBadge();
	});

	let loaded = false;
</script>

<Hoverable let:hovering>
	<div class="flex-grow flex-shrink-0 relative">
		<div class="flex flex-col items-center justify-between p-3 rounded text-center">
			<div class="relative flex flex-col items-center space-y-2 w-full">
				{#if isNew}
					<div class="absolute z-30 right-0 bg-brand-success rounded py-0.5 px-1">
						<p class="text-xs uppercase">new</p>
					</div>
				{/if}

				<img
					src={url}
					class="w-16 h-16 rounded-full my-2 {!loaded &&
						'invisible'} pointer-events-none drop-shadow-2xl shadow-lg"
					alt="{badge.name} badge"
					on:load={() => {
						loaded = true;
					}}
				/>
			</div>
		</div>
		<div
			class="absolute bg-brand-accent origin-center left-1/2 transform -translate-x-1/2 {hovering
				? 'opacity-100'
				: 'opacity-0'} z-30 w-44 transition-opacity rounded p-2 transform text-xs duration-300 drop-shadow-2xl"
		>
			<p class="font-bold uppercase text-sm">{badge.name}</p>
			{badge.description}
		</div>
	</div>
</Hoverable>
