<script>
	import ProfileMenu from '../profile/ProfileMenu.svelte';

	export let expanded = false;
</script>

<div class="bg-brand-accent w-full flex {expanded ? 'justify-between' : 'justify-center'} py-2 ">
	<div
		class="flex justify-between items-center w-full {expanded ? '' : 'lg:max-w-5xl px-20'} h-full"
	>
		<div class="flex space-x-5">
			<a href="/">Home</a>
		</div>
		<ProfileMenu />
	</div>
</div>
