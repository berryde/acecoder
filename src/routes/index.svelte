<script>
	import Homepage from 'src/pages/Homepage.svelte';
	import PrivateRoute from 'src/components/auth/PrivateRoute.svelte';
</script>

<svelte:head>
	<title>Svelte Application</title>
</svelte:head>

<PrivateRoute>
	<Homepage />
</PrivateRoute>
