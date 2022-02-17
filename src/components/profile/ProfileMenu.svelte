<script lang="ts">
	import { signOut } from 'src/utils/auth/auth';
	import ProfileImage from './ProfileImage.svelte';
	import Dropdown from '../common/Dropdown.svelte';

	function handleClick(e: MouseEvent) {
		e.stopPropagation();
		signOut();
	}
</script>

<Dropdown>
	<div slot="button" role="button" tabindex={0} aria-label="open profile menu">
		<ProfileImage />
	</div>
	<div slot="menu">
		<div
			class="p-3 cursor-pointer text-brand-background bg-white hover:bg-gray-100 transition-colors rounded-t"
		>
			<p>My profile</p>
		</div>
		<div
			class="p-3 cursor-pointer text-brand-background bg-white hover:bg-gray-100 transition-colors rounded-b"
			on:click={handleClick}
		>
			<p>Log out</p>
		</div>
	</div>
</Dropdown>
