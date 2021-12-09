<script lang="ts">
	import { page } from '$app/stores';
	import IDE from 'src/pages/IDE/IDE.svelte';
	import Explorer from 'src/components/explorer/Explorer.svelte';
	import Feedback from 'src/components/feedback/Feedback.svelte';
	import Settings from 'src/components/settings/Settings.svelte';
	import IoIosFiling from 'svelte-icons/io/IoIosFiling.svelte';
	import IoIosSettings from 'svelte-icons/io/IoIosSettings.svelte';
	import IoMdText from 'svelte-icons/io/IoMdText.svelte';
	import Profile from 'src/components/profile/Profile.svelte';
	import ProfileImage from 'src/components/profile/ProfileImage.svelte';
	import MdBook from 'svelte-icons/md/MdBook.svelte';
	import Exercise from 'src/components/exercise/Exercise.svelte';
	import { exercise, exerciseID, restoreDefaults } from 'src/utils/exercise/exercise';
	import OrbitProgressIndicator from 'src/components/loaders/OrbitProgressIndicator.svelte';
	import { auth } from 'src/utils/firebase';

	const tabs = [
		{
			name: 'profile',
			icon: ProfileImage,
			component: Profile
		},
		{
			name: $exercise ? $exercise.name : 'Exercise',
			icon: MdBook,
			component: Exercise
		},
		{
			name: 'explorer',
			icon: IoIosFiling,
			component: Explorer
		},
		{
			name: 'feedback',
			icon: IoMdText,
			component: Feedback
		},
		{
			name: 'settings',
			icon: IoIosSettings,
			component: Settings
		}
	];

	// Reset all state on mount
	restoreDefaults(false);
	exerciseID.set($page.params.slug);
</script>

<svelte:head>
	<title>Exercise</title>
</svelte:head>

{#if !auth.currentUser}
	<div class="h-screen w-screen bg-dark-bgdark flex justify-center items-center">
		<OrbitProgressIndicator />
	</div>
{:else}
	<IDE sidebarTabs={tabs} />
{/if}
