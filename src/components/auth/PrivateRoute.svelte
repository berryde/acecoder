<script>
	import { auth } from 'src/utils/auth/auth';
	import OrbitProgressIndicator from '../loaders/OrbitProgressIndicator.svelte';
</script>

{#if $auth}
	<slot />
{:else}
	<div class="h-screen w-screen bg-dark-bgdark flex justify-center items-center">
		<OrbitProgressIndicator />
	</div>
{/if}
