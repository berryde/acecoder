<script lang="ts">
	import { getImage } from 'src/utils/firebase';
	import type { Project } from 'src/utils/types';
	import { onMount } from 'svelte';
	export let project: Project;
	export let projectID: string;
	export let url = '/project/' + projectID;

	function handleClick() {
		window.location.href = url;
	}

	let image: string;

	onMount(async () => {
		image = await getImage(project.thumbnail);
	});
</script>

{#if image}
	<img
		src={image}
		alt="Project thumbnail"
		class="rounded cursor-pointer h-38 bg-cover"
		on:click={handleClick}
		tabindex={0}
		role="link"
		aria-label={`${project.name} project`}
	/>
{:else}
	<div class="bg-brand-accent h-38 rounded" />
{/if}
