<script lang="ts">
	import type { User } from 'firebase/auth';
	import { isAdmin } from 'src/utils/auth/auth';
	import { auth } from 'src/utils/firebase';
	import { onMount } from 'svelte';
	import OrbitProgressIndicator from '../loaders/OrbitProgressIndicator.svelte';
	import GenericError from './GenericError.svelte';

	/**
	 * Whether this is an admin only route.
	 */
	export let restricted = false;
	export let loading = false;
	/**
	 * Whether the user has the admin claim.
	 */
	let admin;
	let user: User;

	onMount(() => {
		user = auth.currentUser;
		auth.onAuthStateChanged(async (_user) => {
			user = _user;
			// Log the user out as they have signed out.
			if (!user) {
				window.location.href = '/login';
			} else {
				if (restricted) {
					admin = await isAdmin();
				}
			}
		});
	});
</script>

{#if restricted && admin == false && !loading}
	<GenericError status={403} />
{:else if !!user && !loading}
	<slot />
{:else}
	<div class="h-screen w-screen bg-brand-background flex justify-center items-center">
		<OrbitProgressIndicator />
	</div>
{/if}
