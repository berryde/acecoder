<script lang="ts">
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';
	import { onMount } from 'svelte';
	import Navbar from 'src/components/navbar/Navbar.svelte';
	import {
		getBadges,
		getCertificateForProject,
		getProject,
		getProjectSettings
	} from 'src/utils/project/project';
	import { page } from '$app/stores';
	import type { Project, Badge as BadgeType, ProjectSettings } from 'src/utils/types';
	import Badge from 'src/components/projects/Badge.svelte';
	import { completeProject } from 'src/utils/firebase';
	import Download from 'src/components/projects/Download.svelte';
	import { getName } from 'src/utils/auth/auth';
	import CertificateLink from 'src/components/projects/CertificateLink.svelte';

	let project: Project;
	let completed: boolean;
	let badges: BadgeType[] = [];
	let settings: ProjectSettings;
	let loading = true;
	let certificateID: string;

	onMount(async () => {
		loading = true;
		project = await getProject($page.params.projectID);
		settings = await getProjectSettings($page.params.projectID, project.languages[0]);
		completed = settings.completed;
		if (!completed) {
			const result = await completeProject($page.params.projectID, getName());
			certificateID = result.certificateID;
			badges = Object.values(result.badges);
		} else {
			badges = await getBadges({ projectID: $page.params.projectID });
			certificateID = await getCertificateForProject($page.params.projectID);
		}
		loading = false;
	});
</script>

<PrivateRoute {loading}>
	<div
		class="w-screen min-h-screen bg-brand-background flex flex-col items-center text-brand-text overflow-y-auto"
	>
		<Navbar />
		<div class="w-full lg:max-w-6xl h-full px-20 py-10 space-y-5">
			<div>
				<p class="text-3xl font-bold">Project completed</p>
				<p class="uppercase ">{project.name}</p>
			</div>
			{#if badges.length != 0}
				<div>
					<p class="text-xl font-bold mb-3">
						{completed ? 'Badges unlocked' : 'New badges unlocked!'}
					</p>
					<div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{#each badges as badge}
							<Badge {badge} isNew={!completed} />
						{/each}
					</div>
				</div>
			{/if}
			<CertificateLink {certificateID} />
			<Download />
		</div>
	</div>
</PrivateRoute>
