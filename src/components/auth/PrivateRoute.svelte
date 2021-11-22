<script>
	import { auth } from '../../utils/auth/auth';
	import Loading from './Loading.svelte';
</script>

{#if $auth}
	<slot />
{:else}
	<div class="h-screen w-screen bg-dark-bgdark flex justify-center items-center">
		<Loading />
	</div>
{/if}
