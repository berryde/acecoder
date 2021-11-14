<script lang="ts">
	export let title: string;
</script>

<div class="sidebar-item h-screen bg-bluegray-dark text-bluegray-light">
	<div class="pl-3 pt-3 w-full font-bold uppercase text-xs">{title}</div>
	<div class="pt-3"><slot /></div>
</div>

<style>
	.sidebar-item {
		min-width: 12rem;
		max-width: 12rem;
	}
</style>
