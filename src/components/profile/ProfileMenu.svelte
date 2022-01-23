<script lang="ts">
	import { signOut } from 'src/utils/auth/auth';
	import { onDestroy, onMount } from 'svelte';

	import ProfileImage from './ProfileImage.svelte';

	let visible = false;
	let element: HTMLDivElement;

	function toggleMenu(e: MouseEvent) {
		e.stopPropagation();
		visible = !visible;
	}

	onMount(() => {
		window.addEventListener('click', handleClickAway);
		element.addEventListener('click', toggleMenu);
	});

	function handleClickAway() {
		visible = false;
	}

	onDestroy(() => {
		window.removeEventListener('click', handleClickAway);
		element.removeEventListener('click', toggleMenu);
	});
</script>

<div bind:this={element} class="cursor-pointer">
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
