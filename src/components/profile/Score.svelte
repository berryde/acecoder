<script lang="ts">
	import { getStats } from 'src/utils/project/project';

	import { onMount } from 'svelte';

	export let amount = 0;
	export let useScore = true;

	onMount(async () => {
		if (useScore) {
			amount = (await getStats()).points;
		}
	});
</script>

<div class="flex flex-row items-center cursor-default">
	<div class="h-3 w-3 bg-yellow-500 rounded-full mr-1" />
	<p>{amount}</p>
</div>
