<script lang="ts">
	import { signOut } from 'src/utils/auth/auth';
	import { onDestroy, onMount } from 'svelte';
	import ProfileImage from './ProfileImage.svelte';
	import Score from './Score.svelte';
	import { points } from 'src/utils/exercise/exercise';

	let visible = false;
	let element: HTMLDivElement;

	function toggleMenu(e: MouseEvent) {
		e.stopPropagation();
		visible = !visible;
	}

	onMount(async () => {
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

<div class="flex items-center space-x-3">
	<Score amount={$points} />
	<div bind:this={element} class="cursor-pointer">
		<ProfileImage />
		<div class="absolute z-50 {!visible && 'hidden'} w-0">
			<div
				class="relative transition-all text-center {visible
					? 'visible opacity-100'
					: 'invisible opacity-0'} text-xs top-5 right-9 bg-brand-text text-brand-background shadow-xl rounded hover:bg-gray-300 min-w-max"
			>
				<div class="p-3 cursor-pointer" on:click={() => signOut()}>
					<p>Log out</p>
				</div>
			</div>
		</div>
	</div>
</div>
