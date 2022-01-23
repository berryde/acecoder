<script lang="ts">
	import IDE from 'src/pages/IDE/IDE.svelte';
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';

	import {
		getExercise,
		getExerciseChapters,
		getExerciseFiles,
		getProject
	} from 'src/utils/project/project';
	import { exercise, language, project } from 'src/utils/exercise/exercise';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { selectedTab, tabs } from 'src/utils/tabs/tabs';

	let loading = true;
	onMount(async () => {
		const _language = 'react';
		const metadata = await getExercise($page.params.projectID, $page.params.exerciseID);
		const files = await getExerciseFiles($page.params.exerciseID, _language);
		const chapters = await getExerciseChapters($page.params.exerciseID);
		exercise.set({ ...metadata, files: { [_language]: files }, chapters: chapters });
		project.set(await getProject($page.params.projectID));
		language.set('react');

		const editable = Object.keys(files).filter((filename) => files[filename].editable);
		tabs.set(editable);
		selectedTab.set(editable[0]);

		loading = false;
	});
</script>

<svelte:head>
	<title>Exercise</title>
</svelte:head>

<PrivateRoute {loading}>
	<IDE />
</PrivateRoute>
