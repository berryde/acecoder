<script>
	import { user } from '../../utils/auth/auth';
	import Forbidden from './Forbidden.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		$: if (!$user) {
			goto('login');
		}
	});
</script>

{#if $user}
	<slot />
{:else}
	<Forbidden />
{/if}
