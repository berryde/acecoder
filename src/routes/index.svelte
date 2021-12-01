<script>
	import Homepage from 'src/pages/homepage/Homepage.svelte';
	import PrivateRoute from '../components/auth/PrivateRoute.svelte';
</script>

<svelte:head>
	<title>Svelte Application</title>
</svelte:head>

<PrivateRoute>
	<Homepage />
</PrivateRoute>
