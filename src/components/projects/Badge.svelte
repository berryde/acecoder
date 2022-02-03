<script lang="ts">
	import type { Badge } from 'src/utils/types';
	import { getImage } from 'src/utils/firebase';
	import Score from '../profile/Score.svelte';
	import { onMount } from 'svelte';

	export let badge: Badge;
	export let showAmount = true;

	let url: string = '';
	onMount(async () => {
		url = await getImage(badge.image);
	});
</script>

<div
	class="w-52 flex-shrink-0 flex flex-col items-center justify-between p-3 bg-brand-accent rounded text-center"
>
	<div class="flex flex-col items-center space-y-2">
		<img src={url} class="w-16 h-16 rounded-full my-2" alt="{badge.name} badge" />
		<p class="font-bold uppercase text-sm">{badge.name}</p>
		<p class="text-xs">{badge.description}</p>
	</div>
	{#if showAmount}
		<div class="mt-3 bg-brand-background px-2 py-0.5 rounded">
			<Score amount={badge.reward} />
		</div>
	{/if}
</div>
