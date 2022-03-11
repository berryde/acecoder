<script lang="ts">
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';
	import { onMount } from 'svelte';
	import Page from 'src/components/common/Page.svelte';
	import {
		getBadges,
		getCertificateForProject,
		getProject,
		getProjectSettings
	} from 'src/utils/project/project';
	import { page } from '$app/stores';
	import type { Project, Badge as BadgeType, ProjectSettings } from '~shared/types';
	import Badges from 'src/components/profile/Badges.svelte';
	import { auth, completeProject } from 'src/utils/firebase';
	import Download from 'src/components/projects/Download.svelte';
	import CertificateLink from 'src/components/projects/CertificateLink.svelte';
	import { getName } from 'src/utils/auth/auth';
	import { ERR_NO_AUTH } from 'src/utils/constants';

	/**
	 * The project that has been finished
	 */
	let project: Project;

	/**
	 * Whether the project has been completed before
	 */
	let completed: boolean;

	/**
	 * The badges awarded for completing this project
	 */
	let badges: BadgeType[] = [];

	/**
	 * The user's settings for this project
	 */
	let settings: ProjectSettings;

	/**
	 * Whether the page is loading
	 */
	let loading = true;

	/**
	 * The ID of the certificate awarded for completing this project
	 */
	let certificateID: string;

	onMount(async () => {
		loading = true;
	});

	async function onAuth() {
		if (!auth.currentUser) throw new Error(ERR_NO_AUTH);

		try {
			project = await getProject($page.params.projectID);
		} catch (err) {
			console.error('That project does not exist');
			window.location.href = '/error/404';
		}
		if (!project) return;

		settings = await getProjectSettings($page.params.projectID, project.languages[0]);

		completed = settings.completed;
		if (settings.progress < project.exerciseCount - 1) {
			console.error(`You have not completed the project '${project.name}' yet`);
			window.location.href = '/error/403';
		} else if (!completed) {
			const result = await completeProject(
				$page.params.projectID,
				await getName(auth.currentUser.uid, true)
			);
			certificateID = result.certificateID;
			badges = Object.values(result.badges);
			loading = false;
		} else {
			badges = await getBadges(auth.currentUser!.uid, { projectID: $page.params.projectID });
			certificateID = await getCertificateForProject($page.params.projectID);
			loading = false;
		}
	}
</script>

<PrivateRoute {loading} on:authenticated={onAuth}>
	<Page>
		<div>
			<p class="text-3xl font-bold">Project completed</p>
			<p class="uppercase ">{project.name}</p>
		</div>
		{#if badges.length != 0}
			<div>
				<p class="text-xl font-bold mb-3">
					{completed ? 'Badges unlocked' : 'New badges unlocked!'}
				</p>
				<Badges {badges} />
			</div>
		{/if}
		<CertificateLink {certificateID} />
		<Download />
	</Page>
</PrivateRoute>
