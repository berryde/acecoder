<script lang="ts">
	export let variant: 'dark' | 'light' = 'dark';
	export let size: 'regular' | 'large' = 'regular';
	export let link: boolean = true;

	/**
	 * Get the size of the logo from the size prop
	 */
	function getSize() {
		if (size == 'regular') return 'h-5';
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
