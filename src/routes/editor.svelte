<script lang="ts">
	import IDE from 'src/pages/IDE/IDE.svelte';
	import Explorer from 'src/components/explorer/Explorer.svelte';
	import Feedback from 'src/components/feedback/Feedback.svelte';
	import Settings from 'src/components/settings/Settings.svelte';
	import IoIosFiling from 'svelte-icons/io/IoIosFiling.svelte';
	import IoIosSettings from 'svelte-icons/io/IoIosSettings.svelte';
	import IoMdText from 'svelte-icons/io/IoMdText.svelte';
	import Profile from 'src/components/profile/Profile.svelte';
	import ProfileImage from 'src/components/profile/ProfileImage.svelte';
	import { restoreDefaults } from 'src/utils/exercise/exercise';
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';

	const tabs = [
		{
			name: 'profile',
			icon: ProfileImage,
			component: Profile
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

	restoreDefaults(true);
</script>

<svelte:head>
	<title>Editor</title>
</svelte:head>

<PrivateRoute>
	<IDE sidebarTabs={tabs} />
</PrivateRoute>
