<script lang="ts">
	import type { ConsoleMessage } from 'src/utils/types';
	import FaTerminal from 'svelte-icons/fa/FaTerminal.svelte';
	import FaChevronDown from 'svelte-icons/fa/FaChevronDown.svelte';
	import FaChevronUp from 'svelte-icons/fa/FaChevronUp.svelte';

	export let messages: ConsoleMessage[];
	let expanded = false;

	function toggleExpand() {
		expanded = !expanded;
	}

	function getMessageClass(type: string) {
		switch (type) {
			case 'warn':
				return 'bg-yellow-400 text-gray-900';
			case 'error':
				return 'bg-red-400 text-red-900';
			default:
				return 'text-bluegray-light';
		}
	}
</script>

<div
	class="w-full text-bluegray-light flex flex-row justify-between px-5 py-2 items-center z-20"
	on:click={toggleExpand}
>
	<div class="flex flex-row items-center ">
		<div class="h-4 mr-2">
			<FaTerminal />
		</div>
		<p>Console</p>
	</div>
	<div class="h-4">
		{#if expanded}
			<FaChevronDown />
		{:else}
			<FaChevronUp />
		{/if}
	</div>
</div>
{#if expanded}
	{#each messages as message}
		<div class="pl-5 p-2 {getMessageClass(message.type)}">
			<div class="w-11/12">
				<pre class="whitespace-pre-wrap">{message.data}</pre>
			</div>
		</div>
	{/each}
{/if}
