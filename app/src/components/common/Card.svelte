<script lang="ts">
	/**
	 * The title to show on this card
	 */
	export let title: string | undefined = undefined;
</script>

<div class="bg-brand-accent p-6 rounded space-y-3">
	{#if title}
		<div class="flex justify-between ">
			<p class="text-xl font-bold">{title}</p>
			<slot name="action" />
		</div>
	{/if}
	<slot />
</div>
