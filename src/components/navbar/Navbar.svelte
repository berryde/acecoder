<script>
	import ProfileMenu from '../profile/ProfileMenu.svelte';
</script>

<div class="bg-brand-accent w-full">
	<div class="flex justify-between items-center w-full h-full py-2 px-5">
		<div class="flex space-x-5">
			<p class="cursor-pointer font-bold">FOLIO</p>
			<a href="/" class="transition-colors hover:text-brand-primary">Home</a>
		</div>
		<ProfileMenu />
	</div>
</div>
