<script lang="ts">
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';
	import Button from 'src/components/common/Button.svelte';
	import Page from 'src/components/common/Page.svelte';
	import Badge from 'src/components/projects/Badge.svelte';
	import { getAllBadges } from 'src/utils/admin/admin';
	import type { Badge as BadgeType } from '~shared/types';
	import { onMount } from 'svelte';
	let loading = true;

	/**
	 * The badges on the system
	 */
	let badges: Record<string, BadgeType> = {};

	onMount(async () => {
		loading = true;
		badges = await getAllBadges();
		loading = false;
	});
</script>

<svelte:head>
	<title>Badge Editor - Acecoder</title>
</svelte:head>

<PrivateRoute restricted={true} {loading}>
	<Page>
		<p class="text-3xl font-bold">Badge editor</p>
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
				<a href={`/edit/badges/${id}`}>
					<div class="cursor-pointer flex-grow">
						<Badge badge={badges[id]} />
					</div></a
				>
			{/each}
		</div>
	</Page>
</PrivateRoute>
