<script lang="ts">
	export let title: string;
</script>

<div class="h-screen w-full bg-bluegray-dark text-bluegray-light flex flex-col">
	<div class="pl-3 pt-3 font-bold uppercase text-xs">{title}</div>
	<div class="pt-3 flex-grow"><slot /></div>
</div>
