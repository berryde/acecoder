<script lang="ts">
	import IDE from 'src/pages/IDE/IDE.svelte';
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';
	import { getExercise, getProject, getProjectSettings } from 'src/utils/project/project';
	import { exercise, language, project } from 'src/utils/exercise/exercise';
	import { page } from '$app/stores';
	import { selectedTab, tabs } from 'src/utils/tabs/tabs';

	let loading = true;

	async function loadExercise() {
		// Check if the user has unlocked this exercise
		const settings = await getProjectSettings($page.params.projectID);
		if (settings.progress < parseInt($page.params.index)) {
			window.location.href = '/error/404';
		} else {
			try {
				exercise.set(
					await getExercise($page.params.projectID, $page.params.index, [settings.language])
				);
				project.set(await getProject($page.params.projectID));
				language.set(Object.keys($exercise.files)[0]);
				console.log($exercise.files[$language]);
				const editable = Object.keys($exercise.files[$language]).filter(
					(filename) => $exercise.files[$language][filename].editable
				);
				console.log(editable);
				tabs.set(editable);
				selectedTab.set(editable[0]);
				loading = false;
			} catch (err) {
				console.error(err);
				//window.location.href = '/error/404';
			}
		}
	}
</script>

<svelte:head>
	<title>Exercise</title>
</svelte:head>

<PrivateRoute {loading} on:authenticated={loadExercise}>
	<IDE />
</PrivateRoute>
