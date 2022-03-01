<script lang="ts">
	import { getImage as _getImage } from 'src/utils/firebase';
	import type { Project } from '~shared/types';
	import { onMount } from 'svelte';

	/**
	 * The current project
	 */
	export let project: Project;

	/**
	 * The URL of the project
	 */
	export let url: string;

	/**
	 * The URL of the image
	 */
	let image: string;

	/**
	 * Fetch the image URL from it's URI
	 */
	async function getImage() {
		image = await _getImage(project.thumbnail);
	}

	onMount(() => {
		getImage();
	});
</script>

{#if image}
	<a href={url}>
		<div class="bg-brand-accent rounded cursor-pointer">
			<img
				src={image}
				alt="Project thumbnail"
				class="rounded-t h-38 bg-cover w-full"
				tabindex={0}
				role="link"
				aria-label={`${project.name} project`}
			/>
			<p class="p-3">{project.overview}</p>
		</div></a
	>
{:else}
	<div class="bg-brand-accent h-42 rounded" />
{/if}
