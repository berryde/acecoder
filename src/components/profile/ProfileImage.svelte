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

<div
	class="rounded-full border-2 border-dark-text border-brand-text flex items-center justify-center w-8 h-8"
>
	{#if iconUrl}
		<img src={iconUrl} alt="profile" class="rounded-full" on:error={() => handleImageError()} />
	{:else}
		<div class="w-full h-full">
			<MdAccountCircle />
		</div>
	{/if}
</div>
