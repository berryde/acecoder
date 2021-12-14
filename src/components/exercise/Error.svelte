<script lang="ts">
	import MdArrowDropDown from 'svelte-icons/md/MdArrowDropDown.svelte';
	import MdArrowDropUp from 'svelte-icons/md/MdArrowDropUp.svelte';
	export let message: string;

	let collapsed = true;

	function click() {
		collapsed = !collapsed;
	}
</script>

<div
	class="flex flex-row bg-red-900 mt-2 bg-opacity-50 text-red-500 rounded py-2 pr-2 overflow-hidden"
	on:click={() => click()}
>
	<div class="h-5 m-0 p-0 flex-shrink-0">
		{#if collapsed}
			<MdArrowDropDown />
		{:else}
			<MdArrowDropUp />
		{/if}
	</div>
	<pre
		class="whitespace-pre-wrap text-xs leading-5 ">
		{collapsed ? message.substring(0, Math.min(100, message.length)).split('\n')[0] : message}
	</pre>
</div>
