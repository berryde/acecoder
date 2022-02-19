<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { sineInOut } from 'svelte/easing';
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';
	import Page from 'src/components/common/Page.svelte';
	import { getName } from 'src/utils/auth/auth';
	import { getBadges, getCertificates } from 'src/utils/project/project';
	import type { Badge, UserCertificate } from 'src/utils/types';
	import Badges from 'src/components/profile/Badges.svelte';
	import { page } from '$app/stores';

	let badges: Badge[] = [];
	let certificates: Record<string, UserCertificate> = {};
	let achievementCount = tweened(0, { duration: 300, easing: sineInOut });
	let completed = tweened(0, { duration: 300, easing: sineInOut });

	let loading = true;

	async function loadProfile() {
		// Get badges for user
		// Get certificates for user
		badges = await getBadges($page.params.uid);
		certificates = await getCertificates($page.params.uid);

		completed.set(Object.keys(certificates).length);
		achievementCount.set(badges.length);
		loading = false;
	}
</script>

<PrivateRoute on:authenticated={loadProfile} {loading}>
	<Page>
		<p class="text-3xl font-bold">{getName(true)}'s profile</p>
		<div class="flex space-x-10">
			<div>
				<p class="text-5xl font-light">{parseFloat($completed.toFixed(2))}</p>
				<p class="text-sm uppercase">Projects completed</p>
			</div>
			<div>
				<p class="text-5xl font-light">{parseFloat($achievementCount.toFixed(2))}</p>
				<p class="text-sm uppercase">Achievements unlocked</p>
			</div>
		</div>
		<div class="flex flex-col space-y-3">
			<div>
				<p class="text-lg font-bold">Certificates</p>
				<p>Select a project name to view the respective certificate</p>
			</div>
			<div class="flex flex-wrap space-x-3">
				{#each Object.entries(certificates) as [id, certificate]}
					<a class="bg-brand-accent p-2 px-4 rounded" href="/certificate/{id}">
						<p>{certificate.projectName}</p>
					</a>
				{/each}
			</div>
		</div>
		<div>
			<p class="text-lg font-bold">Achievements</p>
			<p>
				Achievments are awarded for reaching project milestones. Hover over an achievement to find
				out more.
			</p>
			<Badges {badges} />
		</div>
	</Page>
</PrivateRoute>
