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
	import GenericError from 'src/components/auth/GenericError.svelte';

	export let status: number = 404;
	export let message: string = '';
</script>

<GenericError {status} {message} />
