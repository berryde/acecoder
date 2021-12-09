<script lang="ts">
	import MdAccountCircle from 'svelte-icons/md/MdAccountCircle.svelte';
	import { onMount } from 'svelte';
	import { auth } from 'src/utils/firebase';
	let iconUrl: string;

	function handleImageError() {
		iconUrl = undefined;
	}

	onMount(() => {
		if (auth.currentUser.photoURL) {
			iconUrl = auth.currentUser.photoURL;
		}
	});
</script>

<div class="rounded-full border-2 dark:border-dark-text border-light-text">
	{#if iconUrl}
		<img src={iconUrl} alt="profile" class="rounded-full" on:error={() => handleImageError()} />
	{:else}
		<MdAccountCircle />
	{/if}
</div>
