<script lang="ts">
	import IDE from 'src/components/editor/IDE.svelte';
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';
	import { getProject, getProjectSettings, getResults } from 'src/utils/project/project';
	import {
		exercise,
		getExercise,
		language,
		loadExercise,
		project
	} from 'src/utils/exercise/exercise';
	import { page } from '$app/stores';
	import { selectedTab, tabs } from 'src/utils/tabs/tabs';
	import { contents } from 'src/utils/editor/editor';
	import { getFile } from 'src/utils/filesystem/filesystem';
	import type { FSFile } from '~shared/types';

	/**
	 * Whether the page is loading
	 */
	let loading = true;

	/**
	 * Load the exercise into the application and set up any required state
	 */
	async function initialise() {
		// Check if the user has unlocked this exercise
		const settings = await getProjectSettings($page.params.projectID);
		if (settings.progress < parseInt($page.params.index)) {
			console.error(
				'You have not reached this exercise yet. Please complete the earlier exercises.'
			);
			window.location.href = '/error/403';
		} else {
			try {
				exercise.set(
					await getExercise($page.params.projectID, $page.params.index, settings.language)
				);
				project.set(await getProject($page.params.projectID));
				language.set(Object.keys($exercise.files)[0]);
				const editable = Object.keys($exercise.files[$language]).filter(
					(filename) => $exercise.files[$language][filename].modifiable
				);
				tabs.set(editable);
				await getResults($page.params.projectID, $page.params.index);
				selectedTab.set(editable[0]);
				await loadExercise();
				contents.set((getFile($selectedTab) as FSFile).value);
				loading = false;
			} catch (err) {
				console.error(err);
				window.location.href = '/error/404';
			}
		}
	}
</script>

<svelte:head>
	<title>{$exercise ? `${$exercise.name} - Acecoder` : 'Loading - Acecoder'}</title>
</svelte:head>

<PrivateRoute {loading} on:authenticated={initialise}>
	<IDE />
</PrivateRoute>
