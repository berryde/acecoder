<script lang="ts">
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';
	import BadgeSettings from 'src/components/admin/badge/BadgeSettings.svelte';
	import { onMount } from 'svelte';
	import type { Badge } from 'src/utils/types';
	import { getBadge } from 'src/utils/project/project';
	import { page } from '$app/stores';

	let loading = true;
	let badge: Badge;
	onMount(async () => {
		badge = await getBadge($page.params.badgeID);
		loading = false;
	});
</script>

<PrivateRoute restricted={true} {loading}>
	<div
		class="w-screen h-screen bg-brand-background flex flex-col justify-center items-center text-brand-text"
	>
		<div class="flex-grow lg:max-w-6xl w-full h-full px-20 py-10">
			<BadgeSettings creating={false} {badge} />
		</div>
	</div>
</PrivateRoute>
