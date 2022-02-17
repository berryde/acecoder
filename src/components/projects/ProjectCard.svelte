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
	<div class="bg-brand-accent rounded">
		<img
			src={image}
			alt="Project thumbnail"
			class="rounded-t h-38 cursor-pointer bg-cover w-full"
			on:click={handleClick}
			tabindex={0}
			role="link"
			aria-label={`${project.name} project`}
		/>
		<p class="p-2 ">{project.overview}</p>
	</div>
{:else}
	<div class="bg-brand-accent h-42 rounded" />
{/if}
