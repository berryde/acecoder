<script lang="ts">
	import { page } from '$app/stores';
	import IDE from 'src/pages/IDE/IDE.svelte';

	import { exerciseID, restoreDefaults } from 'src/utils/exercise/exercise';
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';

	// Reset all state on mount
	restoreDefaults();
	exerciseID.set($page.params.slug);

	// Load the exercise into the filesystem
	// Open the default tab
</script>

<svelte:head>
	<title>Exercise</title>
</svelte:head>

<PrivateRoute>
	<IDE />
</PrivateRoute>
