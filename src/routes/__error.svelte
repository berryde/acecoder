<script context="module">
	/** @type {import('@sveltejs/kit').ErrorLoad} */
	export function load({ error, status }) {
		return {
			props: {
				status: status,
				message: error.message
			}
		};
	}
</script>

<script lang="ts">
	export let status: number;
	export let message: string;

	import Error from 'src/pages/error/Error.svelte';
</script>

<Error {status} {message} />
