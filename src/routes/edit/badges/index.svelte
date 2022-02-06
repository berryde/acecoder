<script lang="ts">
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';
	import Button from 'src/components/common/Button.svelte';
	import ProfileMenu from 'src/components/profile/ProfileMenu.svelte';
	import Badge from 'src/components/projects/Badge.svelte';
	import { getAllBadges } from 'src/utils/admin/admin';
	import type { Badge as BadgeType } from 'src/utils/types';
	import { onMount } from 'svelte';
	let loading = true;

	let badges: Record<string, BadgeType> = {};
	onMount(async () => {
		loading = true;
		badges = await getAllBadges();
		loading = false;
	});

	function handleClick(id: string) {
		window.location.href = `/edit/badges/${id}`;
	}
</script>

<svelte:head>
	<title>Badge Editor</title>
</svelte:head>

<PrivateRoute restricted={true} {loading}>
	<div
		class="w-screen h-screen bg-brand-background flex flex-col justify-center items-center text-brand-text"
	>
		<div class="flex-grow max-w-6xl w-full h-full p-28 space-y-5">
			<div class="flex flex-row items-center justify-between">
				<p class="text-3xl font-bold">Badge editor</p>
				<ProfileMenu showScore={false} />
			</div>
			<div class="flex flex-row items-center justify-between bg-brand-accent p-5 rounded">
				<div>
					<p class="font-bold">Create a new badge</p>
					<p>Add a new badge that players can unlock.</p>
				</div>
				<Button
					text="New badge"
					on:click={() => {
						window.location.href = '/edit/badges/new';
					}}
				/>
			</div>
			<div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{#each Object.keys(badges) as id}
					<div class="cursor-pointer flex-grow" on:click={() => handleClick(id)}>
						<Badge badge={badges[id]} />
					</div>
				{/each}
			</div>
		</div>
	</div>
</PrivateRoute>
