<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	export const load: Load = async ({ params }) => {
		return {
			status: parseInt(params.status)
		};
	};
</script>
