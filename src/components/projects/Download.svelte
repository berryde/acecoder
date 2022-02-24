<script lang="ts">
	import { page } from '$app/stores';
	import { exercise, getExercise, language, loadExercise } from 'src/utils/exercise/exercise';
	import { exportFilesystem } from 'src/utils/filesystem/filesystem';

	import Button from '../common/Button.svelte';
	import Card from '../common/Card.svelte';

	/**
	 * Whether the download is pending
	 */
	let loading = false;

	/**
	 * Download the user's submission for a project
	 */
	async function handleDownload() {
		loading = true;
		exercise.set(await getExercise($page.params.projectID, '0', $language, true));
		await loadExercise();
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
		<Button text="Share on LinkedIn" outline={true} />
		<Button text="Download" on:click={handleDownload} {loading} />
	</div>
</Card>
