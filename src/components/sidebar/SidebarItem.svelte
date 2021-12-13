<script lang="ts">
	/**
	 * The title of this sidebar item.
	 */
	export let title: string;
</script>

<div
	class="h-screen w-full bg-gray-200 dark:bg-dark-bgdark dark:text-dark-text flex flex-col overflow-y-auto overflow-x-hidden"
>
	<div class="pl-3 pt-3 font-bold uppercase text-xs">{title}</div>
	<div class="pt-3 flex-grow"><slot /></div>
</div>
