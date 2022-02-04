<script lang="ts">
	import { signOut } from 'src/utils/auth/auth';
	import ProfileImage from './ProfileImage.svelte';
	import Score from './Score.svelte';
	import Dropdown from '../common/Dropdown.svelte';

	export let showScore = true;

	function handleClick(e: MouseEvent) {
		e.stopPropagation();
		signOut();
	}
</script>

<div class="flex items-center space-x-3">
	{#if showScore}
		<Score />
	{/if}
	<Dropdown>
		<div slot="button">
			<ProfileImage />
		</div>
		<div slot="menu">
			<div class="p-3 cursor-pointer text-brand-background" on:click={handleClick}>
				<p>Log out</p>
			</div>
		</div>
	</Dropdown>
</div>
