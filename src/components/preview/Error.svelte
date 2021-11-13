<script lang="ts">
	import type { WorkerError } from 'src/utils/types';
	import IoMdClose from 'svelte-icons/io/IoMdClose.svelte';
	export let error: WorkerError;

	function close() {
		error = undefined;
	}
</script>

{#if error}
	<div class="z-10 absolute inset-0 bg-opacity-50 bg-white p-5">
		<div class="flex flex-row justify-between">
			<p class="text-red-600 text-lg font-bold">{error.title}</p>
			<div class="h-4" on:click={close}><IoMdClose /></div>
		</div>
		<p>{error.subtitle}</p>
		<pre
			class="whitespace-pre-wrap ">{error.raw.stack.substring(error.raw.stack.indexOf("\n") + 1)}</pre>
	</div>
{/if}
