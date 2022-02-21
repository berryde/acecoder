<script lang="ts">
	export let variant: 'dark' | 'light' = 'dark';
	export let size: 'regular' | 'large' = 'regular';
	export let link: boolean = true;

	function getSize() {
		if (size == 'regular') return 'h-6';
		return 'h-12';
	}
</script>

{#if link}
	<a
		class="flex flex-row items-center cursor-pointer {variant == 'dark'
			? 'text-brand-accent'
			: 'text-brand-text'} font-sans space-x-2"
		href="/dashboard"
	>
		<img src="/images/logo-{variant}.png" class={getSize()} alt="logo" />
	</a>
{:else}
	<img src="/images/logo-{variant}.png" class={getSize()} alt="logo" />
{/if}
