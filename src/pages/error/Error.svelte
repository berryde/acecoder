<script lang="ts">
	export let status: number = 404;
	export let message: string = '';

	function getErrorMessage() {
		switch (status) {
			case 404:
				return "We couldn't find the page you were looking for.";
			case 500:
				return 'Something went wrong with our server. Please try again later';
			default:
				return 'An unknown error occurred';
		}
	}
</script>

<div
	class="h-screen w-screen flex flex-col justify-center items-center bg-dark-bgdark text-light-bglight"
>
	<p class="text-7xl">{status}</p>
	<p class="font-bold">{getErrorMessage()}</p>
	{#if import.meta.env.DEV}
		<div class="dev-error p-3 bg-red-900 bg-opacity-50 rounded text-red-500 mt-3">
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
