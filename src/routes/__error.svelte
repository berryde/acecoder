<script context="module" lang="ts">
	/** @type {import('@sveltejs/kit').ErrorLoad} */
	export function load({ error, status }: { error: { message: string }; status: string }) {
		return {
			props: {
				status: status,
				message: error.message
			}
		};
	}
</script>

<script lang="ts">
	export let status: number = 404;
	export let message: string = '';

	function getErrorMessage() {
		switch (status) {
			case 403:
				return 'You do not have the correct permissions to view this page.';
			case 404:
				return "We couldn't find the page you were looking for.";
			case 500:
				return 'Something went wrong with our server. Please try again later';
			default:
				return 'An unknown error occurred';
		}
	}
</script>

<svelte:head>
	<title>Error - Acecoder</title>
</svelte:head>

<div
	class="h-screen w-screen flex flex-col justify-center items-center bg-brand-background text-brand-text"
>
	<p class="text-7xl">{status}</p>
	<p class="font-bold">{getErrorMessage()}</p>
	{#if import.meta.env.DEV && message}
		<div
			class="dev-error p-3 bg-brand-danger-dark bg-opacity-50 text-brand-danger-light rounded mt-3"
		>
			<p>Error message:</p>
			<p class="">{message}</p>
		</div>
	{/if}
</div>

<style>
	.dev-error {
		font-family: monospace !important;
	}
</style>
