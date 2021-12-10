<script lang="ts">
	import type { User } from 'firebase/auth';
	import { auth } from 'src/utils/firebase';
	import { onMount } from 'svelte';
	import OrbitProgressIndicator from '../loaders/OrbitProgressIndicator.svelte';

	let user: User;

	onMount(() => {
		user = auth.currentUser;
		auth.onAuthStateChanged((_user) => {
			user = _user;
		});
	});
</script>

{#if !!user}
	<slot />
{:else}
	<div class="h-screen w-screen bg-dark-bgdark flex justify-center items-center">
		<OrbitProgressIndicator />
	</div>
{/if}
