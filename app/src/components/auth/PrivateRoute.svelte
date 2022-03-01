<script lang="ts">
	import type { User } from 'firebase/auth';
	import { isAdmin } from 'src/utils/auth/auth';
	import { auth } from 'src/utils/firebase';
	import { createEventDispatcher, onMount } from 'svelte';

	import OrbitProgressIndicator from '../loaders/OrbitProgressIndicator.svelte';

	/**
	 * Whether this is an admin only route.
	 */
	export let restricted: boolean = false;
	export let loading: boolean = false;
	/**
	 * Whether the user has the admin claim.
	 */
	let admin: boolean;
	let user: User | null;

	const dispatch = createEventDispatcher();

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
			dispatch('authenticated');
		});
	});

	function throwError(code: number) {
		window.location.href = `/error/${code}`;
	}

	$: restricted && admin === false && throwError(403);
</script>

{#if !!user && !loading}
	<slot />
{:else}
	<div class="h-screen w-screen bg-brand-background flex justify-center items-center">
		<OrbitProgressIndicator />
	</div>
{/if}
