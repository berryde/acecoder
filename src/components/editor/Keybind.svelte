<script lang="ts">
	export let keys: string[];
</script>

<div class="flex flex-row space-x-1 h-6 items-center">
	{#each keys as key, index}
		<p
			class="px-1 py-0.5 flex justify-center items-center border border-dark-text border-brand-text rounded uppercase text-xs"
		>
			{key}
		</p>
		{#if index < keys.length - 1}
			<p>+</p>
		{/if}
	{/each}
</div>
