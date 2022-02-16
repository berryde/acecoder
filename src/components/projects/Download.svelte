<script lang="ts">
	import { page } from '$app/stores';
	import { loadExercise, getExercise } from 'src/utils/exercise/exercise';
	import { exportFilesystem } from 'src/utils/filesystem/filesystem';
	import type { Exercise, ProjectSettings } from 'src/utils/types';
	import Button from '../common/Button.svelte';
	import Card from '../common/Card.svelte';

	let loading = false;
	export let settings: ProjectSettings;

	async function handleDownload() {
		loading = true;
		const exercise: Exercise = await getExercise(
			$page.params.projectID,
			settings.progress.toString(),
			settings.language
		);
		await loadExercise(exercise, settings.language);
		exportFilesystem();
		loading = false;
	}
</script>

<Card title="Your project">
	<p>
		Congratulations on completing this project! Download your final submission to share it with the
		world, or continue working on it.
	</p>
	<div class="flex justify-end space-x-3 mt-3">
		<!-- <Button text="Share on LinkedIn" outline={true} /> -->
		<Button text="Download" on:click={handleDownload} {loading} />
	</div>
</Card>
