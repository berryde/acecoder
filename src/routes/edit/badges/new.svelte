<script lang="ts">
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';
	import BadgeSettings from 'src/components/admin/badge/BadgeSettings.svelte';
</script>

<PrivateRoute restricted={true}>
	<div
		class="w-screen h-screen bg-brand-background flex flex-col justify-center items-center text-brand-text"
	>
		<div class="flex-grow max-w-6xl w-full h-full p-28 space-y-5">
			<BadgeSettings creating={true} />
		</div>
	</div>
</PrivateRoute>
