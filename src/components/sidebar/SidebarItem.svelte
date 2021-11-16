<script lang="ts">
	export let title: string;
</script>

<div class="h-screen w-full bg-gray-200 dark:bg-bluegray-800 dark:text-bluegray-300 flex flex-col">
	<div class="pl-3 pt-3 font-bold uppercase text-xs">{title}</div>
	<div class="pt-3 flex-grow"><slot /></div>
</div>
