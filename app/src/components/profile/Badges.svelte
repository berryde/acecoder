<script lang="ts">
	import type { Badge as BadgeType } from '~shared/types';
	import Badge from '../projects/Badge.svelte';
	export let badges: BadgeType[];
</script>

<div class="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
	{#each badges as badge}
		<Badge {badge} />
	{/each}
</div>
