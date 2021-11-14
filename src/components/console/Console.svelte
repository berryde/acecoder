<script lang="ts">
	import type { ConsoleMessage } from 'src/utils/types';
	import IoIosCloseCircle from 'svelte-icons/io/IoIosCloseCircle.svelte';
	import IoIosWarning from 'svelte-icons/io/IoIosWarning.svelte';
	import MdAutorenew from 'svelte-icons/md/MdAutorenew.svelte';
	import FaTerminal from 'svelte-icons/fa/FaTerminal.svelte';
	import { clearConsole } from '../../utils/console/console';

	export let messages: ConsoleMessage[];

	function getMessageClass(type: string) {
		switch (type) {
			case 'warn':
				return 'bg-yellow-400 text-yellow-400 bg-opacity-50 border-yellow-300';
			case 'error':
				return 'bg-red-900 text-red-400 bg-opacity-50 border-red-800';
			default:
				return 'text-bluegray-light';
		}
	}
</script>

<div class="flex flex-col h-full">
	<div class="w-full text-bluegray-light flex flex-row justify-between px-5 py-2 items-center">
		<div class="flex flex-row items-center">
			<div class="h-4 mr-2">
				<FaTerminal />
			</div>
			<p>Console</p>
		</div>
		<div
			class="h-4"
			on:click={() => {
				clearConsole();
			}}
		>
			<MdAutorenew />
		</div>
	</div>
	<div class="flex-grow overflow-y-auto bg-bluegray-dark text-sm">
		{#if messages.length > 0}
			{#each messages as message, index}
				<div class="p-2 {getMessageClass(message.type)} {index > 0 && 'border-t'} flex flex-row">
					<div class="h-3 mt-1 mr-2 w-5">
						{#if message.type == 'error'}
							<IoIosCloseCircle />
						{:else if message.type == 'warn'}
							<IoIosWarning />
						{/if}
					</div>
					<pre class="whitespace-pre-wrap">{message.data}</pre>
				</div>
			{/each}
		{:else}
			<div class="pl-5 p-2 {getMessageClass('default')} ">There is no console output.</div>
		{/if}
	</div>
</div>
