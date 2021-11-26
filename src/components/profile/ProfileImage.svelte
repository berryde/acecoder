<script lang="ts">
	import { auth } from '../../utils/auth/auth';
	import MdAccountCircle from 'svelte-icons/md/MdAccountCircle.svelte';
	let iconUrl: string;
	auth.subscribe((user) => {
		if (user) iconUrl = user.photoURL;
	});

	function handleImageError() {
		iconUrl = undefined;
	}
</script>

<div class="rounded-full border-2 dark:border-dark-text border-light-text">
	{#if iconUrl}
		<img src={iconUrl} alt="profile" class="rounded-full" on:error={() => handleImageError()} />
	{:else}
		<MdAccountCircle />
	{/if}
</div>
