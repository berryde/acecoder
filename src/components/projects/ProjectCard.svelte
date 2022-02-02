<script lang="ts">
	import type { Project } from 'src/utils/types';
	import Photos from 'svelte-icons/io/IoIosPhotos.svelte';
	import Icon from '../common/Icon.svelte';
	export let project: Project;
	export let projectID: string;

	function handleClick() {
		window.location.href = '/project/' + projectID;
	}
</script>

<div class=" rounded cursor-pointer" on:click={handleClick}>
	<div class="p-10 rounded-t bg-gradient-to-r from-green-400 to-green-600">
		<Icon size="xl">
			<Photos />
		</Icon>
	</div>
	<div class="bg-brand-accent p-4 rounded-b">
		<p>{project.name}</p>
	</div>
</div>
