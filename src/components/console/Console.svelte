<script lang="ts">
	import type { PreviewMessage } from 'src/utils/types';
	import IoIosCloseCircle from 'svelte-icons/io/IoIosCloseCircle.svelte';
	import IoIosWarning from 'svelte-icons/io/IoIosWarning.svelte';
	import Icon from '../common/Icon.svelte';
	import FaTerminal from 'svelte-icons/fa/FaTerminal.svelte';
	import { clearConsole } from '../../utils/console/console';
	import MdAutorenew from 'svelte-icons/md/MdAutorenew.svelte';

	export let messages: PreviewMessage[];

	function getMessageClass(type: string) {
		switch (type) {
			case 'warn':
				return 'bg-yellow-400 text-yellow-800 dark:text-yellow-400 bg-opacity-50 border-yellow-700 dark:border-yellow-300';
			case 'error':
				return 'bg-red-400 dark:bg-red-900 text-red-800 dark:text-red-400  bg-opacity-50 border-red-800';
			default:
				return 'dark:text-dark-text';
		}
	}

	function groupMessages(messages: PreviewMessage[]) {
		const output: { message: PreviewMessage; count: number }[] = [];
		for (let i = 0; i < messages.length; i++) {
			if (
				i > 0 &&
				messages[i].data == messages[i - 1].data &&
				messages[i].type == messages[i - 1].type
			) {
				output[output.length - 1].count++;
			} else {
				output.push({
					message: messages[i],
					count: 1
				});
			}
		}
		return output;
	}
</script>

<div class="flex flex-col h-full overflow-x-hidden">
	<div
		class="w-full bg-gray-200 dark:bg-dark-bglight dark:text-dark-text flex flex-row justify-between px-5 py-2 items-center"
	>
		<div class="flex flex-row items-center">
			<Icon>
				<FaTerminal />
			</Icon>
			<p class="pl-2">Console</p>
		</div>
		<Icon
			on:click={() => {
				clearConsole();
			}}
			button={true}
		>
			<MdAutorenew />
		</Icon>
	</div>
	<div class="flex-grow overflow-y-auto text-sm dark:bg-dark-bgdark">
		{#if messages.length > 0}
			{#each groupMessages(messages) as groupedMessage, index}
				<div
					class="p-2 {getMessageClass(groupedMessage.message.type)} {index > 0 &&
						'border-t'} flex flex-row items-center"
				>
					<div
						class="text-xs {getMessageClass(
							groupedMessage.message.type
						)} rounded-full h-4 w-4 text-center  {groupedMessage.count > 1
							? 'visible'
							: 'invisible'}"
					>
						{groupedMessage.count}
					</div>
					<div class="h-3 mx-1 w-5">
						{#if groupedMessage.message.type == 'error'}
							<IoIosCloseCircle />
						{:else if groupedMessage.message.type == 'warn'}
							<IoIosWarning />
						{/if}
					</div>
					<pre class="whitespace-pre-wrap">{groupedMessage.message.data}</pre>
				</div>
			{/each}
		{:else}
			<div class="pl-5 p-2 {getMessageClass('default')} ">There is no console output.</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.warn {
	}
</style>
