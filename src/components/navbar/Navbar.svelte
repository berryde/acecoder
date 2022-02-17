<script lang="ts">
	import ProfileMenu from '../profile/ProfileMenu.svelte';
	import Logo from './Logo.svelte';
	export let showProfile: boolean = true;
	export let expanded: boolean = false;
</script>

<div class="bg-brand-accent w-full flex justify-center py-1">
	<div
		class="flex justify-between items-center w-full h-full py-2 {expanded
			? 'px-5'
			: 'px-20 lg:max-w-6xl'}"
	>
		<div class="flex space-x-5 items-center">
			<Logo variant="light" />
		</div>
		{#if showProfile}
			<ProfileMenu />
		{/if}
	</div>
</div>
