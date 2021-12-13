<script lang="ts">
	export let keys: string[];
</script>

<div class="flex flex-row space-x-1">
	{#each keys as key, index}
		<p
			class="px-1 py-0.5 flex justify-center items-center border dark:border-dark-text border-light-text rounded uppercase text-xs"
		>
			{key}
		</p>
		{#if index < keys.length - 1}
			<p>+</p>
		{/if}
	{/each}
</div>
