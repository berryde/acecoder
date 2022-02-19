<script lang="ts">
	import { getImage as _getImage } from 'src/utils/firebase';
	import type { Project } from 'src/utils/types';
	import { onMount } from 'svelte';
	export let project: Project;
	export let projectID: string;
	export let url = '/project/' + projectID;

	function handleClick() {
		window.location.href = url;
	}

	let image: string;

	async function getImage() {
		image = await _getImage(project.thumbnail);
	}

	onMount(() => {
		getImage();
	});
</script>

{#if image}
	<div class="bg-brand-accent rounded cursor-pointer " on:click={handleClick}>
		<img
			src={image}
			alt="Project thumbnail"
			class="rounded-t h-38 bg-cover w-full"
			tabindex={0}
			role="link"
			aria-label={`${project.name} project`}
		/>
		<p class="p-3">{project.overview}</p>
	</div>
{:else}
	<div class="bg-brand-accent h-42 rounded" />
{/if}
