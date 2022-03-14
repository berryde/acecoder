<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { sineInOut } from 'svelte/easing';
	import Page from 'src/components/common/Page.svelte';
	import { getName } from 'src/utils/auth/auth';
	import { getBadges, getCertificates } from 'src/utils/project/project';
	import type { Badge, UserCertificate } from '~shared/types';
	import Badges from 'src/components/profile/Badges.svelte';
	import { page } from '$app/stores';
	import OrbitProgressIndicator from 'src/components/loaders/OrbitProgressIndicator.svelte';
	import { onMount } from 'svelte';

	let badges: Badge[] = [];
	let certificates: Record<string, UserCertificate> = {};
	let achievementCount = tweened(0, { duration: 300, easing: sineInOut });
	let completed = tweened(0, { duration: 300, easing: sineInOut });
	let name: string;

	/**
	 * Whether the page is loading
	 */
	let loading = true;
	/**
	 * Whether the component has mounted in the browser
	 */
	let mounted = false;

	onMount(() => {
		mounted = true;
	});

	/**
	 * Load the user's profile data
	 */
	async function loadProfile() {
		name = await getName($page.params.uid, true);

		if (name == '') {
			window.location.href = '/error/404';
		}

		// Get badges for user
		// Get certificates for user
		badges = await getBadges($page.params.uid);
		certificates = await getCertificates($page.params.uid);
		completed.set(Object.keys(certificates).length);
		achievementCount.set(badges.length);
		loading = false;
	}

	$: $page && mounted && loadProfile();
</script>

<svelte:head>
	<title>Acecoder - Profile</title>
</svelte:head>

{#if loading}
	<div class="h-screen w-screen bg-brand-background flex justify-center items-center">
		<OrbitProgressIndicator />
	</div>
{:else}
	<Page>
		<p class="text-3xl font-bold">{name}'s profile</p>
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
{/if}
