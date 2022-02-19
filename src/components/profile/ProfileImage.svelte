<script lang="ts">
	import MdAccountCircle from 'svelte-icons/md/MdAccountCircle.svelte';
	import { onMount } from 'svelte';
	import { auth } from 'src/utils/firebase';
	let iconUrl: string;

	function handleImageError() {
		iconUrl = '';
	}

	onMount(() => {
		if (auth.currentUser?.photoURL) {
			iconUrl = auth.currentUser.photoURL;
		}
	});
</script>

{#if iconUrl}
	<div class="rounded-full border-2 border-brand-text flex items-center justify-center w-7 h-7">
		<img src={iconUrl} alt="profile" class="rounded-full" on:error={() => handleImageError()} />
	</div>
{:else}
	<div class="w-7 h-7 border rounded-full border-brand-text">
		<MdAccountCircle />
	</div>
{/if}
