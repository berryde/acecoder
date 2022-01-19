<script lang="ts">
	export let percentage: number;
</script>

<div class="container bg-brand-background rounded-full">
	<div class="absolute progress rounded-full bg-blue-700" style="--percentage: {percentage}px" />
</div>

<style>
	.container {
		width: 100px;
		height: 0.5rem;
	}
	.progress {
		width: var(--percentage);
		height: 0.5rem;
	}
</style>
