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
		project = await getProject($page.params.projectID);
		settings = await getProjectSettings($page.params.projectID, project.languages[0]);
		completed = settings.completed;
		if (!completed) {
			const result = await completeProject(
				$page.params.projectID,
				await getName(auth.currentUser.uid, true)
			);
			certificateID = result.certificateID;
			badges = Object.values(result.badges);
		} else {
			badges = await getBadges(auth.currentUser!.uid, { projectID: $page.params.projectID });
			certificateID = await getCertificateForProject($page.params.projectID);
		}
		loading = false;
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
