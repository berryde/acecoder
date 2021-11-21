<script>
	import IDE from '../pages/IDE/IDE.svelte';

	import PrivateRoute from '../components/auth/PrivateRoute.svelte';
</script>

<svelte:head>
	<title>Svelte Application</title>
</svelte:head>

<PrivateRoute>
	<IDE />
</PrivateRoute>
