<script lang="ts">
	import { signOut } from 'src/utils/auth/auth';

	import ProfileImage from './ProfileImage.svelte';

	let visible = false;
	function toggleMenu() {
		visible = !visible;
	}
</script>

<div on:click={toggleMenu} class="cursor-pointer">
	<ProfileImage />
	<div class="absolute z-50">
		<div
			class="relative transition-all text-center {visible
				? 'visible opacity-100'
				: 'invisible opacity-0'} top-5 right-9 text-xs bg-brand-text text-brand-background shadow-xlP rounded "
		>
			<div class="p-3 cursor-pointer" on:click={() => signOut()}>
				<p>Log out</p>
			</div>
		</div>
	</div>
</div>
